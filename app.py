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
from jinja2 import Environment, FileSystemLoader
from concurrent.futures import ProcessPoolExecutor
import atexit

from flask_cors import CORS

# Configure logging based on environment variable
# Set DEBUG_LOGGING=true to enable detailed debug logs for troubleshooting
# Default: INFO level (production-ready logging)
DEBUG_LOGGING = os.getenv("DEBUG_LOGGING", "false").lower() == "true"
log_level = logging.DEBUG if DEBUG_LOGGING else logging.INFO
logging.basicConfig(
    level=log_level, format="%(asctime)s [%(levelname)s] %(message)s"
)


def pdf_generation_worker(template_name, yaml_path, output_path, session_icons_dir, session_id):
    """
    Worker function for process pool PDF generation.
    
    This runs in an isolated process to prevent Qt WebKit state contamination.
    wkhtmltopdf (used by pdfkit) has Qt threading issues when called directly
    from Flask's multi-threaded context, causing "QNetworkReplyImplPrivate" errors.
    
    By running each PDF generation in a separate process, we ensure:
    - Fresh Qt state for each request (no contamination)
    - Complete isolation from Flask's threading model
    - Reliable PDF generation without Qt concurrency issues
    """
    try:
        import subprocess
        import logging
        from pathlib import Path
        
        # Set up logging for worker process
        logging.basicConfig(level=logging.INFO, format="%(asctime)s [WORKER] %(message)s")
        
        cmd = [
            "python",
            "resume_generator.py",
            "--template",
            template_name,
            "--input",
            str(yaml_path),
            "--output",
            str(output_path),
            "--session-icons-dir",
            str(session_icons_dir),
            "--session-id",
            session_id,
        ]
        
        logging.debug(f"Worker running command: {' '.join(cmd)}")
        
        # Get the project root (worker process needs proper cwd)
        project_root = Path(__file__).parent.resolve()
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=str(project_root)
        )
        
        if result.returncode != 0:
            # Enhanced error logging for subprocess failures
            logging.error(f"Worker subprocess failed with return code {result.returncode}")
            logging.error(f"Command executed: {' '.join(cmd)}")
            logging.error(f"Subprocess stdout: {result.stdout}")
            logging.error(f"Subprocess stderr: {result.stderr}")
            logging.error(f"Working directory: {project_root}")
            logging.error(f"Template: {template_name}, Session: {session_id}")
            error_msg = f"Worker subprocess failed: {result.stderr}"
            return {"success": False, "error": error_msg}
        
        # Verify PDF was created and has content
        pdf_path = Path(output_path)
        if not pdf_path.exists() or pdf_path.stat().st_size == 0:
            # Enhanced error logging for missing or empty PDF
            if not pdf_path.exists():
                logging.error("PDF file was not created by worker subprocess")
            else:
                logging.error("PDF file was created but is empty (0 bytes)")
            logging.error(f"Expected PDF at: {output_path}")
            logging.error(f"Command executed: {' '.join(cmd)}")
            logging.error(f"Subprocess stdout: {result.stdout}")
            logging.error(f"Subprocess stderr: {result.stderr}")
            logging.error(f"Working directory: {project_root}")
            logging.error(f"Template: {template_name}, Session: {session_id}")
            error_msg = "PDF file was not created by worker subprocess"
            return {"success": False, "error": error_msg}
        
        logging.info("Worker PDF generation completed successfully")
        return {"success": True, "output": str(output_path)}
        
    except Exception as e:
        error_msg = f"Worker process failed: {str(e)}"
        logging.error(error_msg)
        return {"success": False, "error": error_msg}


# Initialize process pool for PDF generation
# 
# We use ProcessPoolExecutor instead of direct PDF generation because:
# 1. wkhtmltopdf (pdfkit) has Qt threading conflicts with Flask's multi-threaded nature
# 2. Direct calls cause "QNetworkReplyImplPrivate" errors and Qt state contamination
# 3. Process pool provides isolation while avoiding subprocess startup overhead (~10x faster)
# 4. Pre-warmed worker processes handle concurrent requests efficiently
PDF_PROCESS_POOL = None

def initialize_pdf_pool():
    """
    Initialize the process pool for PDF generation.
    
    Creates a pool of worker processes that handle PDF generation in isolation.
    This prevents Qt WebKit threading issues that occur when wkhtmltopdf is called
    directly from Flask's multi-threaded context.
    """
    global PDF_PROCESS_POOL
    try:
        # Create pool with 3 worker processes
        PDF_PROCESS_POOL = ProcessPoolExecutor(max_workers=3)
        logging.info("PDF process pool initialized with 3 workers")
        
        # Register cleanup function
        atexit.register(cleanup_pdf_pool)
    except Exception as e:
        logging.error(f"Failed to initialize PDF process pool: {e}")
        PDF_PROCESS_POOL = None

def cleanup_pdf_pool():
    """Clean up the process pool on app shutdown."""
    global PDF_PROCESS_POOL
    if PDF_PROCESS_POOL:
        logging.info("Shutting down PDF process pool")
        PDF_PROCESS_POOL.shutdown(wait=True)
        PDF_PROCESS_POOL = None


# Resume Generation Helper Functions
# These functions support both HTML and LaTeX template generation
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
    """
    Generate PDF from YAML data using LaTeX template and XeLaTeX compilation.
    Used for classic templates that require LaTeX formatting.
    """
    # Generate session ID for tracking this request
    session_id = str(uuid.uuid4())
    
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
        
        # Create unique temporary file for LaTeX using existing session_id
        temp_dir = Path(tempfile.gettempdir())
        temp_tex_file = temp_dir / f"resume_{session_id}.tex"
        temp_pdf_file = temp_dir / f"resume_{session_id}.pdf"
        
        # Write LaTeX content to temporary file
        with open(temp_tex_file, "w", encoding="utf-8") as f:
            f.write(latex_content)
        
        logging.debug(f"LaTeX content written to: {temp_tex_file}")
        
        # Compile LaTeX to PDF using xelatex
        compile_command = [
            "xelatex",
            "-interaction=nonstopmode",
            "-output-directory", str(temp_dir),
            str(temp_tex_file)
        ]
        
        logging.debug(f"Running LaTeX compilation: {' '.join(compile_command)}")
        
        result = subprocess.run(
            compile_command,
            capture_output=True,
            text=True,
            cwd=str(temp_dir)
        )
        
        # Check if PDF was generated successfully (primary success indicator)
        if not temp_pdf_file.exists():
            logging.error("PDF file was not generated by LaTeX compilation")
            logging.error(f"LaTeX return code: {result.returncode}")
            logging.error(f"LaTeX stdout: {result.stdout}")
            logging.error(f"LaTeX stderr: {result.stderr}")
            raise Exception("PDF file was not generated")
        
        # Log warnings if present but don't fail if PDF exists
        if result.stderr:
            logging.warning(f"LaTeX compilation warnings: {result.stderr}")
        
        # Only fail on non-zero return code if PDF wasn't generated
        if result.returncode != 0:
            logging.warning(f"LaTeX compilation completed with warnings (return code {result.returncode})")
            logging.warning(f"LaTeX stdout: {result.stdout}")
        
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
        # Complete error context for debugging - ONLY on actual errors
        logging.error(f"LaTeX PDF generation failed for template '{template_name}', Session: {session_id}")
        logging.error(f"Error: {str(e)}")
        logging.error(f"YAML data for reproduction: {yaml_data}")
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



app = Flask(__name__, static_folder="static", static_url_path="/")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

# Initialize PDF process pool on app startup
initialize_pdf_pool()

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
                "id": "classic-alex-rivera",
                "name": "Professional",
                "description": "Clean, structured layout with traditional formatting and excellent space utilization.",
                "image_url": url_for(
                    "serve_templates", filename="alex_rivera.png", _external=True
                ),
            },
            {
                "id": "classic-jane-doe",
                "name": "Elegant",
                "description": "Refined design with sophisticated typography and organized section layout.",
                "image_url": url_for(
                    "serve_templates", filename="jane_doe.png", _external=True
                ),
            },
            {
                "id": "modern-no-icons",
                "name": "Minimalist",
                "description": "Clean and simple design focused on content clarity and easy readability.",
                "image_url": url_for(
                    "serve_templates", filename="modern-no-icons.png", _external=True
                ),
            },
            {
                "id": "modern-with-icons",
                "name": "Modern",
                "description": "Contemporary design enhanced with visual icons and dynamic styling elements.",
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

        # Determine icon support based on template type, not YAML content
        # Classic templates (LaTeX) don't support icons, Modern templates (HTML) do
        supports_icons = not template_id.startswith("classic")

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

            # Select the template and determine if it uses icons
            template = request.form.get("template", "modern")
            uses_icons = template != "modern-no-icons"  # Skip icons for no-icons variant
            
            if uses_icons:
                # Copy base contact icons that are hardcoded in templates
                base_contact_icons = ["location.png", "email.png", "phone.png", "linkedin.png"]
                for icon_name in base_contact_icons:
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied base contact icon: {icon_name} to session directory")
                    else:
                        logging.warning(f"Base contact icon not found: {icon_name} at {default_icon_path}")
            else:
                logging.debug("Skipping base contact icons for no-icons template variant")

            # Copy additional icons referenced in YAML content (only for icon-supporting templates)
            if uses_icons:
                referenced_icons = extract_icons_from_yaml(yaml_data)
                logging.debug(f"Found {len(referenced_icons)} referenced icons: {referenced_icons}")
                base_contact_icons = ["location.png", "email.png", "phone.png", "linkedin.png"]
                for icon_name in referenced_icons:
                    # Skip if already copied as base contact icon
                    if icon_name in base_contact_icons:
                        continue
                        
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied default icon: {icon_name} to session directory")
                    else:
                        logging.warning(f"Default icon not found: {icon_name} at {default_icon_path}")
            else:
                logging.debug("Skipping referenced icons for no-icons template variant")

            # Handle icon files if provided - save to session directory (only for icon-supporting templates)
            if uses_icons:
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
            else:
                logging.debug("Skipping user uploaded icons for no-icons template variant")
            
            # Map template IDs to actual template directories
            # Modern templates (both with/without icons) use HTML/CSS generation, Classic templates use LaTeX
            template_mapping = {
                "modern-with-icons": "modern",     # HTML template - icons will be copied above
                "modern-no-icons": "modern",       # HTML template - no icons copied above
                "modern": "modern",                 # Default HTML template
                "classic": "classic",               # LaTeX template (generic)
                "classic-alex-rivera": "classic",   # LaTeX template (data analytics)
                "classic-jane-doe": "classic",      # LaTeX template (marketing)
                "minimal": "minimal"                # Future template
            }
            
            if template not in template_mapping:
                raise ValueError(
                    f"Invalid template: {template}. Available templates: {', '.join(template_mapping.keys())}"
                )
            
            # Use the mapped template directory
            actual_template = template_mapping[template]
            
            # Use subprocess for PDF generation to avoid Qt state issues
            if actual_template == "classic":
                # LaTeX path: Use XeLaTeX compilation for classic templates
                logging.info(f"Using direct LaTeX generation for template: {actual_template}")
                generate_latex_pdf(yaml_data, str(session_icons_dir), str(output_path), actual_template)
            else:
                # HTML path: Use process pool for fast PDF generation with Qt isolation
                # This approach prevents Qt threading conflicts while providing ~10x performance
                # improvement over subprocess due to pre-warmed worker processes
                logging.info(f"Using process pool HTML generation for template: {actual_template}")
                
                if PDF_PROCESS_POOL is None:
                    # Fallback to subprocess if pool not available
                    logging.warning("Process pool not available, falling back to subprocess")
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

                    result = subprocess.run(
                        cmd,
                        capture_output=True,
                        text=True,
                        cwd=str(PROJECT_ROOT)
                    )

                    if result.returncode != 0:
                        logging.error(f"Subprocess error: {result.stderr}")
                        raise RuntimeError("Failed to generate the resume")
                else:
                    # Use process pool for faster execution
                    logging.debug("Submitting PDF generation task to process pool")
                    future = PDF_PROCESS_POOL.submit(
                        pdf_generation_worker,
                        actual_template,
                        yaml_path,
                        output_path,
                        session_icons_dir,
                        session_id
                    )
                    
                    # Wait for result with timeout
                    try:
                        result = future.result(timeout=60)  # 60 second timeout
                        
                        if not result["success"]:
                            logging.error(f"Process pool worker failed: {result['error']}")
                            logging.error(f"Failed template: {actual_template}")
                            logging.error(f"Failed session: {session_id}")
                            logging.error(f"YAML data for reproduction: {yaml_data}")
                            raise RuntimeError(f"Failed to generate the resume: {result['error']}")
                        
                        logging.info("Process pool PDF generation completed successfully")
                    except Exception as e:
                        logging.error(f"Process pool execution failed: {e}")
                        logging.error(f"Failed template: {actual_template}")
                        logging.error(f"Failed session: {session_id}")
                        logging.error(f"YAML data for reproduction: {yaml_data}")
                        raise RuntimeError(f"Failed to generate the resume: {str(e)}")

            if not output_path.exists():
                logging.error(f"Expected output file at: {output_path}")
                raise FileNotFoundError("The generated resume file was not found")

            # Clean up session directory after successful PDF generation
            try:
                session_dir = Path("/tmp") / "sessions" / session_id
                if session_dir.exists():
                    shutil.rmtree(session_dir)
                    logging.debug(f"Cleaned up session directory: {session_dir}")
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


@app.route("/api/preview/img", methods=["POST"])
def preview_resume_image():
    """
    Generate a resume preview image from the uploaded YAML and optional icons.
    This endpoint reuses the resume generation logic and converts the PDF to PNG.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Paths for YAML and output
            temp_dir_path = Path(temp_dir)
            yaml_path = temp_dir_path / "input.yaml"
            timestamp = datetime.now().strftime("%Y%m%d_%H_%M_%S")
            pdf_path = temp_dir_path / f"Resume_{timestamp}.pdf"
            png_path = temp_dir_path / f"Resume_{timestamp}.png"

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

            # Select the template and determine if it uses icons
            template = request.form.get("template", "modern")
            uses_icons = template != "modern-no-icons"  # Skip icons for no-icons variant
            
            if uses_icons:
                # Copy base contact icons that are hardcoded in templates
                base_contact_icons = ["location.png", "email.png", "phone.png", "linkedin.png"]
                for icon_name in base_contact_icons:
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied base contact icon: {icon_name} to session directory")
                    else:
                        logging.warning(f"Base contact icon not found: {icon_name} at {default_icon_path}")
            else:
                logging.debug("Skipping base contact icons for no-icons template variant")

            # Copy additional icons referenced in YAML content (only for icon-supporting templates)
            if uses_icons:
                referenced_icons = extract_icons_from_yaml(yaml_data)
                logging.debug(f"Found {len(referenced_icons)} referenced icons: {referenced_icons}")
                base_contact_icons = ["location.png", "email.png", "phone.png", "linkedin.png"]
                for icon_name in referenced_icons:
                    # Skip if already copied as base contact icon
                    if icon_name in base_contact_icons:
                        continue
                        
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied default icon: {icon_name} to session directory")
                    else:
                        logging.warning(f"Default icon not found: {icon_name} at {default_icon_path}")
            else:
                logging.debug("Skipping referenced icons for no-icons template variant")

            # Handle icon files if provided - save to session directory (only for icon-supporting templates)
            if uses_icons:
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
            else:
                logging.debug("Skipping user uploaded icons for no-icons template variant")
            
            # Map template IDs to actual template directories
            # Modern templates (both with/without icons) use HTML/CSS generation, Classic templates use LaTeX
            template_mapping = {
                "modern-with-icons": "modern",     # HTML template - icons will be copied above
                "modern-no-icons": "modern",       # HTML template - no icons copied above
                "modern": "modern",                 # Default HTML template
                "classic": "classic",               # LaTeX template (generic)
                "classic-alex-rivera": "classic",   # LaTeX template (data analytics)
                "classic-jane-doe": "classic",      # LaTeX template (marketing)
                "minimal": "minimal"                # Future template
            }
            
            if template not in template_mapping:
                raise ValueError(
                    f"Invalid template: {template}. Available templates: {', '.join(template_mapping.keys())}"
                )
            
            # Use the mapped template directory
            actual_template = template_mapping[template]
            
            # Generate PDF using the same logic as generate_resume
            if actual_template == "classic":
                # LaTeX path: Use XeLaTeX compilation for classic templates
                # Check if xelatex is available, fallback to modern template if not
                try:
                    subprocess.run(["xelatex", "--version"], capture_output=True, check=True)
                    logging.info(f"Using direct LaTeX generation for template: {actual_template}")
                    generate_latex_pdf(yaml_data, str(session_icons_dir), str(pdf_path), actual_template)
                except (subprocess.CalledProcessError, FileNotFoundError):
                    logging.warning("LaTeX not available, falling back to modern template for preview")
                    # Fallback to modern template for preview when LaTeX is not available
                    actual_template = "modern"
                    # Continue with HTML generation below
            else:
                # HTML path: Use process pool for fast PDF generation with Qt isolation
                logging.info(f"Using process pool HTML generation for template: {actual_template}")
                
                if PDF_PROCESS_POOL is None:
                    # Fallback to subprocess if pool not available
                    logging.warning("Process pool not available, falling back to subprocess")
                    cmd = [
                        "python",
                        "resume_generator.py",
                        "--template",
                        actual_template,
                        "--input",
                        str(yaml_path),
                        "--output",
                        str(pdf_path),
                        "--session-icons-dir",
                        str(session_icons_dir),
                        "--session-id",
                        session_id,
                    ]

                    result = subprocess.run(
                        cmd,
                        capture_output=True,
                        text=True,
                        cwd=str(PROJECT_ROOT)
                    )

                    if result.returncode != 0:
                        logging.error(f"Subprocess error: {result.stderr}")
                        raise RuntimeError("Failed to generate the resume")
                else:
                    # Use process pool for faster execution
                    logging.debug("Submitting PDF generation task to process pool")
                    future = PDF_PROCESS_POOL.submit(
                        pdf_generation_worker,
                        actual_template,
                        yaml_path,
                        pdf_path,
                        session_icons_dir,
                        session_id
                    )
                    
                    # Wait for result with timeout
                    try:
                        result = future.result(timeout=60)  # 60 second timeout
                        
                        if not result["success"]:
                            logging.error(f"Process pool worker failed: {result['error']}")
                            raise RuntimeError(f"Failed to generate the resume: {result['error']}")
                        
                        logging.info("Process pool PDF generation completed successfully")
                    except Exception as e:
                        logging.error(f"Process pool execution failed: {e}")
                        raise RuntimeError(f"Failed to generate the resume: {str(e)}")

            if not pdf_path.exists():
                logging.error(f"Expected PDF file at: {pdf_path}")
                raise FileNotFoundError("The generated resume PDF was not found")

            # Convert PDF to PNG using PyMuPDF
            try:
                import fitz  # PyMuPDF
                
                # Open the PDF
                pdf_document = fitz.open(str(pdf_path))
                
                # Get the first page
                page = pdf_document[0]
                
                # Set zoom factor for better quality (2x for 300 DPI equivalent)
                mat = fitz.Matrix(2.0, 2.0)
                
                # Render page to image
                pix = page.get_pixmap(matrix=mat, alpha=False)
                
                # Save as PNG
                pix.save(str(png_path))
                
                # Close the document
                pdf_document.close()
                
                logging.info(f"Successfully converted PDF to PNG: {png_path}")
                
            except ImportError:
                logging.error("PyMuPDF (fitz) not available for PDF to image conversion")
                raise RuntimeError("PDF to image conversion not available")
            except Exception as e:
                logging.error(f"Error converting PDF to PNG: {e}")
                raise RuntimeError(f"Failed to convert PDF to image: {str(e)}")

            # Clean up session directory after successful image generation
            try:
                session_dir = Path("/tmp") / "sessions" / session_id
                if session_dir.exists():
                    shutil.rmtree(session_dir)
                    logging.debug(f"Cleaned up session directory: {session_dir}")
            except Exception as cleanup_error:
                logging.warning(f"Failed to cleanup session directory: {cleanup_error}")

            # Send the generated PNG image
            return send_file(
                png_path,
                mimetype="image/png",
                download_name=png_path.name,
            )

        except ValueError as ve:
            logging.warning("Preview validation error: %s", ve)
            return jsonify({"success": False, "error": str(ve)}), 400
        except FileNotFoundError as fnfe:
            logging.error("Preview file error: %s", fnfe)
            return jsonify({"success": False, "error": str(fnfe)}), 500
        except Exception as e:
            logging.error("Preview unexpected error: %s", e)
            return (
                jsonify({"success": False, "error": "An unexpected error occurred during preview generation"}),
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
