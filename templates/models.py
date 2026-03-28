"""Pydantic models for the template framework.

Defines the data structures used to configure templates, their PDF
generation options, and the metadata surfaced to the UI.
"""

from __future__ import annotations

import re
from enum import Enum
from typing import Optional

from pydantic import BaseModel, field_validator


class TemplateEngine(str, Enum):
    """Rendering engine used to produce the final PDF."""

    html = "html"
    latex = "latex"


class PDFOptions(BaseModel):
    """PDF generation settings shared across engines.

    For HTML templates these are translated into wkhtmltopdf CLI flags via
    ``to_pdfkit_options()``.  For LaTeX templates the values are injected
    into the template context via ``to_latex_options()``.
    """

    page_size: str = "Letter"
    margin_top: Optional[str] = None
    margin_bottom: Optional[str] = None
    margin_left: Optional[str] = None
    margin_right: Optional[str] = None
    show_page_numbers: bool = False
    footer_font_name: str = "Arial"
    footer_font_size: str = "9"

    def to_pdfkit_options(self) -> dict:
        """Convert to a dict of wkhtmltopdf CLI options.

        Only non-``None`` values are included so that wkhtmltopdf falls back
        to its own defaults for any unset margin.
        """
        opts: dict = {"page-size": self.page_size}

        if self.margin_top is not None:
            opts["margin-top"] = self.margin_top
        if self.margin_bottom is not None:
            opts["margin-bottom"] = self.margin_bottom
        if self.margin_left is not None:
            opts["margin-left"] = self.margin_left
        if self.margin_right is not None:
            opts["margin-right"] = self.margin_right

        if self.show_page_numbers:
            opts["footer-center"] = "[page]"
            opts["footer-font-name"] = self.footer_font_name
            opts["footer-font-size"] = self.footer_font_size

        return opts

    def to_latex_options(self) -> dict:
        """Return a dict suitable for injection into a LaTeX template context."""
        return {
            "page_size": self.page_size,
            "margin_top": self.margin_top,
            "margin_bottom": self.margin_bottom,
            "margin_left": self.margin_left,
            "margin_right": self.margin_right,
            "show_page_numbers": self.show_page_numbers,
        }


class TemplateConfig(BaseModel):
    """Full configuration for a single resume template.

    Attributes:
        id: Unique slug identifier (alphanumeric + hyphens only).
        dir: Directory name under ``templates/``.
        engine: Rendering engine (html or latex).
        sample: Relative path from the project root to the sample YAML file.
        name: Human-readable display name for the UI.
        description: Short description shown in the UI.
        preview: Filename of the preview image in ``docs/templates/``.
        supports_icons: Whether the template can render inline icons.
        pdf_options: PDF generation options for this template.
    """

    id: str
    dir: str
    engine: TemplateEngine
    sample: str
    name: str
    description: str
    preview: str
    supports_icons: bool = False
    pdf_options: PDFOptions = PDFOptions()

    @field_validator("id")
    @classmethod
    def _validate_slug(cls, value: str) -> str:
        """Ensure the id uses slug format: lowercase alphanumeric + hyphens."""
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
            raise ValueError(
                f"Template id must be lowercase alphanumeric with hyphens "
                f"(e.g. 'modern', 'two-column'), got: {value!r}"
            )
        return value


class TemplateMetadata(BaseModel):
    """Lightweight template info returned to the frontend.

    This is the public-facing subset of ``TemplateConfig`` used by the
    ``/api/templates`` endpoint.
    """

    id: str
    name: str
    description: str
    image_url: str
    supports_icons: bool = False
