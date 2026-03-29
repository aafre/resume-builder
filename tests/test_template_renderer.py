"""Tests for templates/renderer.py — PDF generation dispatch layer.

All tests mock the actual PDF generation backends (wkhtmltopdf / xelatex)
so they run without any external dependencies.
"""

import pytest
from unittest.mock import patch, MagicMock

from templates.models import PDFOptions
from templates.renderer import generate_pdf, _merge_user_settings


# =============================================================================
# _merge_user_settings()
# =============================================================================


class TestMergeUserSettings:
    """Merge user-provided settings into a base PDFOptions."""

    def test_show_page_numbers_override(self):
        base = PDFOptions(show_page_numbers=False)
        result = _merge_user_settings(base, {"show_page_numbers": True})
        assert result.show_page_numbers is True

    def test_page_size_override(self):
        base = PDFOptions(page_size="Letter")
        result = _merge_user_settings(base, {"page_size": "A4"})
        assert result.page_size == "A4"

    def test_empty_settings_returns_base_unchanged(self):
        base = PDFOptions(page_size="Letter", show_page_numbers=False)
        result = _merge_user_settings(base, {})
        # With no overrides, the function returns the same object
        assert result is base

    def test_unknown_keys_ignored(self):
        base = PDFOptions()
        result = _merge_user_settings(base, {"font": "Georgia", "accent_color": "#ff0000"})
        # Unknown keys should not cause an error and base is returned as-is
        assert result is base
        assert result.page_size == "Letter"

    def test_returns_new_instance_when_overrides_applied(self):
        base = PDFOptions(page_size="Letter")
        result = _merge_user_settings(base, {"page_size": "A4"})
        assert result is not base
        # Original is not mutated
        assert base.page_size == "Letter"
        assert result.page_size == "A4"

    def test_multiple_overrides(self):
        base = PDFOptions(page_size="Letter", show_page_numbers=False)
        result = _merge_user_settings(base, {"page_size": "A4", "show_page_numbers": True})
        assert result.page_size == "A4"
        assert result.show_page_numbers is True


# =============================================================================
# generate_pdf() — dispatch routing
# =============================================================================


class TestGeneratePDFDispatch:
    """generate_pdf() routes to the correct backend based on engine type."""

    @patch("templates.renderer.get")
    def test_html_template_calls_dispatch_html(self, mock_get):
        """An HTML template (e.g. modern-with-icons) dispatches to _dispatch_html_pdf_generation."""
        from templates.models import TemplateEngine, TemplateConfig

        mock_get.return_value = TemplateConfig(
            id="modern-with-icons",
            dir="modern",
            engine=TemplateEngine.html,
            sample="samples/modern/john_doe.yml",
            name="Modern Resume",
            description="Test",
            preview="modern.png",
        )

        with patch("app._dispatch_html_pdf_generation") as mock_html:
            generate_pdf(
                template_id="modern-with-icons",
                yaml_path="/tmp/data.yml",
                output_path="/tmp/out.pdf",
                icons_dir="/tmp/icons",
                session_id="sess-123",
            )
            mock_html.assert_called_once()
            call_kwargs = mock_html.call_args
            # First positional arg is template_dir
            assert call_kwargs[0][0] == "modern"

    @patch("templates.renderer.get")
    def test_latex_template_calls_generate_latex(self, mock_get):
        """A LaTeX template (e.g. executive) dispatches to generate_latex_pdf."""
        from templates.models import TemplateEngine, TemplateConfig

        mock_get.return_value = TemplateConfig(
            id="executive",
            dir="executive",
            engine=TemplateEngine.latex,
            sample="samples/executive/sample_data.yml",
            name="Executive Resume",
            description="Test",
            preview="executive.png",
        )

        with patch("app.generate_latex_pdf") as mock_latex:
            generate_pdf(
                template_id="executive",
                yaml_data={"contact_info": {"name": "Test"}},
                output_path="/tmp/out.pdf",
                icons_dir="/tmp/icons",
            )
            mock_latex.assert_called_once()

    def test_invalid_template_raises_key_error(self):
        """An unregistered template ID raises KeyError."""
        with pytest.raises(KeyError, match="Available templates:"):
            generate_pdf(template_id="totally-fake-template")

    @patch("templates.renderer.get")
    def test_page_numbers_setting_adds_footer(self, mock_get):
        """When settings include show_page_numbers=True, the pdfkit options
        dict passed to _dispatch_html_pdf_generation must contain 'footer-center'."""
        from templates.models import TemplateEngine, TemplateConfig

        mock_get.return_value = TemplateConfig(
            id="modern-with-icons",
            dir="modern",
            engine=TemplateEngine.html,
            sample="samples/modern/john_doe.yml",
            name="Modern Resume",
            description="Test",
            preview="modern.png",
        )

        with patch("app._dispatch_html_pdf_generation") as mock_html:
            generate_pdf(
                template_id="modern-with-icons",
                yaml_path="/tmp/data.yml",
                output_path="/tmp/out.pdf",
                icons_dir="/tmp/icons",
                session_id="sess-123",
                settings={"show_page_numbers": True},
            )
            mock_html.assert_called_once()
            # pdf_options is passed as a keyword argument
            call_args = mock_html.call_args
            # It's the last keyword or positional arg — find it
            pdf_options_dict = call_args.kwargs.get("pdf_options") or call_args[1].get("pdf_options")
            assert pdf_options_dict is not None
            assert "footer-center" in pdf_options_dict
            assert pdf_options_dict["footer-center"] == "[page]"

    @patch("templates.renderer.get")
    def test_uk_cv_gets_a4_page_size(self, mock_get):
        """UK CV template should pass page-size=A4 in the pdfkit options."""
        from templates.models import TemplateEngine, TemplateConfig

        mock_get.return_value = TemplateConfig(
            id="uk-cv",
            dir="uk-cv",
            engine=TemplateEngine.html,
            sample="samples/uk-cv/sample_data.yml",
            name="UK CV",
            description="Test",
            preview="uk-cv.png",
            pdf_options=PDFOptions(page_size="A4"),
        )

        with patch("app._dispatch_html_pdf_generation") as mock_html:
            generate_pdf(
                template_id="uk-cv",
                yaml_path="/tmp/data.yml",
                output_path="/tmp/out.pdf",
                icons_dir="/tmp/icons",
                session_id="sess-123",
            )
            mock_html.assert_called_once()
            call_args = mock_html.call_args
            pdf_options_dict = call_args.kwargs.get("pdf_options") or call_args[1].get("pdf_options")
            assert pdf_options_dict["page-size"] == "A4"
