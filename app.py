import yaml
import tempfile
import shutil
import hashlib
import json
from flask import (
    Flask,
    request,
    send_file,
    jsonify,
    url_for,
    send_from_directory,
    redirect,
)


from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.utils import secure_filename
import os
import subprocess
import logging
from datetime import datetime, timezone
from pathlib import Path
import uuid
import re
import base64
import copy
from jinja2 import Environment, FileSystemLoader
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
import atexit
from functools import wraps, partial
import time
from typing import Callable, Any
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging based on environment variable
# Set DEBUG_LOGGING=true to enable detailed debug logs for troubleshooting
# Default: INFO level (production-ready logging)
DEBUG_LOGGING = os.getenv("DEBUG_LOGGING", "false").lower() == "true"
log_level = logging.DEBUG if DEBUG_LOGGING else logging.INFO
logging.basicConfig(
    level=log_level, format="%(asctime)s [%(levelname)s] %(message)s"
)


def retry_on_connection_error(max_retries=3, backoff_factor=0.5):
    """
    Retry decorator for handling transient Supabase connection errors.

    Args:
        max_retries: Maximum number of retry attempts (default: 3)
        backoff_factor: Exponential backoff multiplier (0.5s, 1s, 2s, ...)

    Returns:
        Decorated function with retry logic

    Example:
        @retry_on_connection_error(max_retries=3, backoff_factor=0.5)
        def some_database_operation():
            return supabase.table('users').select('*').execute()
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    error_msg = str(e).lower()

                    # Only retry on connection-related errors
                    is_retryable = any([
                        'server disconnected' in error_msg,
                        'connection' in error_msg,
                        'timeout' in error_msg,
                        'reset' in error_msg
                    ])

                    if not is_retryable or attempt == max_retries:
                        raise

                    wait_time = backoff_factor * (2 ** attempt)
                    logging.warning(
                        f"Retry {attempt + 1}/{max_retries} for {func.__name__} "
                        f"after {wait_time}s due to: {e}"
                    )
                    time.sleep(wait_time)

            raise last_exception

        return wrapper
    return decorator


def classify_thumbnail_error(error):
    """
    Classify thumbnail generation errors as retryable or permanent.

    Args:
        error: Exception object

    Returns:
        dict: {
            "retryable": bool,
            "error_type": str,  # "network", "dependency", "data", "storage", "unknown"
            "user_message": str  # Only if not retryable
        }
    """
    error_msg = str(error).lower()
    error_type = type(error).__name__

    # Missing dependencies - permanent
    if isinstance(error, (ImportError, ModuleNotFoundError)):
        return {
            "retryable": False,
            "error_type": "dependency",
            "user_message": "Server configuration error. Please contact support."
        }

    # Connection/network errors - retryable
    transient_keywords = ['server disconnected', 'connection', 'timeout', 'reset', 'network']
    if any(keyword in error_msg for keyword in transient_keywords):
        return {
            "retryable": True,
            "error_type": "network",
            "user_message": None
        }

    # Storage errors - retryable (may be transient auth token)
    if 'storage' in error_msg or 'bucket' in error_msg:
        return {
            "retryable": True,
            "error_type": "storage",
            "user_message": None
        }

    # Data validation errors - permanent
    if 'invalid' in error_msg or 'corrupted' in error_msg or 'missing' in error_msg:
        return {
            "retryable": False,
            "error_type": "data",
            "user_message": "Resume data issue. Please edit the resume."
        }

    # Default: assume retryable
    return {
        "retryable": True,
        "error_type": "unknown",
        "user_message": None
    }


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
def get_social_media_handle(url, platform="linkedin"):
    """
    Extract social media handle from URL.

    Args:
        url (str): The social media URL.
        platform (str): The platform type (linkedin, github, twitter, etc.)

    Returns:
        str: The social media handle.
    """
    if not url:
        return ""

    # Remove any trailing slashes
    url = url.rstrip("/")

    # Platform-specific handle extraction
    if platform == "stackoverflow":
        # Extract username from stackoverflow.com/users/123456/username
        match = re.search(r'/users/\d+/([\w\-]+)', url)
        return match.group(1) if match else url.split("/")[-1]

    elif platform == "medium":
        # Extract @username from medium.com/@username
        handle = url.split("/")[-1]
        return handle if handle.startswith('@') else f"@{handle}"

    elif platform == "twitter":
        # Extract @username from twitter.com/username or x.com/username
        handle = url.split("/")[-1]
        return f"@{handle}"

    # Default: return last part of URL
    return url.split("/")[-1]


def migrate_linkedin_to_social_links(contact_info):
    """
    Migrate old 'linkedin' field to new 'social_links' array format.

    Args:
        contact_info (dict): Contact information dictionary

    Returns:
        dict: Updated contact_info with social_links array
    """
    # If already has social_links, no migration needed
    if contact_info.get("social_links"):
        return contact_info

    # Check if old linkedin field exists
    linkedin_url = contact_info.get("linkedin", "")
    if linkedin_url and linkedin_url.strip():
        # Create social_links array with migrated LinkedIn
        contact_info["social_links"] = [{
            "platform": "linkedin",
            "url": linkedin_url,
            "display_text": contact_info.get("linkedin_display", "")
        }]
        app.logger.info("Migrated old 'linkedin' field to 'social_links' array")
    else:
        # Initialize empty social_links array
        contact_info["social_links"] = []

    return contact_info


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


def _escape_latex(text):
    r"""Escapes special LaTeX characters in a string to prevent compilation errors.

    Note: Does NOT escape characters used in markdown syntax (~, *, _, +) because
    they are converted to LaTeX commands by the markdown filters before rendering.
    The markdown_formatting filter converts:
      ~~text~~ → \sout{text}
      **text** → \textbf{text}
      *text* → \textit{text}
      __text__ → \textbf{text}
      _text_ → \textit{text}
      ++text++ → \underline{text}
    """
    if not isinstance(text, str):
        return text

    latex_special_chars = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        # "_": r"\_",  # Don't escape: used for markdown italic/bold (_text_ and __text__)
        "{": r"\{",
        "}": r"\}",
        # "~": r"\textasciitilde{}",  # Don't escape: used for markdown strikethrough (~~text~~)
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        "-": r"{-}",
    }

    pattern = re.compile("|".join(re.escape(key) for key in latex_special_chars.keys()))
    escaped_text = pattern.sub(lambda match: latex_special_chars[match.group(0)], text)
    return escaped_text


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
    import re
    pattern = r'\[([^\]]+)\]\(([^\)]+)\)'

    # Replace with HTML anchor tag
    html_text = re.sub(pattern, r'<a href="\2">\1</a>', text)

    return html_text


def convert_markdown_links_to_latex(text):
    """
    Convert Markdown-style links [text](url) to LaTeX \\href{url}{text} commands.

    Args:
        text: String that may contain markdown links

    Returns:
        String with markdown links converted to LaTeX href commands

    Example:
        "Visit [Google](https://google.com)" -> "Visit \\href{https://google.com}{Google}"
    """
    if not text or not isinstance(text, str):
        return text

    # Regex to match [text](url) pattern
    import re
    pattern = r'\[([^\]]+)\]\(([^\)]+)\)'

    # Replace with LaTeX href command
    latex_text = re.sub(pattern, r'\\href{\2}{\1}', text)

    return latex_text


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

    import re

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


def convert_markdown_formatting_to_latex(text):
    """
    Convert Markdown-style formatting to LaTeX commands.

    Supports:
    - Bold: **text** or __text__ → \\textbf{text}
    - Italic: *text* or _text_ → \\textit{text}
    - Strikethrough: ~~text~~ → \\sout{text}
    - Underline: ++text++ → \\underline{text} (custom syntax, not standard markdown)

    Args:
        text: String that may contain markdown formatting

    Returns:
        String with markdown formatting converted to LaTeX commands

    Example:
        "This is **bold** and *italic*" -> "This is \\textbf{bold} and \\textit{italic}"
    """
    if not text or not isinstance(text, str):
        return text

    import re

    # Process in specific order to avoid conflicts
    # 1. Bold with ** (must come before single *)
    text = re.sub(r'\*\*(.+?)\*\*', r'\\textbf{\1}', text)

    # 2. Bold with __ (must come before single _)
    text = re.sub(r'__(.+?)__', r'\\textbf{\1}', text)

    # 3. Italic with * (after ** is processed)
    text = re.sub(r'\*(.+?)\*', r'\\textit{\1}', text)

    # 4. Italic with _ (after __ is processed)
    text = re.sub(r'_(.+?)_', r'\\textit{\1}', text)

    # 5. Strikethrough with ~~
    text = re.sub(r'~~(.+?)~~', r'\\sout{\1}', text)

    # 6. Underline with ++ (custom syntax)
    text = re.sub(r'\+\+(.+?)\+\+', r'\\underline{\1}', text)

    return text


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

    # Process contact info and social links
    contact_info = prepared_data.get("contact_info", {})
    if contact_info:
        # Migrate old LinkedIn format to new social_links array (backward compatibility)
        contact_info = migrate_linkedin_to_social_links(contact_info)

        # Process social_links array
        social_links = contact_info.get("social_links", [])
        if social_links:
            for link in social_links:
                platform = link.get("platform", "")
                url = link.get("url", "")

                if not url or not url.strip():
                    continue

                # Add https:// if not present
                if not url.startswith("https://") and not url.startswith("http://"):
                    url = "https://" + url
                    link["url"] = url

                # Extract handle for display
                link["handle"] = get_social_media_handle(url, platform)

                # Generate display_text if not provided
                if not link.get("display_text") or not link.get("display_text").strip():
                    if platform == "linkedin":
                        link["display_text"] = generate_linkedin_display_text(
                            url, contact_info.get("name", "")
                        )
                    elif platform == "github":
                        link["display_text"] = link["handle"]
                    elif platform == "twitter":
                        link["display_text"] = link["handle"]
                    elif platform == "website":
                        # Extract domain from URL
                        try:
                            from urllib.parse import urlparse
                            parsed = urlparse(url)
                            link["display_text"] = parsed.hostname.replace('www.', '') if parsed.hostname else "Website"
                        except:
                            link["display_text"] = "Website"
                    else:
                        # Default: use handle or platform name
                        link["display_text"] = link["handle"] or platform.capitalize()

                    logging.info(f"Generated {platform} display text: {link['display_text']}")

        # Store processed social_links back in contact_info
        contact_info["social_links"] = social_links

        # Maintain backward compatibility: keep linkedin fields for old templates
        linkedin_link = next((link for link in social_links if link.get("platform") == "linkedin"), None)
        if linkedin_link:
            contact_info["linkedin"] = linkedin_link.get("url", "")
            contact_info["linkedin_handle"] = linkedin_link.get("handle", "")
            contact_info["linkedin_display"] = linkedin_link.get("display_text", "")
        else:
            contact_info["linkedin"] = ""
            contact_info["linkedin_handle"] = ""
            contact_info["linkedin_display"] = ""

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
        # Normalize sections for backward compatibility
        yaml_data = normalize_sections(yaml_data)

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

        # Register custom filters for markdown links and formatting
        latex_env.filters['markdown_links'] = convert_markdown_links_to_latex
        latex_env.filters['markdown_formatting'] = convert_markdown_formatting_to_latex

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


def extract_icons_from_yaml(data):
    """
    Recursively extract all icon filenames referenced in YAML data.

    Args:
        data: YAML data structure (dict or list) to extract icon references from

    Returns:
        set: Set of unique icon filenames referenced in the data

    Example:
        >>> data = {"sections": [{"content": [{"icon": "company_google.png"}]}]}
        >>> extract_icons_from_yaml(data)
        {'company_google.png'}
    """
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


# Supabase Storage Helper Functions
def upload_icon_to_storage(user_id, resume_id, filename, file_data, mime_type="image/png"):
    """
    Upload icon file to Supabase Storage.

    Args:
        user_id (str): UUID of the user
        resume_id (str): UUID of the resume
        filename (str): Original filename
        file_data (bytes): File content
        mime_type (str): MIME type of the file

    Returns:
        tuple: (storage_path, storage_url)

    Raises:
        Exception: If upload fails
    """
    if supabase is None:
        raise Exception("Supabase client not initialized")

    # Generate unique path: {user_id}/{resume_id}/{filename}
    storage_path = f"{user_id}/{resume_id}/{filename}"

    try:
        # Upload to 'resume-icons' bucket
        supabase.storage.from_('resume-icons').upload(
            storage_path,
            file_data,
            file_options={"content-type": mime_type, "upsert": "true"}
        )

        # Get public URL
        storage_url = supabase.storage.from_('resume-icons').get_public_url(storage_path)

        logging.debug(f"Uploaded icon to storage: {storage_path}")
        return storage_path, storage_url

    except Exception as e:
        logging.error(f"Failed to upload icon to storage: {e}")
        raise


def check_resume_limit(user_id):
    """
    Check if user has reached the 5-resume limit.

    Args:
        user_id (str): UUID of the user

    Returns:
        tuple: (can_create: bool, current_count: int)
    """
    if supabase is None:
        raise Exception("Supabase client not initialized")

    try:
        # Query resumes table for non-deleted resumes
        result = supabase.table('resumes') \
            .select('id', count='exact') \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        current_count = result.count if hasattr(result, 'count') else len(result.data)
        can_create = current_count < 5

        logging.debug(f"User {user_id} has {current_count}/5 resumes")
        return can_create, current_count

    except Exception as e:
        logging.error(f"Failed to check resume limit: {e}")
        raise


def download_icon_from_storage(storage_path, dest_path, max_retries=2):
    """
    Download icon file from Supabase Storage to local filesystem with retries.

    Args:
        storage_path (str): Path in storage bucket
        dest_path (str): Local filesystem destination path
        max_retries (int): Number of retry attempts (default: 2)

    Returns:
        bool: True if successful, False otherwise
    """
    if supabase is None:
        logging.error("Supabase client not initialized")
        return False

    for attempt in range(max_retries + 1):
        try:
            # Download file from storage
            file_data = supabase.storage.from_('resume-icons').download(storage_path)

            # Write to destination
            with open(dest_path, 'wb') as f:
                f.write(file_data)

            logging.debug(f"Downloaded icon from storage: {storage_path} -> {dest_path}")
            return True
        except Exception as e:
            if attempt < max_retries:
                wait_time = 0.5 * (2 ** attempt)  # Exponential backoff: 0.5s, 1s
                logging.warning(f"Icon download attempt {attempt + 1} failed for {storage_path}, retrying in {wait_time}s: {e}")
                time.sleep(wait_time)
            else:
                logging.error(f"Failed to download icon {storage_path} after {max_retries + 1} attempts: {e}")
                return False

    return False


def generate_thumbnail_from_pdf(pdf_path, user_id, resume_id):
    """
    Convert first page of PDF to PNG thumbnail and upload to Supabase.

    Args:
        pdf_path (str): Path to the generated PDF file
        user_id (str): UUID of the user
        resume_id (str): UUID of the resume

    Returns:
        str: Public URL of the uploaded thumbnail, or None if generation fails
    """
    if supabase is None:
        logging.warning("Supabase client not initialized - skipping thumbnail generation")
        return None

    try:
        from pdf2image import convert_from_path
        from PIL import Image
        import tempfile

        # Convert first page of PDF to image at 150 DPI
        logging.debug(f"Converting PDF to thumbnail: {pdf_path}")
        images = convert_from_path(
            pdf_path,
            first_page=1,
            last_page=1,
            dpi=150
        )

        if not images:
            logging.error("No images generated from PDF")
            return None

        # Get the first (and only) page
        page_image = images[0]

        # Resize to thumbnail size (width=400px, maintain aspect ratio)
        # A4 aspect ratio is approximately 1:1.414
        target_width = 400
        aspect_ratio = page_image.height / page_image.width
        target_height = int(target_width * aspect_ratio)

        thumbnail = page_image.resize((target_width, target_height), Image.Resampling.LANCZOS)

        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
            thumbnail.save(tmp_file.name, 'PNG', optimize=True, quality=85)
            tmp_path = tmp_file.name

        try:
            # Read the thumbnail data
            with open(tmp_path, 'rb') as f:
                thumbnail_data = f.read()

            # Upload to Supabase Storage: resume-thumbnails/{user_id}/{resume_id}/thumbnail.png
            storage_path = f"{user_id}/{resume_id}/thumbnail.png"

            logging.debug(f"Uploading thumbnail to storage: {storage_path}")
            supabase.storage.from_('resume-thumbnails').upload(
                storage_path,
                thumbnail_data,
                file_options={
                    "content-type": "image/png",
                    "upsert": "true",
                    "cacheControl": "public, max-age=31536000, immutable"
                }
            )

            # Get public URL and add cache-busting timestamp
            thumbnail_url = supabase.storage.from_('resume-thumbnails').get_public_url(storage_path)

            # Add cache-busting parameter to force browser to fetch new thumbnails
            timestamp = int(time.time() * 1000)  # Unix timestamp in milliseconds
            url_parts = list(urlparse(thumbnail_url))
            query = parse_qs(url_parts[4])
            query['v'] = [str(timestamp)]
            url_parts[4] = urlencode(query, doseq=True)
            thumbnail_url = urlunparse(url_parts)

            logging.info(f"Successfully generated and uploaded thumbnail: {storage_path}")
            return thumbnail_url

        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except ImportError as e:
        logging.error(f"Missing dependencies for thumbnail generation: {e}")
        logging.error("Install with: pip install pdf2image Pillow")
        return None
    except Exception as e:
        logging.error(f"Failed to generate thumbnail from PDF: {e}")
        logging.error(f"PDF path: {pdf_path}")
        return None


# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")  # Use secret key for admin operations

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    logging.warning("Supabase credentials not found. Resume storage features will be disabled.")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
    logging.info("Supabase client initialized successfully")

# Maximum number of concurrent threads for copying icons during resume duplication
MAX_ICON_COPY_WORKERS = 10

# Development mode: Don't serve React from root to avoid route conflicts
# Production mode: Serve React build from root (static_url_path="/")
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
if FLASK_ENV == 'production':
    # Production: Flask serves React static files from root
    app = Flask(__name__, static_folder="static", static_url_path="/")
else:
    # Development: Vite dev server handles React, Flask only handles API
    app = Flask(__name__, static_folder="static", static_url_path="/static")

app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# CORS configuration: Restrict origins for security
# Flask serves React static files from same container, so same-origin by default
# But we still configure CORS for dev environments and explicit domain control
ALLOWED_ORIGINS = os.getenv(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:5000,http://localhost:5173,https://easyfreeresume.com'
).split(',')

CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

# Host canonicalization: www -> apex (SEO)
CANONICAL_HOST = "easyfreeresume.com"
WWW_HOST = f"www.{CANONICAL_HOST}"
assert not CANONICAL_HOST.startswith("www."), "CANONICAL_HOST must be apex (no www.)"

@app.before_request
def canonicalize_host():
    """Redirect www to apex domain for SEO consolidation."""
    host = (request.host or "").split(":")[0].lower()  # strip port
    if host == WWW_HOST:
        # Preserve path and query string
        target_url = f"https://{CANONICAL_HOST}{request.full_path}".rstrip("?")
        return redirect(target_url, code=301)
    return None

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


# Authentication Middleware
def require_auth(f):
    """
    Decorator to require authentication and extract user_id from Supabase JWT.

    Usage:
        @app.route('/api/protected-endpoint')
        @require_auth
        def protected_endpoint():
            user_id = request.user_id
            user = request.user
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if supabase is None:
            return jsonify({"success": False, "error": "Resume storage not configured"}), 503

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logging.warning(
                f"Auth missing | endpoint={request.path} | method={request.method} | "
                f"ip={request.remote_addr}"
            )
            return jsonify({"success": False, "error": "Unauthorized - Missing or invalid Authorization header"}), 401

        token = auth_header.replace('Bearer ', '')
        try:
            # Verify JWT and extract user
            user_response = supabase.auth.get_user(token)
            request.user_id = user_response.user.id
            request.user = user_response.user
            return f(*args, **kwargs)
        except Exception as e:
            # Enhanced logging with context for debugging auth issues
            error_msg = str(e)
            is_expired = 'expired' in error_msg.lower()
            user_agent = request.headers.get('User-Agent', 'unknown')[:50]
            logging.error(
                f"Auth error: {error_msg} | endpoint={request.path} | method={request.method} | "
                f"user_agent={user_agent} | ip={request.remote_addr} | is_token_expired={is_expired}"
            )
            return jsonify({"success": False, "error": "Invalid or expired token"}), 401

    return decorated_function


# 301 Redirects for SEO consolidation
@app.route("/ats-friendly-resume-templates-free")
def redirect_ats_templates_free():
    """Redirect old ATS template URL to hub"""
    return redirect("/ats-resume-templates", code=301)


@app.route("/free-ats-friendly-resume-template")
def redirect_free_ats_template():
    """Redirect old ATS template URL to specific template"""
    return redirect("/templates/ats-friendly", code=301)


@app.route("/best-resume-builder-reddit")
def redirect_reddit_builder():
    """Redirect old Reddit URL to new canonical URL"""
    return redirect("/best-free-resume-builder-reddit", code=301)


@app.route("/blog/customer-service-resume-keywords")
def redirect_customer_service_keywords():
    """Redirect blog version to root SEO page"""
    return redirect("/resume-keywords/customer-service", code=301)


@app.route("/blog/software-engineer-resume-keywords")
def redirect_software_engineer_keywords():
    """Redirect blog version to root SEO page to fix keyword cannibalization"""
    return redirect("/resume-keywords/software-engineer", code=301)


@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
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

        # Determine icon support based on template ID
        # Only 'modern-with-icons' template supports icons
        supports_icons = template_id == "modern-with-icons"

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


@app.route("/api/generate-linkedin-display", methods=["POST"])
def generate_linkedin_display():
    """
    Generate smart display text for LinkedIn URL.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        linkedin_url = data.get("linkedin_url", "").strip()
        contact_name = data.get("contact_name", "").strip()
        
        if not linkedin_url:
            return jsonify({"success": False, "error": "LinkedIn URL is required"}), 400
        
        # Generate smart display text
        display_text = generate_linkedin_display_text(linkedin_url, contact_name)
        
        return jsonify({
            "success": True,
            "display_text": display_text
        })
        
    except Exception as e:
        logging.error(f"Error generating LinkedIn display text: {e}")
        return jsonify({"success": False, "error": "Failed to generate display text"}), 500


def _is_preview_request():
    """Check if the request is for preview (inline) vs download (attachment)."""
    return request.args.get('preview', 'false').lower() == 'true'


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

            # Normalize sections for backward compatibility
            yaml_data = normalize_sections(yaml_data)

            # Get session ID for icon isolation
            session_id = request.form.get("session_id")
            if not session_id:
                raise ValueError("No session ID provided")
            
            # Create session-specific icon directory
            session_icons_dir = Path("/tmp") / "sessions" / session_id / "icons"
            session_icons_dir.mkdir(parents=True, exist_ok=True)

            # Select the template and determine if it uses icons
            template = request.form.get("template", "modern")
            uses_icons = template == "modern-with-icons"  # Only modern-with-icons template needs icons
            
            # Always copy base contact icons that are hardcoded in templates
            # Include all social platform icons for new social_links feature
            base_contact_icons = [
                "location.png", "email.png", "phone.png", "linkedin.png",
                "github.png", "twitter.png", "website.png", "pinterest.png",
                "medium.png", "youtube.png", "stackoverflow.png", "behance.png", "dribbble.png"
            ]
            for icon_name in base_contact_icons:
                default_icon_path = ICONS_DIR / icon_name
                if default_icon_path.exists():
                    session_icon_path = session_icons_dir / icon_name
                    shutil.copy2(default_icon_path, session_icon_path)
                    logging.debug(f"Copied base contact icon: {icon_name} to session directory")
                else:
                    logging.warning(f"Base contact icon not found: {icon_name} at {default_icon_path}")

            # Copy additional icons referenced in YAML content (only for icon-supporting templates)
            if uses_icons:
                referenced_icons = extract_icons_from_yaml(yaml_data)
                logging.debug(f"Found {len(referenced_icons)} referenced icons: {referenced_icons}")
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
                as_attachment=not _is_preview_request(),  # inline for preview, attachment for download
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
@require_auth
def download_file(filename):
    """
    Download a generated resume PDF.

    Security:
    - Requires authentication (@require_auth decorator)
    - Validates filename to prevent path traversal attacks
    - Ensures file is within OUTPUT_DIR
    """
    # Validate filename - prevent path traversal
    safe_filename = secure_filename(filename)
    if not safe_filename or safe_filename != filename:
        logging.warning(f"Invalid filename attempt: {filename}")
        return jsonify({"success": False, "error": "Invalid filename"}), 400

    # Construct file path
    file_path = OUTPUT_DIR / safe_filename

    # Verify file is within OUTPUT_DIR (prevent directory traversal)
    try:
        if not file_path.resolve().is_relative_to(OUTPUT_DIR.resolve()):
            logging.warning(f"Path traversal attempt: {filename}")
            return jsonify({"success": False, "error": "Access denied"}), 403
    except ValueError:
        # is_relative_to can raise ValueError in some edge cases
        logging.warning(f"Path validation failed for: {filename}")
        return jsonify({"success": False, "error": "Access denied"}), 403

    # Check if file exists
    if not file_path.exists():
        return jsonify({"success": False, "error": "File not found"}), 404

    return send_file(file_path, as_attachment=True)


@app.route("/icons/<filename>")
def serve_icon(filename):
    """
    Serve icons from the icons directory for frontend display.

    Security:
    - Validates filename to prevent path traversal attacks
    - Ensures file is within ICONS_DIR
    """
    try:
        # Validate filename - prevent path traversal
        safe_filename = secure_filename(filename)
        if not safe_filename or safe_filename != filename:
            logging.warning(f"Invalid icon filename attempt: {filename}")
            return jsonify({"success": False, "error": "Invalid filename"}), 400

        # Construct icon path
        icon_path = ICONS_DIR / safe_filename

        # Verify file is within ICONS_DIR (prevent directory traversal)
        try:
            if not icon_path.resolve().is_relative_to(ICONS_DIR.resolve()):
                logging.warning(f"Icon path traversal attempt: {filename}")
                return jsonify({"success": False, "error": "Access denied"}), 403
        except ValueError:
            logging.warning(f"Icon path validation failed for: {filename}")
            return jsonify({"success": False, "error": "Access denied"}), 403

        # Check if file exists
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

    Security:
    - Validates filename to prevent path traversal attacks
    - Ensures file is within docs/templates directory
    - Rejects paths containing '..' or starting with '/'
    """
    try:
        # Validate filename - prevent path traversal
        if '..' in filename or filename.startswith('/'):
            logging.warning(f"Path traversal attempt in template request: {filename}")
            return jsonify({"success": False, "error": "Invalid path"}), 400

        # Sanitize filename
        safe_filename = secure_filename(filename)
        if not safe_filename:
            logging.warning(f"Invalid template filename: {filename}")
            return jsonify({"success": False, "error": "Invalid filename"}), 400

        # Construct template image path
        template_image_dir = PROJECT_ROOT / "docs" / "templates"
        file_path = template_image_dir / safe_filename

        # Verify file is within template directory (prevent directory traversal)
        try:
            if not file_path.resolve().is_relative_to(template_image_dir.resolve()):
                logging.warning(f"Template path traversal attempt: {filename}")
                return jsonify({"success": False, "error": "Access denied"}), 403
        except ValueError:
            logging.warning(f"Template path validation failed for: {filename}")
            return jsonify({"success": False, "error": "Access denied"}), 403

        # Check if file exists
        if not file_path.exists():
            return jsonify({"success": False, "error": "Image not found"}), 404

        return send_file(file_path)
    except Exception as e:
        logging.error(f"Error serving template image {filename}: {e}")
        return jsonify({"success": False, "error": "Image not found"}), 404


# Resume Storage API Endpoints

@app.route("/api/resumes/create", methods=["POST"])
@require_auth
@retry_on_connection_error(max_retries=3, backoff_factor=0.5)
def create_resume():
    """
    Create a new resume row in the database initialized with template data.
    Returns resume_id immediately so user can navigate to editor.

    Request JSON:
        {
            "template_id": "modern-with-icons",  // optional, defaults to modern-with-icons
            "load_example": true  // optional, if true loads example data, if false loads empty structure
        }

    Response:
        {
            "success": true,
            "resume_id": "uuid",
            "template_id": "modern-with-icons"
        }
    """
    try:
        data = request.get_json() or {}
        user_id = request.user_id
        template_id = data.get('template_id', 'modern-with-icons')
        load_example = data.get('load_example', True)  # Default to example data

        # Check 5-resume limit
        can_create, current_count = check_resume_limit(user_id)
        if not can_create:
            return jsonify({
                "success": False,
                "error": f"Resume limit reached ({current_count}/5)",
                "error_code": "RESUME_LIMIT_REACHED"
            }), 403

        # Load template YAML data
        template_file = TEMPLATE_FILE_MAP.get(template_id)
        if not template_file:
            return jsonify({"success": False, "error": "Template not found"}), 404

        template_path = TEMPLATES_DIR / template_file
        if not template_path.exists():
            return jsonify({"success": False, "error": "Template not found"}), 404

        with open(template_path, "r") as file:
            template_data = yaml.safe_load(file)

        # Initialize resume with template data
        contact_info = template_data.get('contact_info', {})

        # Migrate old linkedin field to new social_links format (backward compatibility)
        contact_info = migrate_linkedin_to_social_links(contact_info)

        sections = template_data.get('sections', [])

        # If load_example is False, clear the content but keep the structure
        if not load_example:
            # Clear contact info fields but keep the structure
            contact_info = {
                'name': '',
                'location': '',
                'email': '',
                'phone': '',
                'social_links': []
            }

            # Clear section content but keep section names and types
            # Determine correct empty content type based on section type
            list_types = {'bulleted-list', 'inline-list', 'dynamic-column-list',
                         'icon-list', 'experience', 'education'}

            sections = [
                {
                    'name': section.get('name', ''),
                    'type': section.get('type', 'text'),
                    'content': [] if section.get('type', 'text') in list_types else ''
                }
                for section in sections
            ]

        # Create resume row with template data
        new_resume = {
            'user_id': user_id,
            'title': 'Untitled Resume',
            'template_id': template_id,
            'contact_info': contact_info,
            'sections': sections,
            'json_hash': None,  # No hash yet (no data)
            'created_at': 'now()',
            'updated_at': 'now()',
            'last_accessed_at': 'now()'
        }

        # Insert resume and get generated ID
        result = supabase.table('resumes').insert(new_resume).execute()
        resume_id = result.data[0]['id']

        # Update user preferences to track last edited resume
        supabase.table('user_preferences').upsert({
            'user_id': user_id,
            'last_edited_resume_id': resume_id
        }).execute()

        logging.info(f"Created resume: {resume_id} for user {user_id} (load_example={load_example})")

        return jsonify({
            "success": True,
            "resume_id": resume_id,
            "template_id": template_id
        }), 201

    except Exception as e:
        logging.error(f"Error creating resume: {e}")
        return jsonify({"success": False, "error": "Failed to create resume"}), 500


@app.route("/api/resumes", methods=["POST"])
@require_auth
@retry_on_connection_error(max_retries=3, backoff_factor=0.5)
def save_resume():
    """
    Save or update a resume for the authenticated user.

    Request JSON:
        {
            "id": "uuid" | null,  // null for new resume, uuid for update
            "title": "Software Engineer Resume",
            "template_id": "modern-with-icons",
            "contact_info": {...},
            "sections": [...],
            "icons": [
                {"filename": "google.png", "data": "base64..."},
                ...
            ]
        }

    Response:
        {
            "success": true,
            "resume_id": "uuid",
            "message": "Resume saved successfully"
        }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        user_id = request.user_id
        resume_id = data.get('id')
        title = data.get('title', 'Untitled Resume')
        template_id = data.get('template_id')
        contact_info = data.get('contact_info', {})
        sections = data.get('sections', [])
        icons = data.get('icons', [])
        ai_import_warnings = data.get('ai_import_warnings')  # Optional JSONB array
        ai_import_confidence = data.get('ai_import_confidence')  # Optional decimal

        # Validate required fields
        if not template_id:
            return jsonify({"success": False, "error": "template_id is required"}), 400

        # Calculate hash of JSON representation (for smart diffing)
        # Include icon metadata to detect icon-only changes
        icon_metadata = [
            {
                'filename': icon['filename'],
                'size': len(base64.b64decode(icon['data'].split(',')[1] if ',' in icon['data'] else icon['data']))
            }
            for icon in icons
            if icon.get('filename') and icon.get('data')
        ]

        json_repr = json.dumps({
            'contact_info': contact_info,
            'sections': sections,
            'icon_metadata': sorted(icon_metadata, key=lambda x: x['filename'])  # Sort for consistency
        }, sort_keys=True)
        new_hash = hashlib.sha256(json_repr.encode('utf-8')).hexdigest()

        # Check if this is an update or new resume
        is_update = resume_id is not None

        if is_update:
            # Verify resume belongs to user and get current hash
            existing = supabase.table('resumes').select('id, json_hash').eq('id', resume_id).eq('user_id', user_id).is_('deleted_at', 'null').execute()
            if not existing.data:
                return jsonify({"success": False, "error": "Resume not found or unauthorized"}), 404

            # Smart diffing: skip if hash hasn't changed
            current_hash = existing.data[0].get('json_hash')
            if current_hash == new_hash:
                logging.debug(f"No changes detected for resume {resume_id}, skipping save")
                # Update user preferences even if no content change
                supabase.table('user_preferences').upsert({
                    'user_id': user_id,
                    'last_edited_resume_id': resume_id
                }).execute()
                return jsonify({
                    "success": True,
                    "message": "No changes detected",
                    "skipped": True,
                    "resume_id": resume_id
                }), 200
        else:
            # Check 5-resume limit for new resumes
            can_create, current_count = check_resume_limit(user_id)
            if not can_create:
                return jsonify({
                    "success": False,
                    "error": f"Resume limit reached ({current_count}/5)",
                    "error_code": "RESUME_LIMIT_REACHED"
                }), 403

            # Generate new resume ID
            resume_id = str(uuid.uuid4())

        # Prepare resume data
        resume_data = {
            'id': resume_id,
            'user_id': user_id,
            'title': title,
            'template_id': template_id,
            'contact_info': contact_info,
            'sections': sections,
            'json_hash': new_hash,  # Store hash for future diffing
            'updated_at': 'now()',
            'last_accessed_at': 'now()'
        }

        # Add AI import metadata if provided
        if ai_import_warnings is not None:
            resume_data['ai_import_warnings'] = ai_import_warnings
        if ai_import_confidence is not None:
            resume_data['ai_import_confidence'] = ai_import_confidence

        if not is_update:
            resume_data['created_at'] = 'now()'

        # Smart icon diffing: upload only changed icons
        # Fetch existing icons if updating
        existing_icons = {}
        if is_update:
            existing_result = supabase.table('resume_icons').select('filename, file_size, storage_path, storage_url, mime_type').eq('resume_id', resume_id).execute()
            existing_icons = {icon['filename']: icon for icon in existing_result.data}

        # Identify which icons need uploading
        icons_to_upload = []
        icons_to_keep = []
        icons_to_delete = []

        for icon in icons:
            filename = icon.get('filename')
            data_b64 = icon.get('data')

            if not filename or not data_b64:
                continue

            try:
                # Decode to get actual size
                file_data = base64.b64decode(data_b64.split(',')[1] if ',' in data_b64 else data_b64)
                new_size = len(file_data)

                # Check if icon exists and hasn't changed (size match = content match proxy)
                if filename in existing_icons:
                    existing_icon = existing_icons[filename]
                    if existing_icon['file_size'] == new_size:
                        # Icon unchanged, reuse existing record
                        icons_to_keep.append(existing_icon)
                        logging.debug(f"Reusing existing icon: {filename}")
                        continue

                # Icon is new or changed, needs upload
                icons_to_upload.append({
                    'filename': filename,
                    'data': file_data,
                    'size': new_size
                })

            except Exception as decode_error:
                logging.error(f"Failed to decode icon {filename}: {decode_error}")
                continue

        # Identify icons to delete (existed before but not in new set)
        new_icon_filenames = {icon['filename'] for icon in icons if icon.get('filename')}
        for filename in existing_icons:
            if filename not in new_icon_filenames:
                icons_to_delete.append(filename)

        # Upload only changed/new icons
        icon_records = []
        for icon_data in icons_to_upload:
            filename = icon_data['filename']
            file_data = icon_data['data']

            try:
                # Detect MIME type from filename extension
                extension = filename.rsplit('.', 1)[-1].lower()
                mime_type = {
                    'png': 'image/png',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'svg': 'image/svg+xml'
                }.get(extension, 'image/png')

                # Upload to storage
                storage_path, storage_url = upload_icon_to_storage(
                    user_id, resume_id, filename, file_data, mime_type
                )

                icon_records.append({
                    'id': str(uuid.uuid4()),
                    'resume_id': resume_id,
                    'user_id': user_id,
                    'filename': filename,
                    'storage_path': storage_path,
                    'storage_url': storage_url,
                    'mime_type': mime_type,
                    'file_size': icon_data['size'],
                    'created_at': 'now()'
                })
                logging.info(f"Uploaded new/changed icon: {filename}")

            except Exception as upload_error:
                logging.error(f"Failed to upload icon {filename}: {upload_error}")
                # Continue with other icons, don't fail entire save

        # Combine new uploads with unchanged icons
        all_icon_records = icon_records + [
            {
                'id': str(uuid.uuid4()),
                'resume_id': resume_id,
                'user_id': user_id,
                'filename': icon['filename'],
                'storage_path': icon['storage_path'],
                'storage_url': icon['storage_url'],
                'mime_type': icon['mime_type'],
                'file_size': icon['file_size'],
                'created_at': 'now()'
            }
            for icon in icons_to_keep
        ]

        # Save resume to database (upsert)
        supabase.table('resumes').upsert(resume_data).execute()

        # Delete removed icons
        if icons_to_delete and is_update:
            for filename in icons_to_delete:
                supabase.table('resume_icons').delete().eq('resume_id', resume_id).eq('filename', filename).execute()
                logging.info(f"Deleted removed icon: {filename}")

        # Replace all icon records with new set
        if is_update:
            supabase.table('resume_icons').delete().eq('resume_id', resume_id).execute()

        if all_icon_records:
            supabase.table('resume_icons').insert(all_icon_records).execute()

        logging.info(f"Icon summary - Uploaded: {len(icon_records)}, Kept: {len(icons_to_keep)}, Deleted: {len(icons_to_delete)}")

        # Update user preferences to track last edited resume
        supabase.table('user_preferences').upsert({
            'user_id': user_id,
            'last_edited_resume_id': resume_id
        }).execute()

        logging.info(f"Resume {'updated' if is_update else 'created'} successfully: {resume_id}")

        return jsonify({
            "success": True,
            "resume_id": resume_id,
            "message": f"Resume {'updated' if is_update else 'saved'} successfully"
        }), 200

    except Exception as e:
        logging.error(f"Error saving resume: {e}")
        return jsonify({"success": False, "error": "Failed to save resume"}), 500


@app.route("/api/resumes", methods=["GET"])
@require_auth
@retry_on_connection_error(max_retries=3, backoff_factor=0.5)
def list_resumes():
    """
    List all resumes for the authenticated user.

    Query Parameters:
        limit (int): Number of resumes to return (default: 20, max: 50)
        offset (int): Number of resumes to skip (default: 0)

    Response:
        {
            "success": true,
            "resumes": [
                {
                    "id": "uuid",
                    "title": "Software Engineer Resume",
                    "template_id": "modern-with-icons",
                    "created_at": "2025-01-15T10:30:00Z",
                    "updated_at": "2025-01-20T14:22:00Z",
                    "last_accessed_at": "2025-01-20T14:22:00Z",
                    "icon_count": 3
                }
            ],
            "total_count": 3,
            "limit": 20
        }
    """
    try:
        user_id = request.user_id

        # Get pagination parameters
        limit = min(int(request.args.get('limit', 20)), 50)  # Max 50
        offset = int(request.args.get('offset', 0))

        # Query resumes with pagination and count in a single request
        # This eliminates connection gap that caused "Server disconnected" errors with large result sets
        result = supabase.table('resumes') \
            .select('id, title, template_id, created_at, updated_at, last_accessed_at, pdf_url, pdf_generated_at, thumbnail_url', count='exact') \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .order('updated_at', desc=True) \
            .range(offset, offset + limit - 1) \
            .execute()

        resumes = result.data
        total_count = result.count if hasattr(result, 'count') else len(result.data)

        return jsonify({
            "success": True,
            "resumes": resumes,
            "total_count": total_count,
            "limit": limit
        }), 200

    except Exception as e:
        logging.error(f"Error listing resumes: {e}", exc_info=True)
        error_msg = "Failed to list resumes"

        # Provide more specific error message for common issues
        error_str = str(e).lower()
        if "server disconnected" in error_str or "connection" in error_str:
            error_msg = "Connection to database failed. Please try again."
        elif "timeout" in error_str:
            error_msg = "Request timed out. Please try again."

        return jsonify({"success": False, "error": error_msg}), 500


@app.route("/api/resumes/count", methods=["GET"])
@require_auth
@retry_on_connection_error(max_retries=3, backoff_factor=0.5)
def get_resume_count():
    """
    Get total count of resumes for the authenticated user.

    Lightweight endpoint that returns only the count, not full resume objects.
    Used for UI badges and limit checks.

    Response:
        {
            "success": true,
            "count": 3
        }
    """
    try:
        user_id = request.user_id

        # Count-only query using Supabase's count feature
        result = supabase.table('resumes') \
            .select('id', count='exact') \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        count = result.count if hasattr(result, 'count') else len(result.data)

        logging.debug(f"Resume count for user {user_id}: {count}")

        return jsonify({
            "success": True,
            "count": count
        }), 200

    except Exception as e:
        logging.error(f"Error getting resume count: {e}", exc_info=True)
        error_msg = "Failed to get resume count"

        # Specific error messages for common issues
        error_str = str(e).lower()
        if "server disconnected" in error_str or "connection" in error_str:
            error_msg = "Connection to database failed. Please try again."
        elif "timeout" in error_str:
            error_msg = "Request timed out. Please try again."

        return jsonify({"success": False, "error": error_msg}), 500


@app.route("/api/resumes/<resume_id>", methods=["GET"])
@require_auth
def load_resume(resume_id):
    """
    Load a specific resume for the authenticated user.

    Response:
        {
            "success": true,
            "resume": {
                "id": "uuid",
                "title": "Software Engineer Resume",
                "template_id": "modern-with-icons",
                "contact_info": {...},
                "sections": [...],
                "icons": [
                    {
                        "filename": "google.png",
                        "storage_url": "https://..."
                    }
                ],
                "updated_at": "2025-01-20T14:22:00Z"
            }
        }
    """
    try:
        user_id = request.user_id

        # Query resume
        result = supabase.table('resumes') \
            .select('*') \
            .eq('id', resume_id) \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        if not result.data:
            return jsonify({"success": False, "error": "Resume not found"}), 404

        resume = result.data[0]

        # Migrate old linkedin format to new social_links (backward compatibility)
        if resume.get('contact_info'):
            resume['contact_info'] = migrate_linkedin_to_social_links(resume['contact_info'])

        # Fetch associated icons
        icons_result = supabase.table('resume_icons') \
            .select('filename, storage_url, storage_path') \
            .eq('resume_id', resume_id) \
            .execute()

        resume['icons'] = icons_result.data

        # Update last_accessed_at while preserving updated_at (non-blocking - don't fail if this fails)
        try:
            # Preserve updated_at when only updating last_accessed_at
            current_updated_at = resume.get('updated_at')
            update_data = {'last_accessed_at': datetime.now().isoformat()}
            if current_updated_at:
                update_data['updated_at'] = current_updated_at  # Preserve original timestamp

            supabase.table('resumes').update(update_data).eq('id', resume_id).execute()
        except Exception as timestamp_error:
            logging.warning(f"Failed to update last_accessed_at for resume {resume_id}: {timestamp_error}")
            # Continue anyway - this is not critical

        return jsonify({
            "success": True,
            "resume": resume
        }), 200

    except Exception as e:
        logging.error(f"Error loading resume: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to load resume: {str(e)}"}), 500


@app.route("/api/resumes/<resume_id>", methods=["DELETE"])
@require_auth
def delete_resume(resume_id):
    """
    Soft delete a resume for the authenticated user.

    Response:
        {
            "success": true,
            "message": "Resume deleted successfully"
        }
    """
    try:
        user_id = request.user_id

        # Verify resume belongs to user
        result = supabase.table('resumes') \
            .select('id') \
            .eq('id', resume_id) \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        if not result.data:
            return jsonify({"success": False, "error": "Resume not found"}), 404

        # Soft delete (set deleted_at timestamp)
        supabase.table('resumes') \
            .update({'deleted_at': 'now()'}) \
            .eq('id', resume_id) \
            .execute()

        logging.info(f"Resume deleted successfully: {resume_id}")

        return jsonify({
            "success": True,
            "message": "Resume deleted successfully"
        }), 200

    except Exception as e:
        logging.error(f"Error deleting resume: {e}")
        return jsonify({"success": False, "error": "Failed to delete resume"}), 500


def _copy_icon_worker(user_id, new_resume_id, source_icon):
    """
    Worker function to copy a single icon in a thread pool.
    Downloads from source, uploads to destination, and returns new record.

    Note: Creates its own Supabase client instance for thread safety.
    """
    try:
        # Create thread-local Supabase client for thread safety
        thread_supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

        # Download icon from source storage path
        source_path = source_icon['storage_path']
        icon_data = thread_supabase.storage.from_('resume-icons').download(source_path)

        # Upload to new storage path
        new_storage_path = f"{user_id}/{new_resume_id}/{source_icon['filename']}"
        thread_supabase.storage.from_('resume-icons').upload(
            new_storage_path,
            icon_data,
            file_options={"content-type": source_icon.get('mime_type', 'image/png'), "upsert": "true"}
        )

        # Get public URL for new icon
        new_storage_url = thread_supabase.storage.from_('resume-icons').get_public_url(new_storage_path)

        # Prepare new icon record
        return {
            'id': str(uuid.uuid4()),
            'resume_id': new_resume_id,
            'user_id': user_id,
            'filename': source_icon['filename'],
            'storage_path': new_storage_path,
            'storage_url': new_storage_url,
            'mime_type': source_icon.get('mime_type', 'image/png'),
            'file_size': source_icon.get('file_size', 0),
            'created_at': 'now()'
        }
    except Exception as icon_error:
        logging.error(f"Failed to copy icon {source_icon.get('filename', 'unknown')}: {icon_error}")
        return None


@app.route("/api/resumes/<resume_id>/duplicate", methods=["POST"])
@require_auth
def duplicate_resume(resume_id):
    """
    Duplicate a resume with a new title.

    Request body:
        {
            "new_title": "Copy of My Resume"
        }

    Response:
        {
            "success": true,
            "resume_id": "new-uuid",
            "message": "Resume duplicated successfully"
        }
    """
    try:
        user_id = request.user_id
        data = request.get_json()
        new_title = data.get('new_title', '').strip()

        if not new_title:
            return jsonify({"success": False, "error": "New title is required"}), 400

        # Check 5-resume limit before duplicating
        can_create, current_count = check_resume_limit(user_id)
        if not can_create:
            return jsonify({
                "success": False,
                "error": "You have reached the maximum limit of 5 resumes",
                "error_code": "RESUME_LIMIT_REACHED"
            }), 400

        # Verify source resume belongs to user
        source_result = supabase.table('resumes') \
            .select('*') \
            .eq('id', resume_id) \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        if not source_result.data:
            return jsonify({"success": False, "error": "Source resume not found"}), 404

        source_resume = source_result.data[0]

        # Generate new UUID for duplicate
        new_resume_id = str(uuid.uuid4())

        # Create new resume with same data but new ID and title
        new_resume_data = {
            'id': new_resume_id,
            'user_id': user_id,
            'title': new_title,
            'template_id': source_resume['template_id'],
            'contact_info': source_resume['contact_info'],
            'sections': source_resume['sections'],
            'json_hash': source_resume.get('json_hash'),
            'created_at': 'now()',
            'updated_at': 'now()',
            'last_accessed_at': 'now()'
        }

        # Insert new resume
        supabase.table('resumes').insert(new_resume_data).execute()

        # Fetch source icons
        source_icons_result = supabase.table('resume_icons') \
            .select('filename, storage_path, mime_type, file_size') \
            .eq('resume_id', resume_id) \
            .execute()

        # Concurrently copy icons from source to new resume using a thread pool
        new_icon_records = []
        source_icons = source_icons_result.data

        if source_icons:
            with ThreadPoolExecutor(max_workers=MAX_ICON_COPY_WORKERS) as executor:
                # Use partial to bind user_id and new_resume_id, leaving source_icon as the iterable arg
                worker = partial(_copy_icon_worker, user_id, new_resume_id)
                results = executor.map(worker, source_icons)

                # Filter out None results from failed copies
                new_icon_records = [record for record in results if record is not None]

        # Insert new icon records
        if new_icon_records:
            supabase.table('resume_icons').insert(new_icon_records).execute()

        logging.info(f"Resume duplicated successfully: {resume_id} -> {new_resume_id}")

        return jsonify({
            "success": True,
            "resume_id": new_resume_id,
            "message": "Resume duplicated successfully"
        }), 200

    except Exception as e:
        logging.error(f"Error duplicating resume: {e}")
        return jsonify({"success": False, "error": "Failed to duplicate resume"}), 500


@app.route("/api/migrate-anonymous-resumes", methods=["POST"])
@require_auth
def migrate_anonymous_resumes():
    """
    Migrate all resumes from an old user to the authenticated user.
    Called when a user signs in after creating resumes (handles Supabase account linking).

    Note: Supabase automatically links anonymous accounts to OAuth accounts on sign-in,
    so the old user may no longer appear as "anonymous" when this endpoint is called.

    Request body:
        {
            "old_user_id": "uuid-of-old-user"
        }

    Returns:
        {
            "migrated_count": int,
            "total_count": int,
            "exceeds_limit": bool,
            "message": str
        }
    """
    try:
        new_user_id = request.user_id  # Authenticated user from JWT
        old_user_id = request.json.get('old_user_id')

        # Validation
        if not old_user_id:
            return jsonify({"error": "old_user_id is required"}), 400

        if old_user_id == new_user_id:
            return jsonify({
                "migrated_count": 0,
                "total_count": 0,
                "exceeds_limit": False,
                "message": "Same user, no migration needed"
            }), 200

        # NOTE: We don't check if the old user is "anonymous" because Supabase
        # automatically links anonymous accounts to OAuth accounts on sign-in,
        # changing app_metadata.provider from 'anonymous' to 'google'/'email'.
        # Instead, we check if the old user has resumes to migrate.

        # Get resume counts
        old_resumes_response = supabase.table('resumes') \
            .select('id', count='exact') \
            .eq('user_id', old_user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        new_resumes_response = supabase.table('resumes') \
            .select('id', count='exact') \
            .eq('user_id', new_user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        old_count = old_resumes_response.count or 0
        new_count = new_resumes_response.count or 0
        total_count = old_count + new_count
        exceeds_limit = total_count > 5

        # Early return if no resumes to migrate (idempotency)
        if old_count == 0:
            return jsonify({
                "migrated_count": 0,
                "total_count": new_count,
                "exceeds_limit": False,
                "message": "No resumes to migrate"
            }), 200

        logging.info(f"Starting migration: {old_count} resumes from {old_user_id} to {new_user_id} (total: {total_count})")

        # Get all resumes being migrated with their updated_at timestamps
        resumes_to_migrate = supabase.table('resumes') \
            .select('id, updated_at') \
            .eq('user_id', old_user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        old_resume_ids = [r['id'] for r in resumes_to_migrate.data]
        resume_timestamps = {r['id']: r['updated_at'] for r in resumes_to_migrate.data}

        # Step 1: Update resume ownership while preserving updated_at timestamps
        # We update each resume individually to preserve its original updated_at
        for resume_id, original_timestamp in resume_timestamps.items():
            supabase.table('resumes') \
                .update({
                    'user_id': new_user_id,
                    'updated_at': original_timestamp  # Preserve original timestamp
                }) \
                .eq('id', resume_id) \
                .execute()

        logging.info(f"Updated {old_count} resume records while preserving timestamps")

        # Step 2: Migrate icons (storage files + database records)
        icons_response = supabase.table('resume_icons') \
            .select('*') \
            .in_('resume_id', old_resume_ids) \
            .execute()

        icons_to_migrate = icons_response.data
        migrated_icons = 0
        failed_icons = 0

        for icon in icons_to_migrate:
            try:
                old_path = icon['storage_path']
                resume_id = icon['resume_id']
                filename = icon['filename']

                # New storage path with new user_id
                new_path = f"{new_user_id}/{resume_id}/{filename}"

                # Download from old path
                file_data = supabase.storage.from_('resume-icons').download(old_path)

                # Upload to new path
                supabase.storage.from_('resume-icons').upload(
                    new_path,
                    file_data,
                    file_options={"content-type": icon.get('mime_type', 'image/png'), "upsert": "true"}
                )

                # Get new public URL
                new_url = supabase.storage.from_('resume-icons').get_public_url(new_path)

                # Update icon record
                supabase.table('resume_icons') \
                    .update({
                        'user_id': new_user_id,
                        'storage_path': new_path,
                        'storage_url': new_url
                    }) \
                    .eq('id', icon['id']) \
                    .execute()

                # Delete old file from storage
                try:
                    supabase.storage.from_('resume-icons').remove([old_path])
                except Exception as delete_error:
                    logging.warning(f"Failed to delete old icon file {old_path}: {delete_error}")
                    # Non-critical error, continue

                migrated_icons += 1

            except Exception as icon_error:
                logging.error(f"Failed to migrate icon {icon.get('filename', 'unknown')}: {icon_error}")
                failed_icons += 1
                # Continue with other icons

        logging.info(f"Migrated {migrated_icons} icons, {failed_icons} failed")

        # Step 3: Update user preferences
        # Delete old user's preferences
        try:
            supabase.table('user_preferences') \
                .delete() \
                .eq('user_id', old_user_id) \
                .execute()
        except Exception as pref_error:
            logging.warning(f"Failed to delete old preferences: {pref_error}")

        # Update new user's preferences if needed
        # (The frontend will handle setting last_edited_resume_id on next save)

        logging.info(f"Migration complete: {old_count} resumes migrated to {new_user_id}")

        return jsonify({
            "migrated_count": old_count,
            "total_count": total_count,
            "exceeds_limit": exceeds_limit,
            "message": f"Successfully migrated {old_count} resume(s)"
        }), 200

    except Exception as e:
        logging.error(f"Error migrating anonymous resumes: {e}")
        return jsonify({"error": "Failed to migrate resumes"}), 500


@app.route("/api/resumes/<resume_id>", methods=["PATCH"])
@require_auth
def update_resume_partial(resume_id):
    """
    Partially update a resume (currently supports title only).

    Request body:
        {
            "title": "New Resume Title"
        }

    Response:
        {
            "success": true,
            "title": "New Resume Title"
        }
    """
    try:
        user_id = request.user_id
        data = request.get_json()
        new_title = data.get('title', '').strip()

        if not new_title:
            return jsonify({"success": False, "error": "Title cannot be empty"}), 400

        if len(new_title) > 200:
            return jsonify({"success": False, "error": "Title too long (max 200 characters)"}), 400

        # Verify resume belongs to user
        result = supabase.table('resumes') \
            .select('id') \
            .eq('id', resume_id) \
            .eq('user_id', user_id) \
            .is_('deleted_at', 'null') \
            .execute()

        if not result.data:
            return jsonify({"success": False, "error": "Resume not found"}), 404

        # Update title
        supabase.table('resumes') \
            .update({
                'title': new_title,
                'updated_at': 'now()'
            }) \
            .eq('id', resume_id) \
            .execute()

        logging.info(f"Resume title updated: {resume_id} -> {new_title}")

        return jsonify({
            "success": True,
            "title": new_title
        }), 200

    except Exception as e:
        logging.error(f"Error updating resume title: {e}")
        return jsonify({"success": False, "error": "Failed to update resume title"}), 500


@app.route("/api/resumes/<resume_id>/pdf", methods=["POST"])
@require_auth
def generate_pdf_for_saved_resume(resume_id):
    """
    Generate PDF on-demand for a saved resume.

    Returns: PDF blob (same as /api/generate)
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            user_id = request.user_id
            temp_dir_path = Path(temp_dir)

            # Load resume data
            result = supabase.table('resumes') \
                .select('*') \
                .eq('id', resume_id) \
                .eq('user_id', user_id) \
                .is_('deleted_at', 'null') \
                .execute()

            if not result.data:
                return jsonify({"success": False, "error": "Resume not found"}), 404

            resume = result.data[0]

            # Load icons
            icons_result = supabase.table('resume_icons') \
                .select('filename, storage_path') \
                .eq('resume_id', resume_id) \
                .execute()

            # Create session directory for icons
            session_id = str(uuid.uuid4())
            session_icons_dir = temp_dir_path / "icons"
            session_icons_dir.mkdir(parents=True, exist_ok=True)

            # Download icons from storage
            failed_icons = []
            for icon in icons_result.data:
                icon_path = session_icons_dir / icon['filename']
                success = download_icon_from_storage(icon['storage_path'], str(icon_path))
                if not success:
                    failed_icons.append(icon['filename'])
                    logging.error(f"Failed to download icon: {icon['filename']} from {icon['storage_path']}")

            # Fail fast if any icons missing
            if failed_icons:
                error_msg = (
                    f"Unable to load {len(failed_icons)} icon(s) from cloud storage: {', '.join(failed_icons)}. "
                    f"Icons may not have been properly saved when the resume was created. "
                    f"Please edit the resume and re-upload the missing icons."
                )
                logging.error(f"Preview generation failed: {error_msg}")
                return jsonify({"success": False, "error": error_msg}), 500

            # Prepare YAML data
            yaml_data = {
                'template': resume.get('template_id'),
                'contact_info': resume.get('contact_info', {}),
                'sections': resume.get('sections', [])
            }

            # Normalize sections
            yaml_data = normalize_sections(yaml_data)

            # Icon validation and copying for icon-supporting templates
            template_id = resume.get('template_id', 'modern')
            uses_icons = template_id == "modern-with-icons"

            # Always copy base contact icons that are hardcoded in templates
            # These are required for all modern template variants (with and without content icons)
            base_contact_icons = [
                "location.png", "email.png", "phone.png", "linkedin.png",
                "github.png", "twitter.png", "website.png", "pinterest.png",
                "medium.png", "youtube.png", "stackoverflow.png", "behance.png", "dribbble.png"
            ]

            for icon_name in base_contact_icons:
                default_icon_path = ICONS_DIR / icon_name
                if default_icon_path.exists():
                    session_icon_path = session_icons_dir / icon_name
                    shutil.copy2(default_icon_path, session_icon_path)
                    logging.debug(f"Copied base contact icon: {icon_name}")
                else:
                    logging.warning(f"Base contact icon not found: {icon_name}")

            # Extract content icons (from Experience, Education, Certifications, etc.) only for icon-supporting templates
            if uses_icons:
                referenced_icons = extract_icons_from_yaml(yaml_data)
                logging.debug(f"Found {len(referenced_icons)} referenced icons in resume data")

                # Validate and copy default icons
                missing_icons = []
                for icon_name in referenced_icons:
                    # Skip if already copied as base contact icon
                    if icon_name in base_contact_icons:
                        continue

                    # Check if user uploaded this icon (already downloaded from storage above)
                    user_icon_path = session_icons_dir / icon_name
                    if user_icon_path.exists():
                        logging.debug(f"Icon already in session: {icon_name} (user-uploaded)")
                        continue

                    # Try to copy from default icons directory
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied default icon: {icon_name}")
                    else:
                        # Icon not found in storage or /icons/ directory
                        missing_icons.append(icon_name)
                        logging.error(f"Icon not found: {icon_name} (not in storage or /icons/)")

                # Return error if any icons are missing
                if missing_icons:
                    error_msg = (
                        f"Missing {len(missing_icons)} icon(s) required for PDF generation: {', '.join(missing_icons)}. "
                        f"These icons were referenced in your resume but are not available. "
                        f"Please edit this resume to either upload the missing icons or remove them from your sections."
                    )
                    logging.error(f"PDF generation blocked: {error_msg}")
                    return jsonify({
                        "success": False,
                        "error": error_msg,
                        "missing_icons": missing_icons
                    }), 400

            # Write YAML to temp file
            yaml_path = temp_dir_path / "resume.yaml"
            with open(yaml_path, 'w') as f:
                yaml.dump(yaml_data, f)

            # Generate PDF
            timestamp = datetime.now().strftime("%Y%m%d_%H_%M_%S")
            output_path = temp_dir_path / f"Resume_{timestamp}.pdf"

            template_id = resume.get('template_id', 'modern')

            # Map template IDs to actual templates
            template_mapping = {
                "modern-with-icons": "modern",
                "modern-no-icons": "modern",
                "modern": "modern",
                "classic": "classic",
                "classic-alex-rivera": "classic",
                "classic-jane-doe": "classic"
            }

            actual_template = template_mapping.get(template_id, "modern")

            # Generate PDF using appropriate method
            if actual_template == "classic":
                generate_latex_pdf(yaml_data, str(session_icons_dir), str(output_path), actual_template)
            else:
                # Use process pool or subprocess
                if PDF_PROCESS_POOL is None:
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

                    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT))

                    if result.returncode != 0:
                        logging.error(f"PDF generation error: {result.stderr}")
                        raise RuntimeError("Failed to generate PDF")
                else:
                    future = PDF_PROCESS_POOL.submit(
                        pdf_generation_worker,
                        actual_template,
                        yaml_path,
                        output_path,
                        session_icons_dir,
                        session_id
                    )

                    result = future.result(timeout=60)

                    if not result["success"]:
                        raise RuntimeError(f"Failed to generate PDF: {result['error']}")

            if not output_path.exists():
                raise FileNotFoundError("PDF file was not generated")

            # Generate thumbnail from PDF (piggyback strategy)
            try:
                thumbnail_url = generate_thumbnail_from_pdf(str(output_path), user_id, resume_id)
                if thumbnail_url:
                    # Fetch current updated_at to preserve it (avoid triggering timestamp update for metadata-only change)
                    current_resume = supabase.table('resumes').select('updated_at').eq('id', resume_id).execute()
                    current_updated_at = current_resume.data[0]['updated_at'] if current_resume.data else None

                    # Update resume with thumbnail URL and timestamp
                    current_time = datetime.now(timezone.utc).isoformat()
                    update_data = {
                        'thumbnail_url': thumbnail_url,
                        'pdf_generated_at': current_time  # Use consistent timestamp
                    }
                    if current_updated_at:
                        update_data['updated_at'] = current_updated_at  # Preserve original timestamp

                    supabase.table('resumes').update(update_data).eq('id', resume_id).execute()
                    logging.info(f"Thumbnail generated and saved for resume {resume_id}")
                else:
                    logging.warning(f"Thumbnail generation failed for resume {resume_id}, but continuing with PDF")
            except Exception as thumb_error:
                # Don't fail PDF generation if thumbnail fails
                logging.error(f"Error during thumbnail generation: {thumb_error}")

            # Return PDF
            return send_file(
                output_path,
                as_attachment=not _is_preview_request(),  # inline for preview, attachment for download
                mimetype="application/pdf",
                download_name=f"{resume.get('title', 'Resume')}_{timestamp}.pdf"
            )

        except Exception as e:
            logging.error(f"Error generating PDF for saved resume: {e}")
            return jsonify({"success": False, "error": "Failed to generate PDF"}), 500


@app.route("/api/resumes/<resume_id>/thumbnail", methods=["POST"])
@require_auth
@retry_on_connection_error(max_retries=3, backoff_factor=0.5)
def generate_thumbnail_for_resume(resume_id):
    """
    Generate thumbnail on-demand for a saved resume.

    This endpoint generates a PDF and extracts a thumbnail without returning the PDF.
    Designed to be called asynchronously when the user navigates away from the editor.

    Returns:
        {
            "success": true,
            "thumbnail_url": "https://...",
            "pdf_generated_at": "2025-12-24T..."
        }
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            user_id = request.user_id
            temp_dir_path = Path(temp_dir)

            # Load resume data
            result = supabase.table('resumes') \
                .select('*') \
                .eq('id', resume_id) \
                .eq('user_id', user_id) \
                .is_('deleted_at', 'null') \
                .execute()

            if not result.data:
                return jsonify({"success": False, "error": "Resume not found"}), 404

            resume = result.data[0]

            # Load icons
            icons_result = supabase.table('resume_icons') \
                .select('filename, storage_path') \
                .eq('resume_id', resume_id) \
                .execute()

            # Create session directory for icons
            session_id = str(uuid.uuid4())
            session_icons_dir = temp_dir_path / "icons"
            session_icons_dir.mkdir(parents=True, exist_ok=True)

            # Download icons from storage
            failed_icons = []
            for icon in icons_result.data:
                icon_path = session_icons_dir / icon['filename']
                success = download_icon_from_storage(icon['storage_path'], str(icon_path))
                if not success:
                    failed_icons.append(icon['filename'])
                    logging.error(f"Failed to download icon: {icon['filename']} from {icon['storage_path']}")

            # Log warning if any icons failed, but continue with graceful degradation
            if failed_icons:
                warning_msg = (
                    f"Unable to load {len(failed_icons)} icon(s) from cloud storage: {', '.join(failed_icons)}. "
                    f"Continuing with available icons. PDF will be generated with missing icons."
                )
                logging.warning(f"Thumbnail generation degraded: {warning_msg}")
                # Continue execution - don't fail fast
                # Icons will be missing from PDF, but thumbnail will still generate

            # Prepare YAML data
            yaml_data = {
                'template': resume.get('template_id'),
                'contact_info': resume.get('contact_info', {}),
                'sections': resume.get('sections', [])
            }

            # Normalize sections
            yaml_data = normalize_sections(yaml_data)

            # Icon validation and copying for icon-supporting templates
            template_id = resume.get('template_id', 'modern')
            uses_icons = template_id == "modern-with-icons"

            # Always copy base contact icons that are hardcoded in templates
            # These are required for all modern template variants (with and without content icons)
            base_contact_icons = [
                "location.png", "email.png", "phone.png", "linkedin.png",
                "github.png", "twitter.png", "website.png", "pinterest.png",
                "medium.png", "youtube.png", "stackoverflow.png", "behance.png", "dribbble.png"
            ]

            for icon_name in base_contact_icons:
                default_icon_path = ICONS_DIR / icon_name
                if default_icon_path.exists():
                    session_icon_path = session_icons_dir / icon_name
                    shutil.copy2(default_icon_path, session_icon_path)
                    logging.debug(f"Copied base contact icon: {icon_name}")
                else:
                    logging.warning(f"Base contact icon not found: {icon_name}")

            # Extract content icons (from Experience, Education, Certifications, etc.) only for icon-supporting templates
            if uses_icons:
                referenced_icons = extract_icons_from_yaml(yaml_data)
                logging.debug(f"Found {len(referenced_icons)} referenced icons in resume data")

                # Validate and copy default icons
                missing_icons = []
                for icon_name in referenced_icons:
                    # Skip if already copied as base contact icon
                    if icon_name in base_contact_icons:
                        continue

                    # Check if user uploaded this icon (already downloaded from storage above)
                    user_icon_path = session_icons_dir / icon_name
                    if user_icon_path.exists():
                        logging.debug(f"Icon already in session: {icon_name} (user-uploaded)")
                        continue

                    # Try to copy from default icons directory
                    default_icon_path = ICONS_DIR / icon_name
                    if default_icon_path.exists():
                        session_icon_path = session_icons_dir / icon_name
                        shutil.copy2(default_icon_path, session_icon_path)
                        logging.debug(f"Copied default icon: {icon_name}")
                    else:
                        # Icon not found in storage or /icons/ directory
                        missing_icons.append(icon_name)
                        logging.error(f"Icon not found: {icon_name} (not in storage or /icons/)")

                # Return error if any icons are missing
                if missing_icons:
                    error_msg = (
                        f"Missing {len(missing_icons)} icon(s) required for PDF generation: {', '.join(missing_icons)}. "
                        f"These icons were referenced in your resume but are not available. "
                        f"Please edit this resume to either upload the missing icons or remove them from your sections."
                    )
                    logging.error(f"PDF generation blocked: {error_msg}")
                    return jsonify({
                        "success": False,
                        "error": error_msg,
                        "missing_icons": missing_icons
                    }), 400

            # Write YAML to temp file
            yaml_path = temp_dir_path / "resume.yaml"
            with open(yaml_path, 'w') as f:
                yaml.dump(yaml_data, f)

            # Generate PDF
            timestamp = datetime.now().strftime("%Y%m%d_%H_%M_%S")
            output_path = temp_dir_path / f"Resume_{timestamp}.pdf"

            template_id = resume.get('template_id', 'modern')

            # Map template IDs to actual templates
            template_mapping = {
                "modern-with-icons": "modern",
                "modern-no-icons": "modern",
                "modern": "modern",
                "classic": "classic",
                "classic-alex-rivera": "classic",
                "classic-jane-doe": "classic"
            }

            actual_template = template_mapping.get(template_id, "modern")

            # Generate PDF using appropriate method
            if actual_template == "classic":
                generate_latex_pdf(yaml_data, str(session_icons_dir), str(output_path), actual_template)
            else:
                # Use process pool or subprocess
                if PDF_PROCESS_POOL is None:
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

                    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT))

                    if result.returncode != 0:
                        logging.error(f"PDF generation error: {result.stderr}")
                        raise RuntimeError("Failed to generate PDF")
                else:
                    future = PDF_PROCESS_POOL.submit(
                        pdf_generation_worker,
                        actual_template,
                        yaml_path,
                        output_path,
                        session_icons_dir,
                        session_id
                    )

                    result = future.result(timeout=60)

                    if not result["success"]:
                        raise RuntimeError(f"Failed to generate PDF: {result['error']}")

            if not output_path.exists():
                raise FileNotFoundError("PDF file was not generated")

            # Generate thumbnail from PDF
            thumbnail_url = generate_thumbnail_from_pdf(str(output_path), user_id, resume_id)

            if not thumbnail_url:
                return jsonify({"success": False, "error": "Failed to generate thumbnail"}), 500

            # Fetch current updated_at to preserve it (avoid triggering timestamp update for metadata-only change)
            current_resume = supabase.table('resumes').select('updated_at').eq('id', resume_id).execute()
            current_updated_at = current_resume.data[0]['updated_at'] if current_resume.data else None

            # Update resume with thumbnail URL and timestamp
            current_time = datetime.now(timezone.utc).isoformat()
            update_data = {
                'thumbnail_url': thumbnail_url,
                'pdf_generated_at': current_time  # Use same timestamp as response for polling
            }
            if current_updated_at:
                update_data['updated_at'] = current_updated_at  # Preserve original timestamp

            supabase.table('resumes').update(update_data).eq('id', resume_id).execute()

            logging.info(f"Thumbnail generated successfully for resume {resume_id}")
            logging.debug(f"Thumbnail endpoint response - pdf_generated_at: {current_time}")
            logging.debug(f"Database update successful for resume {resume_id}")

            return jsonify({
                "success": True,
                "thumbnail_url": thumbnail_url,
                "pdf_generated_at": current_time
            }), 200

        except Exception as e:
            error_classification = classify_thumbnail_error(e)
            logging.error(
                f"Error generating thumbnail for resume {resume_id}: {e} "
                f"(retryable={error_classification['retryable']}, type={error_classification['error_type']})"
            )

            if error_classification['retryable']:
                # Return success with null thumbnail - frontend will retry
                return jsonify({
                    "success": True,
                    "thumbnail_url": None,
                    "pdf_generated_at": None,
                    "retryable": True,
                    "error_type": error_classification['error_type']
                }), 200
            else:
                # Permanent error - return error but don't expect retry
                return jsonify({
                    "success": False,
                    "error": error_classification.get('user_message', str(e)),
                    "retryable": False
                }), 500


# User Preferences API Endpoints

@app.route("/api/user/preferences", methods=["GET"])
@require_auth
def get_user_preferences():
    """
    Get user preferences including last_edited_resume_id.

    Response:
        {
            "success": true,
            "preferences": {
                "user_id": "uuid",
                "last_edited_resume_id": "uuid" | null,
                "preferences": {...}
            }
        }
    """
    try:
        user_id = request.user_id

        # Query user preferences
        result = supabase.table('user_preferences') \
            .select('*') \
            .eq('user_id', user_id) \
            .execute()

        if result.data:
            return jsonify({
                "success": True,
                "preferences": result.data[0]
            }), 200
        else:
            # Create default preferences if not exists
            default_prefs = {
                'user_id': user_id,
                'last_edited_resume_id': None,
                'preferences': {}
            }

            supabase.table('user_preferences').insert(default_prefs).execute()

            return jsonify({
                "success": True,
                "preferences": default_prefs
            }), 200

    except Exception as e:
        logging.error(f"Error getting user preferences: {e}")
        return jsonify({"success": False, "error": "Failed to get preferences"}), 500


@app.route("/api/user/preferences", methods=["POST"])
@require_auth
def update_user_preferences():
    """
    Update user preferences (e.g., last_edited_resume_id).

    Request JSON:
        {
            "last_edited_resume_id": "uuid",
            "preferences": {...}  // optional
        }

    Response:
        {
            "success": true,
            "message": "Preferences updated"
        }
    """
    try:
        user_id = request.user_id
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Prepare update data
        prefs_data = {
            'user_id': user_id,
            'last_edited_resume_id': data.get('last_edited_resume_id'),
            'preferences': data.get('preferences', {})
        }

        # Upsert preferences
        supabase.table('user_preferences').upsert(prefs_data).execute()

        logging.info(f"Updated preferences for user {user_id}")

        return jsonify({
            "success": True,
            "message": "Preferences updated"
        }), 200

    except Exception as e:
        logging.error(f"Error updating user preferences: {e}")
        return jsonify({"success": False, "error": "Failed to update preferences"}), 500


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
