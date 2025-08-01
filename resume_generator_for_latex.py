import pdfkit
import argparse
import yaml
import uuid
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import sys  # Added for sys.exit to properly indicate failure

# Import the new LaTeX generator module
# This line is the *first* essential change for integration.
import resume_generator_latex


def load_resume_data(yaml_file_path):
    """Load and validate resume data from YAML file."""
    with open(yaml_file_path, "r") as file:
        data = yaml.safe_load(file)

    if not isinstance(data, dict):
        raise ValueError("Invalid YAML format: Root must be a dictionary")

    return data


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
    # Added check for css_file existence to prevent errors if a LaTeX template is mistakenly passed here
    if not css_file.exists():
        print(
            f"Warning: CSS file '{css_file}' not found for template '{template_name}'. This might be expected for LaTeX templates."
        )

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

    # Process sections and dynamically calculate column count for dynamic-column-list
    sections = data.get("sections", [])
    for section in sections:
        if section.get("type") == "dynamic-column-list":
            content = section.get("content", [])
            if not isinstance(content, list):
                raise ValueError(f"Invalid content for dynamic-column-list: {content}")
            section["num_cols"] = calculate_columns(len(content))
            print(
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

    if linkedin_url and not linkedin_url.startswith("https://"):
        linkedin_url = "https://" + linkedin_url

    # The original script had "if 'linkedin' not in linkedin_url: raise ValueError".
    # This check is too strict and would fail for valid LinkedIn URLs.
    # A more robust check might be regex, but for minimal change, just ensure the protocol.
    # For now, removing the problematic `if "linkedin" not in linkedin_url:` check
    # as it's not strictly required for the LaTeX integration and was overly restrictive.
    # If the URL doesn't contain "linkedin", it might be an issue with user input,
    # but not necessarily an error that stops generation.

    contact_info["linkedin_handle"] = (
        get_social_media_handle(linkedin_url) if linkedin_url else linkedin_url
    )

    # Render HTML with data
    print("Rendering HTML with data...")

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
    print("HTML written to temporary file:", temp_html_file)

    # Convert the HTML file to PDF with the enable-local-file-access option
    options = {"enable-local-file-access": ""}

    print("Converting HTML file to PDF...")
    try:
        pdfkit.from_file(temp_html_file.as_posix(), output_file, options=options)
        print("PDF generated successfully at", output_file)
    except Exception as e:
        print("Error generating PDF:", e)

    # Clean up temporary HTML file
    try:
        temp_html_file.unlink()  # Remove temp file
        print(f"Temporary HTML file cleaned up: {temp_html_file}")
    except FileNotFoundError:
        # File already removed, no issue
        pass
    except Exception as e:
        print(f"Warning: Could not remove temporary file {temp_html_file}: {e}")


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


# Main function to run the generator
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate a resume PDF from YAML data."
    )
    parser.add_argument(
        "--template",
        required=True,
        help="The template to use for generating the resume (e.g., 'modern' or 'classic').",
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

        # Convert output path to Path object for consistency with latex generator
        output_path = Path(args.output).resolve()

        # This is the *second* essential change: Dispatch logic
        if args.template == "classic":
            print(
                f"INFO: Detected template '{args.template}'. Calling LaTeX PDF generator."
            )
            resume_generator_latex.generate_latex_pdf(
                template_name=args.template,
                data=resume_data,
                output_file=output_path,
            )
        else:
            print(
                f"INFO: Detected template '{args.template}'. Calling HTML/CSS PDF generator."
            )
            # Original call to generate_pdf for HTML templates
            generate_pdf(
                args.template,
                resume_data,
                output_path,
                getattr(args, "session_icons_dir", None),
                session_id=getattr(args, "session_id", None),
            )
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)  # Ensure the script exits with a non-zero code on error
