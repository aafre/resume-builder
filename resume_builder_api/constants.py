from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
TEMPLATES_DIR = BASE_DIR / "samples"  # For YAML Resume templates

JINJA_TEMPLATES_DIR = (
    BASE_DIR / "templates"
)  # For Jinja templates - used for HTML to PDF conversion

ICONS_DIR = (
    BASE_DIR / "icons"
)  # Needed for displaying icons into HTML templates (e.g., social media icons)

OUTPUT_DIR = BASE_DIR / "output"  # Directory where PDFs and temp files will be saved


# API constants
CORS_ORIGINS = [
    "http://localhost:3000",
]

MAX_REQUEST_SIZE = 10 * 1024 * 1024  # 10 MB
