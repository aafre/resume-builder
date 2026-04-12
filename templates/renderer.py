"""Rendering dispatch layer for PDF generation.

Routes PDF generation requests to the correct pipeline (HTML via
wkhtmltopdf or LaTeX via xelatex) based on the template's registered
engine type.
"""

from __future__ import annotations

from templates.models import PDFOptions, TemplateEngine
from templates.registry import get


def generate_pdf(
    template_id: str,
    yaml_data: dict | None = None,
    yaml_path: str | None = None,
    output_path: str | None = None,
    icons_dir: str | None = None,
    session_id: str | None = None,
    settings: dict | None = None,
) -> None:
    """Single entry point for PDF generation.

    Dispatches to the correct rendering pipeline (HTML via wkhtmltopdf or
    LaTeX via xelatex) based on the template's registered engine type.

    Args:
        template_id: Template identifier (e.g., "modern-with-icons",
            "classic-alex-rivera").
        yaml_data: Parsed YAML data dict (required for LaTeX pipeline).
        yaml_path: Path to YAML file on disk (required for HTML pipeline).
        output_path: Path where the generated PDF should be written.
        icons_dir: Path to session-specific icons directory.
        session_id: Unique session identifier for temp file naming.
        settings: User settings dict (accent_color, show_page_numbers,
            font, etc.).
    """
    config = get(template_id)  # raises KeyError if invalid
    template_dir = config.dir
    engine = config.engine
    pdf_options = config.pdf_options

    if settings:
        pdf_options = _merge_user_settings(pdf_options, settings)

    if engine is TemplateEngine.latex:
        # Import inside function to avoid circular dependency
        from app import generate_latex_pdf

        generate_latex_pdf(yaml_data, str(icons_dir), str(output_path), template_dir)
    else:
        # Import inside function to avoid circular dependency
        from app import _dispatch_html_pdf_generation

        pdf_options_dict = pdf_options.to_pdfkit_options()
        _dispatch_html_pdf_generation(
            template_dir,
            yaml_path,
            output_path,
            icons_dir,
            session_id,
            pdf_options=pdf_options_dict,
        )


def _merge_user_settings(base_options: PDFOptions, settings: dict) -> PDFOptions:
    """Merge user settings into base PDF options."""
    overrides = {}
    if "show_page_numbers" in settings:
        overrides["show_page_numbers"] = settings["show_page_numbers"]
    if "page_size" in settings:
        overrides["page_size"] = settings["page_size"]
    if overrides:
        return base_options.model_copy(update=overrides)
    return base_options
