# resume_builder_api/utils.py (or services/resume_generator.py)
import pdfkit
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import yaml


class ResumeGenerator:
    def __init__(self, templates_base_dir: Path, icons_dir: Path, output_dir: Path):
        """
        Initialize the ResumeGenerator with base directories.

        Args:
            templates_base_dir (Path): Directory containing Jinja template subfolders (e.g., templates/).
            icons_dir (Path): Directory containing icon files.
            output_dir (Path): Directory where PDFs and temp files will be saved.
        """
        self.templates_base_dir = templates_base_dir
        self.icons_dir = icons_dir
        self.output_dir = output_dir
        self.output_dir.mkdir(exist_ok=True)

    @staticmethod
    def calculate_columns(num_items, max_columns=4, min_items_per_column=2):
        """Dynamically calculate the number of columns."""
        if num_items <= min_items_per_column:
            return 1
        for cols in range(2, max_columns + 1):
            avg_items_per_col = num_items / cols
            if avg_items_per_col < min_items_per_column:
                return cols - 1
        return max_columns

    @staticmethod
    def get_social_media_handle(url):
        """Extract social media handle from URL."""
        if url:
            return url.rstrip("/").split("/")[-1]
        return ""

    def generate_pdf(
        self, template_name: str, data: dict, output_filename: str
    ) -> Path:
        """
        Generate a PDF resume from provided data using the specified template.

        Args:
            template_name (str): Name of the template folder (e.g., 'modern').
            data (dict): Resume data (e.g., contact_info, sections).
            output_filename (str): Name of the output PDF file (e.g., 'resume.pdf').

        Returns:
            Path: Path to the generated PDF file.

        Raises:
            ValueError: If template directory or data is invalid.
            Exception: If PDF generation fails.
        """
        template_dir = self.templates_base_dir / template_name
        if not template_dir.exists():
            raise ValueError(
                f"Template directory '{template_name}' not found at {template_dir}"
            )

        css_file = template_dir / "styles.css"
        data["icon_path"] = self.icons_dir.as_posix()
        data["css_path"] = css_file.as_posix()

        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader(template_dir))

        # Process dynamic columns
        sections = data.get("sections", [])
        for section in sections:
            if section.get("type") == "dynamic-column-list":
                content = section.get("content", [])
                if not isinstance(content, list):
                    raise ValueError(
                        f"Invalid content for dynamic-column-list: {content}"
                    )
                section["num_cols"] = self.calculate_columns(len(content))
                print(
                    f"Calculated {section['num_cols']} columns for section '{section.get('name')}'"
                )

        # Validate and process contact info
        contact_info = data.get("contact_info", {})
        if not isinstance(contact_info, dict):
            raise ValueError(f"Invalid contact_info: {contact_info}")
        if not contact_info:
            raise ValueError("No contact information provided")

        linkedin_url = contact_info.get("linkedin", "")
        if linkedin_url and not linkedin_url.startswith("https://"):
            linkedin_url = "https://" + linkedin_url
        if linkedin_url and "linkedin" not in linkedin_url:
            raise ValueError("Invalid LinkedIn URL provided")
        contact_info["linkedin_handle"] = (
            self.get_social_media_handle(linkedin_url) if linkedin_url else ""
        )

        # Render HTML
        template = env.get_template("base.html")
        html_content = template.render(
            contact_info=contact_info,
            sections=sections,
            icon_path=self.icons_dir.as_posix(),
            css_path=css_file.as_posix(),
            font=data.get("font", "Arial"),
        )

        # Write temporary HTML file
        temp_html_file = self.output_dir / f"temp_{template_name}.html"
        with open(temp_html_file, "w") as html_file:
            html_file.write(html_content)
        print("HTML written to temporary file:", temp_html_file)

        # Generate PDF
        output_file = self.output_dir / output_filename
        options = {"enable-local-file-access": ""}
        try:
            pdfkit.from_file(
                temp_html_file.as_posix(), output_file.as_posix(), options=options
            )
            print("PDF generated successfully at", output_file)
            return output_file
        except Exception as e:
            raise RuntimeError("Error generating PDF:", e)

        finally:
            temp_html_file.unlink()


def load_resume_data(file_path):
    print("Loading resume data...")
    with open(file_path, "r") as file:
        try:
            data = yaml.safe_load(file)
            if not isinstance(data, dict):
                raise ValueError("Invalid resume data: expected a mapping (dict)")
            return data
        except yaml.YAMLError as e:
            raise ValueError(f"Error parsing YAML file: {e}")
