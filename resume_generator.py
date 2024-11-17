import yaml
import pdfkit
import argparse
from jinja2 import Environment, FileSystemLoader
from pathlib import Path


# Load data from YAML
def load_resume_data(file_path):
    print("Loading resume data...")
    with open(file_path, "r") as file:
        try:
            return yaml.safe_load(file)
        except yaml.YAMLError as e:
            raise ValueError(f"Error parsing YAML file: {e}")


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
    if num_items <= min_items_per_column:
        return 1  # Single column if items are too few

    # Start with 2 columns and increase dynamically
    for cols in range(2, max_columns + 1):
        avg_items_per_col = num_items / cols
        if avg_items_per_col < min_items_per_column:
            return cols - 1

    return max_columns  # Default to max columns if all checks pass


# Generate PDF from HTML file
def generate_pdf(template_name, data, output_file):
    # Set up paths using pathlib
    project_root = Path(__file__).parent.resolve()
    templates_base_dir = project_root / "templates"
    icons_dir = project_root / "icons"
    output_dir = project_root / "output"

    # Template-specific directory
    template_dir = templates_base_dir / template_name
    if not template_dir.exists():
        raise ValueError(
            f"Template directory '{template_name}' not found at {template_dir}"
        )

    css_file = template_dir / "styles.css"

    # Define paths in data dictionary for Jinja rendering
    data["icon_path"] = icons_dir.as_posix()
    data["css_path"] = css_file.as_posix()

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

    if "linkedin" not in linkedin_url:
        raise ValueError("Invalid LinkedIn URL provided")

    contact_info["linkedin_handle"] = (
        get_social_media_handle(linkedin_url) if linkedin_url else linkedin_url
    )

    # Render HTML with data
    print("Rendering HTML with data...")
    template = env.get_template("base.html")
    html_content = template.render(
        contact_info=contact_info,
        sections=sections,
        icon_path=icons_dir.as_posix(),
        css_path=css_file.as_posix(),
        font=data.get("font", "Arial"),
    )

    # Ensure output directory exists
    output_dir.mkdir(exist_ok=True)

    # Write HTML content to a temporary file
    temp_html_file = output_dir / f"temp_{template_name}.html"

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
    temp_html_file.unlink()


def get_social_media_handle(url):
    """
    Extract social media handle from URL.

    Args:
        url (str): The social media URL.

    Returns:
        str: The social media handle.
    """
    if url:
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

    args = parser.parse_args()

    try:
        resume_data = load_resume_data(args.input)
        generate_pdf(args.template, resume_data, args.output)
    except Exception as e:
        print(f"Error: {e}")
