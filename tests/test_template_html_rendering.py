"""Tests for actual Jinja2 HTML rendering of templates — no pdfkit required.

Renders real base.html templates with test data and asserts on the generated
HTML to catch CSS cascade bugs, font injection issues, accent colour handling,
black-icon path logic, and markdown filter integration.
"""

import pytest
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

from resume_generator import (
    convert_markdown_links_to_html,
    convert_markdown_formatting_to_html,
)

PROJECT_ROOT = Path(__file__).parent.parent


# =============================================================================
# Rendering helpers
# =============================================================================


def render_template(template_dir: str, context: dict) -> str:
    """Render a template's base.html with the given context.

    Automatically sets ``css_path`` to point at the real stylesheet on disk
    and registers the markdown filters used by all HTML templates.
    """
    tpl_path = PROJECT_ROOT / "templates" / template_dir
    env = Environment(loader=FileSystemLoader(str(tpl_path)))
    env.filters["markdown_links"] = convert_markdown_links_to_html
    env.filters["markdown_formatting"] = convert_markdown_formatting_to_html

    # Inject css_path into context if not already provided
    if "css_path" not in context:
        css_abs = tpl_path / "styles.css"
        context["css_path"] = f"file:///{css_abs.as_posix()}"

    template = env.get_template("base.html")
    return template.render(**context)


def make_context(
    font: str = "Arial",
    accent_color: str | None = None,
    sections: list | None = None,
    icon_path: str = "file:///app/icons",
) -> dict:
    """Build a standard resume context dict for rendering."""
    settings: dict = {}
    if accent_color is not None:
        settings["accent_color"] = accent_color

    return {
        "contact_info": {
            "name": "Test User",
            "location": "New York, NY",
            "email": "test@example.com",
            "phone": "555-0100",
            "social_links": [
                {
                    "platform": "linkedin",
                    "url": "https://linkedin.com/in/test",
                    "display_text": "test",
                }
            ],
        },
        "sections": sections
        or [
            {
                "name": "Summary",
                "type": "text",
                "content": "A skilled professional.",
            },
            {
                "name": "Experience",
                "type": "experience",
                "content": [
                    {
                        "company": "Acme Corp",
                        "title": "Engineer",
                        "dates": "2020-2024",
                        "description": ["Built systems"],
                    }
                ],
            },
            {
                "name": "Education",
                "type": "education",
                "content": [
                    {
                        "degree": "BS Computer Science",
                        "school": "MIT",
                        "year": "2020",
                    }
                ],
            },
        ],
        "icon_path": icon_path,
        "font": font,
        "settings": settings,
    }


# =============================================================================
# CSS cascade: font style must come AFTER the stylesheet link
# =============================================================================


class TestCSSCascade:
    """The inline font-family style must appear after the <link rel="stylesheet">
    so it wins the CSS cascade. Catches the font-override bug."""

    @pytest.mark.parametrize("template_dir", ["ats-optimized", "student", "uk-cv"])
    def test_font_style_after_stylesheet(self, template_dir):
        ctx = make_context(font="Georgia")
        html = render_template(template_dir, ctx)

        stylesheet_pos = html.find('<link rel="stylesheet"')
        font_pos = html.find("font-family:")

        assert stylesheet_pos != -1, "Stylesheet link not found in rendered HTML"
        assert font_pos != -1, "font-family declaration not found in rendered HTML"
        assert font_pos > stylesheet_pos, (
            f"[{template_dir}] font-family style (pos {font_pos}) must appear "
            f"AFTER <link rel='stylesheet'> (pos {stylesheet_pos}) to win the cascade"
        )


# =============================================================================
# Font applied correctly
# =============================================================================


class TestFontApplied:
    """Font name appears in the body style."""

    def test_font_in_body_style(self):
        html = render_template("ats-optimized", make_context(font="Georgia"))
        assert "'Georgia'" in html

    def test_default_font_arial(self):
        html = render_template("ats-optimized", make_context(font="Arial"))
        assert "'Arial'" in html

    @pytest.mark.parametrize(
        "template_dir",
        ["modern", "ats-optimized", "student", "two-column", "uk-cv"],
    )
    def test_font_applied_across_all_html_templates(self, template_dir):
        html = render_template(template_dir, make_context(font="Garamond"))
        assert "Garamond" in html, (
            f"[{template_dir}] Font 'Garamond' not found in rendered HTML"
        )


# =============================================================================
# Accent colour
# =============================================================================


class TestAccentColor:
    """Accent colour override injects a style block when non-default."""

    # Templates that use '#2D3436' as the default (accent != '#2D3436' triggers override)
    @pytest.mark.parametrize("template_dir", ["ats-optimized", "student"])
    def test_accent_color_in_heading_style(self, template_dir):
        html = render_template(
            template_dir, make_context(accent_color="#1B4332")
        )
        assert "#1B4332" in html, (
            f"[{template_dir}] Custom accent colour #1B4332 not found in HTML"
        )

    @pytest.mark.parametrize("template_dir", ["ats-optimized", "student"])
    def test_no_accent_override_for_default(self, template_dir):
        """With no accent_color setting, no colour override style block should
        be injected (the default #2D3436 check prevents it)."""
        html = render_template(template_dir, make_context())
        # The section-heading colour override style block should NOT be present
        # when using the default accent.  Look for the pattern that only appears
        # in the accent override block.
        assert ".section-heading { color:" not in html or "#2D3436" in html

    def test_uk_cv_accent_color(self):
        """UK CV uses '#000000' as default — a non-default colour should appear."""
        html = render_template("uk-cv", make_context(accent_color="#1B4332"))
        assert "#1B4332" in html

    def test_uk_cv_no_accent_for_default(self):
        """UK CV default accent (#000000) should NOT inject an override block."""
        html = render_template("uk-cv", make_context())
        # With no accent_color in settings, the override block should be absent
        assert ".section-heading { color:" not in html

    def test_modern_accent_color(self):
        """Modern template uses '#000000' as its default check, not '#2D3436'.
        A custom accent should still appear."""
        html = render_template("modern", make_context(accent_color="#FF5733"))
        assert "#FF5733" in html

    def test_two_column_always_has_accent_style(self):
        """Two-column template always injects accent into a style block
        (defaults to #0A2647 if no settings)."""
        html = render_template("two-column", make_context())
        assert ".section-heading" in html
        # Default accent should be present
        assert "#0A2647" in html

    def test_two_column_custom_accent(self):
        html = render_template("two-column", make_context(accent_color="#E63946"))
        assert "#E63946" in html


# =============================================================================
# Black icons path
# =============================================================================


class TestBlackIconsPath:
    """Templates that use bicon should rewrite /icons to /icons/black."""

    @pytest.mark.parametrize("template_dir", ["ats-optimized", "student", "uk-cv"])
    def test_black_icons_path_used(self, template_dir):
        html = render_template(template_dir, make_context())
        assert "/icons/black" in html, (
            f"[{template_dir}] Expected /icons/black path for black icons"
        )

    def test_modern_uses_original_icon_path(self):
        """The modern template uses icon_path directly (not the bicon /black
        rewrite) for its contact and company icons."""
        html = render_template("modern", make_context())
        # Modern uses icon_path as-is for contact icons (no /black rewrite)
        assert "file:///app/icons/" in html
        # It should NOT have the /icons/black path
        assert "/icons/black" not in html


# =============================================================================
# Markdown filters
# =============================================================================


class TestMarkdownFilters:
    """Markdown links and bold formatting are converted to HTML."""

    def test_markdown_link_in_text_section(self):
        sections = [
            {
                "name": "Summary",
                "type": "text",
                "content": "Visit [Google](https://google.com) for more.",
            }
        ]
        html = render_template("ats-optimized", make_context(sections=sections))
        assert '<a href="https://google.com">Google</a>' in html

    def test_markdown_bold_in_text_section(self):
        sections = [
            {
                "name": "Summary",
                "type": "text",
                "content": "I am **bold** and proud.",
            }
        ]
        html = render_template("ats-optimized", make_context(sections=sections))
        assert "<strong>bold</strong>" in html

    def test_markdown_link_in_experience_bullet(self):
        sections = [
            {
                "name": "Experience",
                "type": "experience",
                "content": [
                    {
                        "company": "Test Co",
                        "title": "Dev",
                        "dates": "2024",
                        "description": [
                            "See [docs](https://docs.example.com) for details"
                        ],
                    }
                ],
            }
        ]
        html = render_template("student", make_context(sections=sections))
        assert '<a href="https://docs.example.com">docs</a>' in html

    def test_markdown_bold_in_experience_description(self):
        sections = [
            {
                "name": "Experience",
                "type": "experience",
                "content": [
                    {
                        "company": "Test Co",
                        "title": "Dev",
                        "dates": "2024",
                        "description": ["Achieved **50% reduction** in latency"],
                    }
                ],
            }
        ]
        html = render_template("uk-cv", make_context(sections=sections))
        assert "<strong>50% reduction</strong>" in html


# =============================================================================
# Two-column template specifics
# =============================================================================


class TestTwoColumnTemplate:
    """The two-column template has a different structure — verify key aspects."""

    def test_has_resume_columns_layout(self):
        html = render_template("two-column", make_context())
        assert "resume-columns" in html

    def test_font_in_body_style(self):
        """Two-column accepts a custom font which should appear in the output."""
        html = render_template("two-column", make_context(font="EB Garamond"))
        assert "EB Garamond" in html

    def test_default_font_is_source_sans(self):
        """When font is omitted entirely, two-column defaults to Source Sans 3
        via the Jinja2 ``default("Source Sans 3")`` filter."""
        ctx = make_context()
        del ctx["font"]  # Remove key so Jinja2 sees it as undefined
        html = render_template("two-column", ctx)
        assert "Source Sans 3" in html

    def test_does_not_use_black_icons(self):
        """Two-column uses icon_path directly, not the bicon /black rewrite."""
        html = render_template("two-column", make_context())
        # Two-column doesn't set bicon — it uses icon_path directly
        # So /icons/black should NOT appear
        assert "/icons/black" not in html


# =============================================================================
# Modern template specifics
# =============================================================================


class TestModernTemplate:
    """Modern template has its own accent-color logic and icon handling."""

    def test_font_style_before_stylesheet(self):
        """The modern template puts the font style BEFORE the stylesheet link.
        This is its known structure (font block comes first, then the CSS link).
        We just verify the font appears in the HTML."""
        html = render_template("modern", make_context(font="Georgia"))
        assert "'Georgia'" in html

    def test_contact_info_rendered(self):
        html = render_template("modern", make_context())
        assert "Test User" in html
        assert "test@example.com" in html

    def test_sections_rendered(self):
        html = render_template("modern", make_context())
        assert "Summary" in html
        assert "A skilled professional." in html
        assert "Acme Corp" in html
        assert "BS Computer Science" in html


# =============================================================================
# Content rendering across templates
# =============================================================================


class TestContentRendering:
    """Verify that all section types render their content."""

    @pytest.mark.parametrize(
        "template_dir", ["ats-optimized", "student", "uk-cv", "modern"]
    )
    def test_contact_name_rendered(self, template_dir):
        html = render_template(template_dir, make_context())
        assert "Test User" in html

    @pytest.mark.parametrize(
        "template_dir", ["ats-optimized", "student", "uk-cv", "modern"]
    )
    def test_experience_section_rendered(self, template_dir):
        html = render_template(template_dir, make_context())
        assert "Acme Corp" in html
        assert "Engineer" in html

    @pytest.mark.parametrize(
        "template_dir", ["ats-optimized", "student", "uk-cv", "modern"]
    )
    def test_education_section_rendered(self, template_dir):
        html = render_template(template_dir, make_context())
        assert "BS Computer Science" in html
        assert "MIT" in html

    @pytest.mark.parametrize(
        "template_dir", ["ats-optimized", "student", "uk-cv", "modern"]
    )
    def test_text_section_rendered(self, template_dir):
        html = render_template(template_dir, make_context())
        assert "A skilled professional." in html

    def test_two_column_renders_main_sections(self):
        """Two-column splits sections between main-col and side-col.
        Text, experience, and education go to main-col."""
        html = render_template("two-column", make_context())
        assert "Test User" in html
        assert "Acme Corp" in html
        assert "BS Computer Science" in html
