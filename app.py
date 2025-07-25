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

from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)


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
                "minimal": "minimal"
            }
            
            if template not in template_mapping:
                raise ValueError(
                    f"Invalid template: {template}. Available templates: {', '.join(template_mapping.keys())}"
                )
            
            # Use the mapped template directory
            actual_template = template_mapping[template]
            cmd = [
                "python",
                "resume_generator.py",
                "--template",
                actual_template,
                "--input",
                str(yaml_path),
                "--output",
                str(output_path),
                "--session-icons-dir",
                str(session_icons_dir),
                "--session-id",
                session_id,
            ]

            # Generate the resume using subprocess
            logging.info(f"Running command: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
            )

            logging.info(f"Subprocess returncode: {result.returncode}")
            logging.info(f"Subprocess stdout: {result.stdout}")
            if result.stderr:
                logging.error(f"Subprocess stderr: {result.stderr}")

            if result.returncode != 0:
                logging.error(f"Resume generation error: {result.stderr}")
                raise RuntimeError("Failed to generate the resume")

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
