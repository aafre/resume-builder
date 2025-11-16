import re
import pdfkit
import argparse
import yaml
import uuid
import logging
import shutil
import subprocess
import os
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

# Configure logging for the subprocess
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s [GENERATOR] %(levelname)s: %(message)s")

# Check wkhtmltopdf binary availability once per run
wkhtmltopdf_binary = shutil.which("wkhtmltopdf") or "/usr/bin/wkhtmltopdf"
try:
    version_output = subprocess.check_output([wkhtmltopdf_binary, "-V"], text=True).strip()
    logging.debug(f"wkhtmltopdf binary: {wkhtmltopdf_binary}")
    logging.debug(f"wkhtmltopdf version: {version_output}")
except Exception as e:
    logging.warning(f"wkhtmltopdf version check failed: {e}")
    logging.warning(f"Attempted binary path: {wkhtmltopdf_binary}")


def load_resume_data(yaml_file_path):
    """Load and validate resume data from YAML file."""
    with open(yaml_file_path, "r") as file:
        data = yaml.safe_load(file)

    if not isinstance(data, dict):
        raise ValueError("Invalid YAML format: Root must be a dictionary")

    return data


def normalize_sections(data):
    """
    Add type attributes to sections for backward compatibility.

    Converts old name-based format to new type-based format:
    - Sections named "Experience" (case-insensitive) get type="experience"
    - Sections named "Education" (case-insensitive) get type="education"

    This allows old YAML files to work without modification while supporting
    multiple experience/education sections with custom names.
    """
    if "sections" not in data:
        return data

    for section in data["sections"]:
        # Skip if section already has a type attribute
        if "type" in section and section["type"]:
            continue

        # Check section name and add appropriate type
        section_name_lower = section.get("name", "").lower()

        if section_name_lower == "experience":
            section["type"] = "experience"
            logging.debug(f"Normalized section '{section.get('name')}' to type='experience'")
        elif section_name_lower == "education":
            section["type"] = "education"
            logging.debug(f"Normalized section '{section.get('name')}' to type='education'")

    return data


def convert_markdown_links_to_html(text):
    """
    Convert Markdown-style links [text](url) to HTML <a> tags.

    Args:
        text: String that may contain markdown links

    Returns:
        String with markdown links converted to HTML anchor tags

    Example:
        "Visit [Google](https://google.com)" -> "Visit <a href=\"https://google.com\">Google</a>"
    """
    if not text or not isinstance(text, str):
        return text

    # Regex to match [text](url) pattern
    pattern = r'\[([^\]]+)\]\(([^\)]+)\)'

    # Replace with HTML anchor tag
    html_text = re.sub(pattern, r'<a href="\2">\1</a>', text)

    return html_text


def convert_markdown_formatting_to_html(text):
    """
    Convert Markdown-style formatting to HTML tags.

    Supports:
    - Bold: **text** or __text__ → <strong>text</strong>
    - Italic: *text* or _text_ → <em>text</em>
    - Strikethrough: ~~text~~ → <s>text</s>
    - Underline: ++text++ → <u>text</u> (custom syntax, not standard markdown)

    Args:
        text: String that may contain markdown formatting

    Returns:
        String with markdown formatting converted to HTML tags

    Example:
        "This is **bold** and *italic*" -> "This is <strong>bold</strong> and <em>italic</em>"
    """
    if not text or not isinstance(text, str):
        return text

    # Process in specific order to avoid conflicts
    # 1. Bold with ** (must come before single *)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)

    # 2. Bold with __ (must come before single _)
    text = re.sub(r'__(.+?)__', r'<strong>\1</strong>', text)

    # 3. Italic with * (after ** is processed)
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)

    # 4. Italic with _ (after __ is processed)
    text = re.sub(r'_(.+?)_', r'<em>\1</em>', text)

    # 5. Strikethrough with ~~
    text = re.sub(r'~~(.+?)~~', r'<s>\1</s>', text)

    # 6. Underline with ++ (custom syntax)
    text = re.sub(r'\+\+(.+?)\+\+', r'<u>\1</u>', text)

    return text


def calculate_columns(num_items, max_columns=4, min_items_per_column=2):
    """
    Dynamically calculate the number of columns and ensure minimum items per column.

    Args:
        num_items (int): The total number of items.
        max_columns (int): The maximum number of columns to allow.
        min_items_per_column (int): Minimum items per column to justify adding a new column.

    Returns:
        int: Calculated number of columns.
    """
    if max_columns < 1:
        raise ValueError("max_columns must be at least 1")

    if num_items <= min_items_per_column:
        return 1  # Single column if items are too few

    # Start with 2 columns and increase dynamically
    for cols in range(2, max_columns + 1):
        avg_items_per_col = num_items / cols
        if avg_items_per_col < min_items_per_column:
            return cols - 1

    return max_columns  # Default to max columns if all checks pass


# Generate PDF from HTML file
def generate_pdf(
    template_name, data, output_file, session_icons_dir=None, session_id=None
):
    # Set up paths using pathlib
    project_root = Path(__file__).parent.resolve()
    templates_base_dir = project_root / "templates"
    default_icons_dir = project_root / "icons"
    output_dir = project_root / "output"

    # Template-specific directory
    template_dir = templates_base_dir / template_name
    if not template_dir.exists():
        raise ValueError(
            f"Template directory '{template_name}' not found at {template_dir}"
        )

    css_file = template_dir / "styles.css"

    # Use session icons directory if provided, otherwise default icons
    if session_icons_dir and Path(session_icons_dir).exists():
        icon_base_path = Path(session_icons_dir)
    else:
        icon_base_path = default_icons_dir

    # Define paths in data dictionary for Jinja rendering - use file:// URLs for wkhtmltopdf
    data["icon_path"] = f"file://{icon_base_path.as_posix()}"
    data["css_path"] = f"file://{css_file.as_posix()}"

    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader(template_dir))

    # Register custom filters for markdown links and formatting
    env.filters['markdown_links'] = convert_markdown_links_to_html
    env.filters['markdown_formatting'] = convert_markdown_formatting_to_html

    # Process sections and dynamically calculate column count for dynamic-column-list
    sections = data.get("sections", [])
    for section in sections:
        if section.get("type") == "dynamic-column-list":
            content = section.get("content", [])
            if not isinstance(content, list):
                raise ValueError(f"Invalid content for dynamic-column-list: {content}")
            section["num_cols"] = calculate_columns(len(content))
            logging.debug(
                f"Calculated {section['num_cols']} columns for section '{section.get('name')}'"
            )

    # Contact info parsing
    contact_info = data.get("contact_info", {})
    if not isinstance(contact_info, dict):
        raise ValueError(f"Invalid contact_info: {contact_info}")
    if not contact_info:
        raise ValueError("No contact information provided")

    # Social media handle extraction
    linkedin_url = contact_info.get("linkedin", "")

    # Only process LinkedIn if URL is provided
    if linkedin_url and linkedin_url.strip():
        if not linkedin_url.startswith("https://"):
            linkedin_url = "https://" + linkedin_url

        if "linkedin" not in linkedin_url.lower():
            raise ValueError("Invalid LinkedIn URL provided")
            
        contact_info["linkedin_handle"] = get_social_media_handle(linkedin_url)
        
        # Generate linkedin_display if not already provided
        if not contact_info.get("linkedin_display"):
            contact_info["linkedin_display"] = generate_linkedin_display_text(
                linkedin_url, contact_info.get("name", "")
            )
            logging.info(f"Generated LinkedIn display text: {contact_info['linkedin_display']}")
    else:
        # Clear LinkedIn fields if URL is empty
        contact_info["linkedin_handle"] = ""
        contact_info["linkedin_display"] = ""
        logging.info("LinkedIn URL empty - cleared LinkedIn fields")

    # Render HTML with data
    logging.info(f"Rendering HTML template for: {template_name}")

    template = env.get_template("base.html")
    html_content = template.render(
        contact_info=contact_info,
        sections=sections,
        icon_path=data["icon_path"],
        css_path=data["css_path"],
        font=data.get("font", "Arial"),
    )

    # Ensure output directory exists
    output_dir.mkdir(exist_ok=True)

    # Write HTML content to a temporary file with unique name
    if session_id:
        temp_html_file = output_dir / f"temp_{template_name}_{session_id}.html"
    else:
        # Use UUID for local runs to avoid conflicts
        unique_id = str(uuid.uuid4())[:8]
        temp_html_file = output_dir / f"temp_{template_name}_{unique_id}.html"

    with open(temp_html_file, "w") as html_file:
        html_file.write(html_content)
    logging.info(f"HTML written to temporary file: {temp_html_file}")

    # Enhanced debug breadcrumbs
    logging.debug(f"Working directory: {os.getcwd()}")
    logging.debug(f"HTML file: {temp_html_file}")
    logging.debug(f"CSS path: {css_file}")
    logging.debug(f"Icon base path: {icon_base_path}")
    logging.debug(f"Output path: {output_file}")

    # Convert the HTML file to PDF with the enable-local-file-access option
    options = {
        "enable-local-file-access": "",
        "load-error-handling": "abort",  # fail fast on missing assets
        "quiet": ""                      # keep stderr tidy
    }

    logging.info(f"Converting HTML file to PDF using wkhtmltopdf")
    logging.debug(f"pdfkit options: {options}")
    try:
        pdfkit.from_file(temp_html_file.as_posix(), output_file, options=options)
        logging.info(f"PDF generated successfully at: {output_file}")
    except Exception as e:
        logging.error(f"pdfkit failed to generate PDF: {str(e)}")
        logging.error(f"Template: {template_name}")
        logging.error(f"Input HTML file: {temp_html_file}")
        logging.error(f"Output path: {output_file}")
        logging.error(f"pdfkit options: {options}")
        # Re-raise the exception to make the subprocess fail
        raise

    # Clean up temporary HTML file
    try:
        temp_html_file.unlink()  # Remove temp file
        logging.debug(f"Temporary HTML file cleaned up: {temp_html_file}")
    except FileNotFoundError:
        # File already removed, no issue
        logging.debug(f"Temporary HTML file already removed: {temp_html_file}")
    except Exception as e:
        logging.warning(f"Could not remove temporary file {temp_html_file}: {e}")


def get_social_media_handle(url):
    """
    Extract social media handle from URL.

    Args:
        url (str): The social media URL.

    Returns:
        str: The social media handle.
    """
    if url:
        # Remove any trailing slashes
        url = url.rstrip("/")
        return url.split("/")[-1]
    return ""


def generate_linkedin_display_text(linkedin_url, contact_name=None):
    """
    Generates smart display text for a LinkedIn profile with quality analysis.

    Args:
        linkedin_url (str): The full LinkedIn URL.
        contact_name (str): The user's full name for fallback generation.
    
    Returns:
        str: A clean, professional display text for the resume.
        
    Examples:
        - "linkedin.com/in/john-fitzgerald-doe" -> "John Fitzgerald Doe"
        - "linkedin.com/in/jane-doe-a1b2c3d4" with name "Jane Doe" -> "Jane Doe"
        - "linkedin.com/in/badhandle12345" without a name -> "LinkedIn Profile"
    """
    # First, validate that this is actually a LinkedIn URL
    if not linkedin_url or "linkedin" not in linkedin_url.lower():
        return "LinkedIn Profile"
    
    raw_handle = get_social_media_handle(linkedin_url)
    
    # If there's no handle, we can't do much.
    if not raw_handle:
        return "LinkedIn Profile"

    # --- Nested helper function for analysis ---
    def is_clean_handle(handle):
        """Determines if a LinkedIn handle is clean and professional."""
        # Rule 1: Too long
        if len(handle) > 50:
            return False
            
        # Rule 2: Too many hyphens
        if handle.count('-') > 1:
            return False
            
        # Rule 3: Long sequences of numbers (e.g., ...1998)
        if re.search(r'\d{4,}', handle):
            return False
            
        # Rule 4: Common random suffixes (e.g., ...-a1b2c3d4)
        if re.search(r'-[a-z0-9]{8,}', handle.lower()):
            return False

        return True

    # --- Main logic ---
    if is_clean_handle(raw_handle):
        # Format the clean handle into a readable name
        parts = raw_handle.replace('_', '-').split('-')
        return ' '.join(part.capitalize() for part in parts if part)
    else:
        # If the handle is messy, use the contact name if available
        if contact_name:
            return contact_name.strip()
        
        # Final fallback if handle is messy and no name is provided
        return "LinkedIn Profile"


# NOTE: This file now serves as CLI-only tool for development/testing
# All production resume generation logic has been moved to Flask app.py for:
# - Unified template dispatch (HTML and LaTeX)
# - Elimination of subprocess overhead
# - Better error handling and performance


# Main function to run the generator
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate a resume PDF from YAML data."
    )
    parser.add_argument(
        "--template",
        required=True,
        help="The template to use for generating the resume (e.g., 'modern').",
    )
    parser.add_argument(
        "--input",
        required=True,
        help="The input YAML file containing the resume data.",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="The output PDF file path to save the generated resume.",
    )
    parser.add_argument(
        "--category",
        help="The template category to use for generating the resume (e.g., 'modern').",
    )
    parser.add_argument(
        "--session-icons-dir",
        help="The session-specific icons directory path for user-uploaded icons.",
    )
    parser.add_argument(
        "--session-id",
        help="The session ID for unique temp file naming.",
    )

    args = parser.parse_args()

    try:
        resume_data = load_resume_data(args.input)
        # Normalize sections for backward compatibility
        resume_data = normalize_sections(resume_data)
        generate_pdf(
            args.template,
            resume_data,
            args.output,
            getattr(args, "session_icons_dir", None),
            session_id=getattr(args, "session_id", None),
        )
    except Exception as e:
        print(f"Error: {e}")
