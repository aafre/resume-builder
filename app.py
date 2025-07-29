import yaml
import tempfile
import shutil
from flask import (
    Flask,
    request,
    send_file,
    jsonify,
    url_for,
    send_from_directory,
)


from werkzeug.middleware.proxy_fix import ProxyFix
import os
import subprocess
import logging
from datetime import datetime
from pathlib import Path
import uuid
import re
import copy
import pdfkit
from jinja2 import Environment, FileSystemLoader

from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)


# LaTeX Helper Functions
def get_social_media_handle(url):
    """Extract social media handle from URL."""
    if url:
        url = url.rstrip("/")
        return url.split("/")[-1]
    return ""


def _escape_latex(text):
    """Escapes special LaTeX characters in a string to prevent compilation errors."""
    if not isinstance(text, str):
        return text

    latex_special_chars = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        "-": r"{-}",
    }

    pattern = re.compile("|".join(re.escape(key) for key in latex_special_chars.keys()))
    escaped_text = pattern.sub(lambda match: latex_special_chars[match.group(0)], text)
    return escaped_text


def _prepare_latex_data(data):
    """Recursively applies LaTeX escaping to all string values in the data dictionary."""
    logging.info("Preparing data for LaTeX rendering, applying escaping and deriving fields.")
    
    prepared_data = copy.deepcopy(data)

    def apply_escaping_recursive(item, current_key=None):
        if isinstance(item, str):
            if current_key == "type":
                return item
            return _escape_latex(item)
        elif isinstance(item, dict):
            return {k: apply_escaping_recursive(v, k) for k, v in item.items()}
        elif isinstance(item, list):
            return [apply_escaping_recursive(elem) for elem in item]
        else:
            return item

    prepared_data = apply_escaping_recursive(prepared_data)

    # Derive linkedin_handle and ensure LinkedIn URL has protocol
    contact_info = prepared_data.get("contact_info", {})
    if contact_info:
        linkedin_url = contact_info.get("linkedin", "")
        if (
            linkedin_url
            and not linkedin_url.startswith("http://")
            and not linkedin_url.startswith("https://")
        ):
            contact_info["linkedin"] = "https://" + linkedin_url
            logging.info(f"Prepended https:// to LinkedIn URL: {contact_info['linkedin']}")

        contact_info["linkedin_handle"] = get_social_media_handle(
            contact_info.get("linkedin", "")
        )
        logging.info(f"Derived LinkedIn handle: {contact_info['linkedin_handle']}")

    prepared_data["contact_info"] = contact_info
    return prepared_data


def generate_latex_pdf(yaml_data, icons_dir, output_path, template_name="classic"):
    """Generate PDF from YAML data using LaTeX template."""
    logging.info(f"Starting LaTeX PDF generation for template: {template_name}")
    
    try:
        # Load and prepare data
        prepared_data = _prepare_latex_data(yaml_data)
        
        # Setup template directory and Jinja2 environment
        template_dir = PROJECT_ROOT / "templates" / template_name
        
        # Configure Jinja2 with LaTeX-compatible delimiters
        latex_env = Environment(
            loader=FileSystemLoader(template_dir),
            block_start_string='\\BLOCK{',
            block_end_string='}',
            variable_start_string='\\VAR{',
            variable_end_string='}',
            comment_start_string='\\#{',
            comment_end_string='}',
            line_statement_prefix='%%',
            line_comment_prefix='%#',
            trim_blocks=True,
            autoescape=False
        )
        
        # Render the LaTeX template
        template = latex_env.get_template("resume.tex")
        latex_content = template.render(**prepared_data)
        
        # Create unique temporary file for LaTeX
        session_id = str(uuid.uuid4())
        temp_dir = Path(tempfile.gettempdir())
        temp_tex_file = temp_dir / f"resume_{session_id}.tex"
        temp_pdf_file = temp_dir / f"resume_{session_id}.pdf"
        
        # Write LaTeX content to temporary file
        with open(temp_tex_file, "w", encoding="utf-8") as f:
            f.write(latex_content)
        
        logging.info(f"LaTeX content written to: {temp_tex_file}")
        
        # Compile LaTeX to PDF using xelatex
        compile_command = [
            "xelatex",
            "-interaction=nonstopmode",
            "-output-directory", str(temp_dir),
            str(temp_tex_file)
        ]
        
        logging.info(f"Running LaTeX compilation: {' '.join(compile_command)}")
        
        result = subprocess.run(
            compile_command,
            capture_output=True,
            text=True,
            cwd=str(temp_dir)
        )
        
        if result.returncode != 0:
            logging.error(f"LaTeX compilation failed with return code {result.returncode}")
            logging.error(f"LaTeX stdout: {result.stdout}")
            logging.error(f"LaTeX stderr: {result.stderr}")
            raise Exception(f"LaTeX compilation failed: {result.stderr}")
        
        # Check if PDF was generated
        if not temp_pdf_file.exists():
            logging.error("PDF file was not generated by LaTeX compilation")
            raise Exception("PDF file was not generated")
        
        # Copy the generated PDF to the output location
        shutil.copy2(temp_pdf_file, output_path)
        logging.info(f"PDF successfully generated at: {output_path}")
        
        # Clean up temporary files
        for pattern in [f"resume_{session_id}.*"]:
            for temp_file in temp_dir.glob(pattern):
                try:
                    temp_file.unlink()
                    logging.debug(f"Cleaned up temporary file: {temp_file}")
                except Exception as e:
                    logging.warning(f"Could not remove temporary file {temp_file}: {e}")
        
        return str(output_path)
        
    except Exception as e:
        logging.error(f"LaTeX PDF generation failed: {str(e)}")
        raise e


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


def generate_html_pdf(yaml_data, template_name, output_file, session_icons_dir=None, session_id=None):
    """Generate PDF from YAML data using HTML template and pdfkit."""
    logging.info(f"Starting HTML PDF generation for template: {template_name}")
    
    try:
        # Set up paths using pathlib
        templates_base_dir = PROJECT_ROOT / "templates"
        default_icons_dir = ICONS_DIR

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
        yaml_data["icon_path"] = f"file://{icon_base_path.as_posix()}"
        yaml_data["css_path"] = f"file://{css_file.as_posix()}"

        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader(template_dir))

        # Process sections and dynamically calculate column count for dynamic-column-list
        sections = yaml_data.get("sections", [])
        for section in sections:
            if section.get("type") == "dynamic-column-list":
                content = section.get("content", [])
                if not isinstance(content, list):
                    raise ValueError(f"Invalid content for dynamic-column-list: {content}")
                section["num_cols"] = calculate_columns(len(content))
                logging.info(
                    f"Calculated {section['num_cols']} columns for section '{section.get('name')}'"
                )

        # Contact info parsing
        contact_info = yaml_data.get("contact_info", {})
        if not isinstance(contact_info, dict):
            raise ValueError(f"Invalid contact_info: {contact_info}")
        if not contact_info:
            raise ValueError("No contact information provided")

        # Social media handle extraction
        linkedin_url = contact_info.get("linkedin", "")

        if linkedin_url and not linkedin_url.startswith("https://"):
            linkedin_url = "https://" + linkedin_url

        if linkedin_url and "linkedin" not in linkedin_url:
            raise ValueError("Invalid LinkedIn URL provided")

        contact_info["linkedin_handle"] = (
            get_social_media_handle(linkedin_url) if linkedin_url else linkedin_url
        )

        # Render HTML with data
        logging.info("Rendering HTML with data...")

        template = env.get_template("base.html")
        html_content = template.render(
            contact_info=contact_info,
            sections=sections,
            icon_path=yaml_data["icon_path"],
            css_path=yaml_data["css_path"],
            font=yaml_data.get("font", "Arial"),
        )

        # Write HTML content to a temporary file with unique name
        temp_dir = Path(tempfile.gettempdir())
        if session_id:
            temp_html_file = temp_dir / f"temp_{template_name}_{session_id}.html"
        else:
            # Use UUID for local runs to avoid conflicts
            unique_id = str(uuid.uuid4())[:8]
            temp_html_file = temp_dir / f"temp_{template_name}_{unique_id}.html"

        with open(temp_html_file, "w") as html_file:
            html_file.write(html_content)
        logging.info(f"HTML written to temporary file: {temp_html_file}")

        # Convert the HTML file to PDF with the enable-local-file-access option
        options = {"enable-local-file-access": ""}

        logging.info("Converting HTML file to PDF...")
        pdfkit.from_file(temp_html_file.as_posix(), output_file, options=options)
        logging.info(f"PDF generated successfully at {output_file}")

        # Clean up temporary HTML file
        try:
            temp_html_file.unlink()  # Remove temp file
            logging.info(f"Temporary HTML file cleaned up: {temp_html_file}")
        except FileNotFoundError:
            # File already removed, no issue
            pass
        except Exception as e:
            logging.warning(f"Could not remove temporary file {temp_html_file}: {e}")
            
        return str(output_file)
        
    except Exception as e:
        logging.error(f"HTML PDF generation failed: {str(e)}")
        raise e


app = Flask(__name__, static_folder="static", static_url_path="/")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

# Define paths for the project
PROJECT_ROOT = Path(__file__).parent.resolve()
ICONS_DIR = PROJECT_ROOT / "icons"
TEMPLATES_DIR = PROJECT_ROOT / "samples" / "modern"
OUTPUT_DIR = PROJECT_ROOT / "output"
os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Template file mapping
TEMPLATE_FILE_MAP = {
    "modern-no-icons": TEMPLATES_DIR / "john_doe_no_icon.yml",
    "modern-with-icons": TEMPLATES_DIR / "john_doe.yml",
    "classic-alex-rivera": PROJECT_ROOT / "samples" / "classic" / "alex_rivera_data.yml",
    "classic-jane-doe": PROJECT_ROOT / "samples" / "classic" / "jane_doe.yml",
}


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    """
    Serve the React app from the static folder. If a specific file is requested
    and exists, serve it. Otherwise, serve 'index.html' for React routes.
    """
    try:
        # If the requested path exists in the static folder, serve it
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        # Otherwise, serve the React app's index.html
        return send_from_directory(app.static_folder, "index.html")
    except Exception as e:
        # Log and handle any unexpected errors gracefully
        return f"An error occurred: {str(e)}", 500


@app.route("/icons/<filename>")
def serve_icons(filename):
    """
    Serve icon files from the icons directory.
    """
    try:
        return send_from_directory(ICONS_DIR, filename)
    except Exception as e:
        logging.error(f"Error serving icon {filename}: {str(e)}")
        return f"Icon not found: {filename}", 404


@app.route("/api/templates", methods=["GET"])
def get_templates():
    """
    Fetch available templates with metadata for display.
    """
    try:
        templates = [
            {
                "id": "modern-no-icons",
                "name": "Modern (No Icons)",
                "description": "Simple and clean layout without icons.",
                "image_url": url_for(
                    "serve_templates", filename="modern-no-icons.png", _external=True
                ),
            },
            {
                "id": "modern-with-icons",
                "name": "Modern (With Icons)",
                "description": "Professional layout with decorative icons.",
                "image_url": url_for(
                    "serve_templates", filename="modern-with-icons.png", _external=True
                ),
            },
            {
                "id": "classic-alex-rivera",
                "name": "Classic - Data Analytics",
                "description": "Professional LaTeX template showcasing data analytics experience.",
                "image_url": url_for(
                    "serve_templates", filename="alex_rivera.png", _external=True
                ),
            },
            {
                "id": "classic-jane-doe",
                "name": "Classic - Marketing",
                "description": "Professional LaTeX template for marketing professionals.",
                "image_url": url_for(
                    "serve_templates", filename="jane_doe.png", _external=True
                ),
            },
        ]
        return jsonify({"success": True, "templates": templates})
    except Exception as e:
        logging.error(f"Error fetching templates: {e}")
        return jsonify({"success": False, "error": "Failed to fetch templates"}), 500


@app.route("/api/template/<template_id>", methods=["GET"])
def get_template_data(template_id):
    """
    Fetch the YAML string for the specified template and determine if it supports icons.
    """
    try:
        # Map template ID to the file name
        template_file = TEMPLATE_FILE_MAP.get(template_id)
        if not template_file:
            logging.warning(f"Template ID not mapped: {template_id}")
            return jsonify({"success": False, "error": "Template not found"}), 404

        # Construct the full path to the YAML file
        template_path = TEMPLATES_DIR / template_file
        if not template_path.exists():
            logging.warning(f"Template file not found: {template_path}")
            return jsonify({"success": False, "error": "Template not found"}), 404

        # Read the YAML content
        with open(template_path, "r") as file:
            yaml_content = yaml.safe_load(file)

        # Check if any section supports icons
        supports_icons = any(
            "icon" in item
            for section in yaml_content.get("sections", [])
            for item in section.get("content", [])
        )

        # Return the YAML content and supportsIcons flag
        return jsonify(
            {
                "success": True,
                "yaml": yaml.safe_dump(yaml_content),
                "template_id": template_id,
                "supportsIcons": supports_icons,
            }
        )
    except FileNotFoundError:
        logging.warning(f"Template file not found for {template_id}")
        return jsonify({"success": False, "error": "Template not found"}), 404
    except Exception as e:
        logging.error(f"Error fetching template data for {template_id}: {e}")
        return (
            jsonify({"success": False, "error": "Failed to fetch template data"}),
            500,
        )


@app.route("/api/template/<template_id>/download", methods=["GET"])
def download_template(template_id):
    """
    Download the YAML file for the specified template.
    """
    try:
        template_path = TEMPLATE_FILE_MAP.get(template_id)
        if not template_path or not template_path.exists():
            logging.warning(f"Template not found for download: {template_id}")
            return jsonify({"success": False, "error": "Template not found"}), 404

        return send_file(
            template_path,
            as_attachment=True,
            mimetype="application/x-yaml",
            download_name=f"{template_id}.yml",
        )
    except Exception as e:
        logging.error(f"Error downloading template {template_id}: {e}")
        return jsonify({"success": False, "error": "Failed to download template"}), 500


@app.route("/api/generate", methods=["POST"])
def generate_resume():
    """
    Generate a resume PDF from the uploaded YAML and optional icons.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Paths for YAML and output
            temp_dir_path = Path(temp_dir)
            yaml_path = temp_dir_path / "input.yaml"
            timestamp = datetime.now().strftime("%Y%m%d_%H_%M_%S")
            output_path = temp_dir_path / f"Resume_{timestamp}.pdf"

            # Validate and save YAML file
            yaml_file = request.files.get("yaml_file")
            if not yaml_file or yaml_file.filename == "":
                raise ValueError("No YAML file uploaded")

            yaml_file.save(yaml_path)

            # Parse YAML to extract icon references
            with open(yaml_path, 'r') as f:
                yaml_data = yaml.safe_load(f)

            # Get session ID for icon isolation
            session_id = request.form.get("session_id")
            if not session_id:
                raise ValueError("No session ID provided")
            
            # Create session-specific icon directory
            session_icons_dir = Path("/tmp") / "sessions" / session_id / "icons"
            session_icons_dir.mkdir(parents=True, exist_ok=True)

            # Copy default icons referenced in YAML to session directory
            def extract_icons_from_yaml(data):
                icons = set()
                if isinstance(data, dict):
                    for key, value in data.items():
                        if key == "icon" and isinstance(value, str):
                            # Frontend now sends clean filenames, but handle both cases
                            clean_icon_name = value.replace('/icons/', '') if value.startswith('/icons/') else value
                            icons.add(clean_icon_name)
                        else:
                            icons.update(extract_icons_from_yaml(value))
                elif isinstance(data, list):
                    for item in data:
                        icons.update(extract_icons_from_yaml(item))
                return icons

            # Always copy base contact icons that are hardcoded in templates
            base_contact_icons = ["location.png", "email.png", "phone.png", "linkedin.png"]
            for icon_name in base_contact_icons:
                default_icon_path = ICONS_DIR / icon_name
                if default_icon_path.exists():
                    session_icon_path = session_icons_dir / icon_name
                    shutil.copy2(default_icon_path, session_icon_path)
                    logging.info(f"Copied base contact icon: {icon_name} to session directory")
                else:
                    logging.warning(f"Base contact icon not found: {icon_name} at {default_icon_path}")

            # Copy additional icons referenced in YAML content
            referenced_icons = extract_icons_from_yaml(yaml_data)
            logging.info(f"Found {len(referenced_icons)} referenced icons: {referenced_icons}")
            for icon_name in referenced_icons:
                # Skip if already copied as base contact icon
                if icon_name in base_contact_icons:
                    continue
                    
                default_icon_path = ICONS_DIR / icon_name
                if default_icon_path.exists():
                    session_icon_path = session_icons_dir / icon_name
                    shutil.copy2(default_icon_path, session_icon_path)
                    logging.info(f"Copied default icon: {icon_name} to session directory")
                else:
                    logging.warning(f"Default icon not found: {icon_name} at {default_icon_path}")

            # Handle icon files if provided - save to session directory
            icon_files = request.files.getlist("icons")
            for icon_file in icon_files:
                if icon_file.filename == "":
                    continue

                # Validate icon file type
                allowed_extensions = {"png", "jpg", "jpeg", "svg"}
                if (
                    "." not in icon_file.filename
                    or icon_file.filename.rsplit(".", 1)[1].lower()
                    not in allowed_extensions
                ):
                    raise ValueError(f"Invalid icon file type: {icon_file.filename}")

                # Save icon to the session-specific icons directory
                icon_path = session_icons_dir / icon_file.filename
                icon_file.save(icon_path)

            # Select the template
            template = request.form.get("template", "modern")
            
            # Map template IDs to actual template directories
            template_mapping = {
                "modern-with-icons": "modern",
                "modern-no-icons": "modern",
                "modern": "modern",
                "classic": "classic",
                "classic-alex-rivera": "classic",
                "classic-jane-doe": "classic",
                "minimal": "minimal"
            }
            
            if template not in template_mapping:
                raise ValueError(
                    f"Invalid template: {template}. Available templates: {', '.join(template_mapping.keys())}"
                )
            
            # Use the mapped template directory
            actual_template = template_mapping[template]
            
            # Unified template dispatch - no subprocess needed
            if actual_template == "classic":
                # Use direct LaTeX generation
                logging.info(f"Using direct LaTeX generation for template: {actual_template}")
                generate_latex_pdf(yaml_data, str(session_icons_dir), str(output_path), actual_template)
            else:
                # Use direct HTML generation (no subprocess)
                logging.info(f"Using direct HTML generation for template: {actual_template}")
                generate_html_pdf(yaml_data, actual_template, str(output_path), str(session_icons_dir), session_id)

            if not output_path.exists():
                logging.error(f"Expected output file at: {output_path}")
                raise FileNotFoundError("The generated resume file was not found")

            # Clean up session directory after successful PDF generation
            try:
                session_dir = Path("/tmp") / "sessions" / session_id
                if session_dir.exists():
                    shutil.rmtree(session_dir)
                    logging.info(f"Cleaned up session directory: {session_dir}")
            except Exception as cleanup_error:
                logging.warning(f"Failed to cleanup session directory: {cleanup_error}")

            # Send the generated PDF file
            return send_file(
                output_path,
                as_attachment=True,
                mimetype="application/pdf",
                download_name=output_path.name,
            )

        except ValueError as ve:
            logging.warning("Validation error: %s", ve)
            return jsonify({"success": False, "error": str(ve)}), 400
        except FileNotFoundError as fnfe:
            logging.error("File error: %s", fnfe)
            return jsonify({"success": False, "error": str(fnfe)}), 500
        except Exception as e:
            logging.error("Unexpected error: %s", e)
            return (
                jsonify({"success": False, "error": "An unexpected error occurred"}),
                500,
            )


@app.route("/download/<filename>")
def download_file(filename):
    """
    Download a generated resume PDF.
    """
    file_path = OUTPUT_DIR / filename
    if file_path.exists():
        return send_file(file_path, as_attachment=True)
    return jsonify({"success": False, "error": "File not found"}), 404


@app.route("/icons/<filename>")
def serve_icon(filename):
    """
    Serve icons from the icons directory for frontend display.
    """
    try:
        icon_path = ICONS_DIR / filename
        if not icon_path.exists():
            return jsonify({"success": False, "error": "Icon not found"}), 404
        
        return send_file(icon_path)
    except Exception as e:
        logging.error(f"Error serving icon {filename}: {e}")
        return jsonify({"success": False, "error": "Icon not found"}), 404


@app.route("/docs/templates/<path:filename>")
def serve_templates(filename):
    """
    Serve template images for display in the frontend.
    """
    try:
        template_image_dir = PROJECT_ROOT / "docs" / "templates"
        return send_file(template_image_dir / filename)
    except Exception as e:
        logging.error(f"Error serving template image {filename}: {e}")
        return jsonify({"success": False, "error": "Image not found"}), 404


@app.errorhandler(404)
def not_found(e):
    """
    Handle 404 errors by serving the React app's index.html for unmatched routes.
    """
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(500)
def internal_server_error(e):
    """
    Handle 500 errors by providing a JSON response or redirecting to a specific route.
    """
    return (
        jsonify({"success": False, "error": "An internal server error occurred."}),
        500,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
