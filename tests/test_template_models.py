"""Tests for templates/models.py — Pydantic models for the template framework."""

import pytest
from pydantic import ValidationError

from templates.models import TemplateEngine, PDFOptions, TemplateConfig, TemplateMetadata


# =============================================================================
# PDFOptions
# =============================================================================


class TestPDFOptionsDefaults:
    """Default values for a freshly constructed PDFOptions."""

    def test_default_page_size(self):
        opts = PDFOptions()
        assert opts.page_size == "Letter"

    def test_default_margins_are_none(self):
        opts = PDFOptions()
        assert opts.margin_top is None
        assert opts.margin_bottom is None
        assert opts.margin_left is None
        assert opts.margin_right is None

    def test_default_show_page_numbers_false(self):
        opts = PDFOptions()
        assert opts.show_page_numbers is False

    def test_default_footer_font(self):
        opts = PDFOptions()
        assert opts.footer_font_name == "Arial"
        assert opts.footer_font_size == "9"


class TestPDFOptionsToPdfkitOptions:
    """to_pdfkit_options() output."""

    def test_minimal_defaults(self):
        """With all margins None and page numbers off, only page-size is set."""
        result = PDFOptions().to_pdfkit_options()
        assert result == {"page-size": "Letter"}

    def test_margins_included_when_set(self):
        opts = PDFOptions(
            margin_top="10mm",
            margin_bottom="15mm",
            margin_left="20mm",
            margin_right="25mm",
        )
        result = opts.to_pdfkit_options()
        assert result["margin-top"] == "10mm"
        assert result["margin-bottom"] == "15mm"
        assert result["margin-left"] == "20mm"
        assert result["margin-right"] == "25mm"

    def test_none_margins_omitted(self):
        """Margins that are None must NOT appear in the dict."""
        opts = PDFOptions(margin_top="5mm")  # only top set
        result = opts.to_pdfkit_options()
        assert "margin-top" in result
        assert "margin-bottom" not in result
        assert "margin-left" not in result
        assert "margin-right" not in result

    def test_page_numbers_enabled(self):
        opts = PDFOptions(show_page_numbers=True)
        result = opts.to_pdfkit_options()
        assert result["footer-center"] == "[page]"
        assert result["footer-font-name"] == "Arial"
        assert result["footer-font-size"] == "9"

    def test_page_numbers_disabled(self):
        opts = PDFOptions(show_page_numbers=False)
        result = opts.to_pdfkit_options()
        assert "footer-center" not in result
        assert "footer-font-name" not in result
        assert "footer-font-size" not in result

    def test_custom_page_size(self):
        opts = PDFOptions(page_size="A4")
        result = opts.to_pdfkit_options()
        assert result["page-size"] == "A4"


class TestPDFOptionsToLatexOptions:
    """to_latex_options() output."""

    def test_contains_expected_keys(self):
        result = PDFOptions().to_latex_options()
        expected_keys = {
            "page_size",
            "margin_top",
            "margin_bottom",
            "margin_left",
            "margin_right",
            "show_page_numbers",
        }
        assert set(result.keys()) == expected_keys

    def test_values_match_model(self):
        opts = PDFOptions(page_size="A4", margin_top="1in", show_page_numbers=True)
        result = opts.to_latex_options()
        assert result["page_size"] == "A4"
        assert result["margin_top"] == "1in"
        assert result["show_page_numbers"] is True


# =============================================================================
# TemplateConfig — slug validation
# =============================================================================


class TestTemplateConfigSlugValidation:
    """Slug (id field) must be lowercase alphanumeric + hyphens."""

    @staticmethod
    def _make_config(**overrides):
        """Build a valid TemplateConfig, allowing overrides."""
        defaults = dict(
            id="modern",
            dir="modern",
            engine=TemplateEngine.html,
            sample="samples/modern/john_doe.yml",
            name="Modern",
            description="Test template.",
            preview="modern.png",
        )
        defaults.update(overrides)
        return TemplateConfig(**defaults)

    @pytest.mark.parametrize(
        "slug",
        ["modern", "two-column", "ats-2024", "a", "a1b", "uk-cv"],
    )
    def test_valid_slugs_accepted(self, slug):
        cfg = self._make_config(id=slug)
        assert cfg.id == slug

    @pytest.mark.parametrize(
        "slug",
        [
            "Modern",          # uppercase
            "my_template",     # underscore
            "",                # empty
            "-leading",        # leading hyphen
            "trailing-",       # trailing hyphen
            "has spaces",      # spaces
            "UPPER",           # all uppercase
            "two--hyphens",    # consecutive hyphens
        ],
    )
    def test_invalid_slugs_rejected(self, slug):
        with pytest.raises(ValidationError):
            self._make_config(id=slug)


class TestTemplateConfigDefaults:
    """Default values when optional fields are omitted."""

    def test_tags_default_empty(self):
        cfg = TestTemplateConfigSlugValidation._make_config()
        assert cfg.tags == []

    def test_supports_icons_default_false(self):
        cfg = TestTemplateConfigSlugValidation._make_config()
        assert cfg.supports_icons is False

    def test_pdf_options_default_instance(self):
        cfg = TestTemplateConfigSlugValidation._make_config()
        assert isinstance(cfg.pdf_options, PDFOptions)
        assert cfg.pdf_options.page_size == "Letter"


# =============================================================================
# TemplateMetadata
# =============================================================================


class TestTemplateMetadata:
    """TemplateMetadata defaults."""

    def test_defaults(self):
        meta = TemplateMetadata(
            id="modern",
            name="Modern",
            description="A test",
            image_url="https://example.com/img.png",
        )
        assert meta.tags == []
        assert meta.supports_icons is False

    def test_explicit_values(self):
        meta = TemplateMetadata(
            id="modern",
            name="Modern",
            description="A test",
            image_url="https://example.com/img.png",
            supports_icons=True,
            tags=["fancy"],
        )
        assert meta.supports_icons is True
        assert meta.tags == ["fancy"]
