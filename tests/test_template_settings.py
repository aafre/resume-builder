"""Tests for template + document settings (font, accent color) validation.

Two-tier approach:
  Tier 1 — Jinja2 rendering (fast, no PDF toolchain needed):
           Exhaustive font/color injection checks across all templates.
  Tier 2 — PDF generation + validation (needs wkhtmltopdf + pdfplumber):
           Pairwise matrix verifying fonts, colors, and text in actual PDFs.

Run examples:
    pytest tests/test_template_settings.py -v                     # all tiers
    pytest tests/test_template_settings.py -v -k "not Pdf"        # Tier 1 only
    pytest tests/test_template_settings.py -v -m requires_pdfkit  # Tier 2 only
"""

import copy
import os
import subprocess
import sys
import tempfile
import shutil
from pathlib import Path

import pytest
import yaml

# ---------------------------------------------------------------------------
# Path setup
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from jinja2 import Environment, FileSystemLoader

from resume_generator import (
    convert_markdown_links_to_html,
    convert_markdown_formatting_to_html,
)
from resume_generator_latex import (
    convert_markdown_links_to_latex,
    convert_markdown_formatting_to_latex,
)

# ---------------------------------------------------------------------------
# Availability checks
# ---------------------------------------------------------------------------


def _is_pdfkit_available():
    try:
        import pdfkit
        pdfkit.configuration()
        return True
    except Exception:
        return False


def _is_xelatex_available():
    try:
        result = subprocess.run(
            ["xelatex", "--version"], capture_output=True, timeout=10,
        )
        return result.returncode == 0
    except Exception:
        return False


def _is_pdfplumber_available():
    try:
        import pdfplumber  # noqa: F401
        return True
    except ImportError:
        return False


PDFKIT_AVAILABLE = _is_pdfkit_available()
XELATEX_AVAILABLE = _is_xelatex_available()
PDFPLUMBER_AVAILABLE = _is_pdfplumber_available()

requires_pdfkit = pytest.mark.skipif(
    not PDFKIT_AVAILABLE, reason="pdfkit or wkhtmltopdf not installed"
)
requires_xelatex = pytest.mark.skipif(
    not XELATEX_AVAILABLE, reason="xelatex/texlive not installed"
)

# ---------------------------------------------------------------------------
# Constants — all user-facing fonts, colors, templates
# ---------------------------------------------------------------------------

ALL_FONTS = [
    "Source Sans 3",
    "IBM Plex Sans",
    "DM Sans",
    "Plus Jakarta Sans",
    "EB Garamond",
    "Source Serif 4",
    "Crimson Pro",
    "Newsreader",
    "Playfair Display",
    "Arial",
    "Calibri",
    "Cambria",
    "Georgia",
    "Tahoma",
    "Times New Roman",
]

ALL_ACCENT_COLORS = [
    "#2D3436",  # Graphite
    "#0A2647",  # Midnight Ink
    "#1B4332",  # Racing Green
    "#4A0E0E",  # Oxblood
    "#2C3639",  # Dark Petrol
    "#3C1874",  # Aubergine
    "#1A3636",  # Juniper
    "#4A3728",  # Espresso
    "#1B2838",  # Steel Blue
    "#000000",  # True Black
]

# HTML templates: template_dir names under templates/
HTML_TEMPLATE_DIRS = ["modern", "ats-optimized", "student", "two-column", "uk-cv"]

# LaTeX templates: template_dir names under templates/
LATEX_TEMPLATE_DIRS = ["classic", "executive"]

# Liberation font fallback mapping (system fonts -> Linux fallback)
LIBERATION_MAP = {
    "Arial": "LiberationSans",
    "Helvetica": "LiberationSans",
    "Calibri": "LiberationSans",
    "Tahoma": "LiberationSans",
    "Verdana": "LiberationSans",
    "Trebuchet MS": "LiberationSans",
    "Times New Roman": "LiberationSerif",
    "Georgia": "LiberationSerif",
    "Cambria": "LiberationSerif",
}

# Accent color default-check logic per template (which value triggers "no override")
# modern/uk-cv: suppress override when accent == '#000000'
# ats-optimized/student: suppress override when accent == '#2D3436'
# two-column: always injects accent (defaults to #0A2647 if no setting)
ACCENT_DEFAULTS = {
    "modern": "#000000",
    "uk-cv": "#000000",
    "ats-optimized": "#2D3436",
    "student": "#2D3436",
    "two-column": None,  # Always injects — no suppression value
}

# Pairwise PDF smoke test matrix: (template_dir, font, accent_color)
# 3 combos per HTML template (default, sans-serif+color, serif+color) = 15
# 3 combos per LaTeX template dir = 6 (requires xelatex)
HTML_PDF_MATRIX = [
    # modern (covers modern-with-icons and modern-no-icons — same dir)
    ("modern", "Arial", None),
    ("modern", "IBM Plex Sans", "#1B4332"),
    ("modern", "EB Garamond", "#3C1874"),
    # ats-optimized
    ("ats-optimized", "Arial", None),
    ("ats-optimized", "DM Sans", "#4A0E0E"),
    ("ats-optimized", "Crimson Pro", "#0A2647"),
    # student
    ("student", "Arial", None),
    ("student", "Plus Jakarta Sans", "#2C3639"),
    ("student", "Source Serif 4", "#1A3636"),
    # two-column
    ("two-column", "Arial", None),
    ("two-column", "Source Sans 3", "#4A3728"),
    ("two-column", "Newsreader", "#1B2838"),
    # uk-cv
    ("uk-cv", "Arial", None),
    ("uk-cv", "Calibri", "#2D3436"),
    ("uk-cv", "Georgia", "#4A0E0E"),
]

LATEX_PDF_MATRIX = [
    ("classic", "Arial", None),
    ("classic", "EB Garamond", "#1B4332"),
    ("classic", "Source Sans 3", "#3C1874"),
    ("executive", "Arial", None),
    ("executive", "Crimson Pro", "#0A2647"),
    ("executive", "Playfair Display", "#4A0E0E"),
]

# ---------------------------------------------------------------------------
# Minimal resume data for tests
# ---------------------------------------------------------------------------

MINIMAL_RESUME_DATA = {
    "contact_info": {
        "name": "Test User",
        "location": "New York, NY",
        "email": "test@example.com",
        "phone": "555-0100",
        "social_links": [
            {
                "platform": "linkedin",
                "url": "https://linkedin.com/in/testuser",
                "display_text": "Test User",
            }
        ],
    },
    "sections": [
        {
            "name": "Summary",
            "type": "text",
            "content": "A skilled professional with years of experience.",
        },
        {
            "name": "Skills",
            "type": "bulleted-list",
            "content": ["Python", "JavaScript", "SQL"],
        },
        {
            "name": "Experience",
            "type": "experience",
            "content": [
                {
                    "company": "Acme Corp",
                    "title": "Senior Engineer",
                    "dates": "2020 - 2024",
                    "description": [
                        "Built systems serving millions of users",
                        "Led team of five engineers",
                    ],
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
}


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def temp_dir():
    """Create a temporary directory, cleaned up after test."""
    d = tempfile.mkdtemp()
    yield Path(d)
    shutil.rmtree(d, ignore_errors=True)


# ---------------------------------------------------------------------------
# Tier 1 helpers — Jinja2 rendering (no PDF generation)
# ---------------------------------------------------------------------------

# Cache Jinja2 environments per template_dir to avoid recreating them
# for every parametrized test case (~200 calls).
_html_env_cache: dict[str, Environment] = {}
_latex_env_cache: dict[str, Environment] = {}


def _get_html_env(template_dir: str) -> Environment:
    """Return a cached Jinja2 Environment for the given HTML template dir."""
    if template_dir not in _html_env_cache:
        tpl_path = PROJECT_ROOT / "templates" / template_dir
        env = Environment(loader=FileSystemLoader(str(tpl_path)))
        env.filters["markdown_links"] = convert_markdown_links_to_html
        env.filters["markdown_formatting"] = convert_markdown_formatting_to_html
        _html_env_cache[template_dir] = env
    return _html_env_cache[template_dir]


def _get_latex_env(template_dir: str) -> Environment:
    """Return a cached Jinja2 Environment for the given LaTeX template dir."""
    if template_dir not in _latex_env_cache:
        tpl_path = PROJECT_ROOT / "templates" / template_dir
        env = Environment(
            loader=FileSystemLoader(str(tpl_path)),
            block_start_string="\\BLOCK{",
            block_end_string="}",
            variable_start_string="\\VAR{",
            variable_end_string="}",
            comment_start_string="\\#{",
            comment_end_string="}",
            line_statement_prefix="%%",
            line_comment_prefix="%#",
            trim_blocks=True,
            autoescape=False,
        )
        env.filters["markdown_links"] = convert_markdown_links_to_latex
        env.filters["markdown_formatting"] = convert_markdown_formatting_to_latex
        _latex_env_cache[template_dir] = env
    return _latex_env_cache[template_dir]


def _render_html(template_dir: str, font: str, accent_color: str | None = None) -> str:
    """Render an HTML template to string using Jinja2 directly."""
    tpl_path = PROJECT_ROOT / "templates" / template_dir
    env = _get_html_env(template_dir)

    css_abs = tpl_path / "styles.css"
    settings = {}
    if accent_color is not None:
        settings["accent_color"] = accent_color

    context = {
        "contact_info": MINIMAL_RESUME_DATA["contact_info"],
        "sections": MINIMAL_RESUME_DATA["sections"],
        "icon_path": "file:///app/icons",
        "css_path": f"file:///{css_abs.as_posix()}",
        "font": font,
        "settings": settings,
    }

    template = env.get_template("base.html")
    return template.render(**context)


def _render_latex(template_dir: str, font: str, accent_color: str | None = None) -> str:
    """Render a LaTeX template to .tex string using Jinja2 directly.

    Avoids importing app.py (which triggers Flask init) by handling LaTeX
    escaping inline. Test data uses safe ASCII strings so full escaping
    is not needed.
    """
    env = _get_latex_env(template_dir)

    # Build data dict matching what generate_latex_pdf() provides.
    # Test data intentionally uses plain ASCII (no LaTeX special chars)
    # so we skip app._prepare_latex_data() to avoid importing app.py
    # and triggering Flask/Supabase initialization side effects.
    data = copy.deepcopy(MINIMAL_RESUME_DATA)
    settings = {}
    if font:
        settings["font_family"] = font
    if accent_color is not None:
        settings["accent_color"] = accent_color
    data["settings"] = settings

    template = env.get_template("resume.tex")
    return template.render(**data)


# ---------------------------------------------------------------------------
# Tier 2 helpers — PDF generation + validation
# ---------------------------------------------------------------------------


def _make_test_yaml(
    temp_dir: Path,
    font: str | None = None,
    accent_color: str | None = None,
    template_name: str = "modern",
) -> Path:
    """Create a temporary YAML file with document settings embedded."""
    data = copy.deepcopy(MINIMAL_RESUME_DATA)
    settings = {}
    if font:
        settings["font_family"] = font
    if accent_color:
        settings["accent_color"] = accent_color
    if settings:
        data["settings"] = settings

    yaml_path = temp_dir / f"test_{template_name}.yml"
    with open(yaml_path, "w") as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)
    return yaml_path


def _generate_html_pdf(
    template_dir: str,
    yaml_path: Path,
    output_path: Path,
    session_dir: Path,
) -> dict:
    """Generate a PDF using the HTML pipeline (wkhtmltopdf)."""
    import app as flask_app

    return flask_app.pdf_generation_worker(
        template_name=template_dir,
        yaml_path=str(yaml_path),
        output_path=str(output_path),
        session_icons_dir=str(session_dir),
        session_id="test-settings",
    )


def _extract_pdf_fonts(pdf_path: Path) -> set[str]:
    """Extract unique font names from a PDF using pdfplumber.

    Returns a set of base font names with subset prefixes and style
    suffixes stripped (e.g., 'AAAAAA+EBGaramond-Regular' -> 'EBGaramond').
    """
    import pdfplumber

    fonts = set()
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            for char in page.chars:
                raw = char.get("fontname", "")
                if not raw:
                    continue
                # Strip subset prefix (e.g., "AAAAAA+")
                clean = raw.split("+", 1)[-1] if "+" in raw else raw
                # Strip style suffix (e.g., "-Regular", "-Bold", "-Italic")
                base = clean.split("-")[0]
                fonts.add(base)
    return fonts


def _extract_pdf_text(pdf_path: Path) -> str:
    """Extract text content from a PDF using pdfplumber."""
    import pdfplumber

    text_parts = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
    return "\n".join(text_parts)


def _text_in_pdf(needle: str, pdf_text: str) -> bool:
    """Check if text appears in PDF output, handling bold-doubling artifact.

    wkhtmltopdf renders bold text by overlaying two copies of each glyph.
    pdfplumber extracts both, producing doubled characters like 'AAccmmee'
    instead of 'Acme'. This helper checks for both the normal and doubled
    versions.
    """
    if needle in pdf_text:
        return True
    # Try doubled version: each alpha char becomes two copies
    doubled = "".join(c + c if c.isalpha() else c for c in needle)
    return doubled in pdf_text


def _hex_to_rgb_tuple(hex_color: str) -> tuple[float, float, float]:
    """Convert '#1B4332' to (0.106, 0.263, 0.196) float tuple."""
    h = hex_color.lstrip("#")
    return tuple(round(int(h[i : i + 2], 16) / 255.0, 3) for i in (0, 2, 4))


def _extract_pdf_colors(pdf_path: Path) -> set[tuple]:
    """Extract unique non-stroking (fill) colors from text in a PDF.

    Returns a set of RGB float tuples rounded to 2 decimal places.
    """
    import pdfplumber

    colors = set()
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            for char in page.chars:
                color = char.get("non_stroking_color")
                if color and isinstance(color, (list, tuple)):
                    if len(color) == 3:
                        # RGB — round to 2 decimals for matching tolerance
                        colors.add(tuple(round(c, 2) for c in color))
                    elif len(color) == 4:
                        # CMYK — convert to RGB
                        c_val, m, y, k = color
                        r = (1 - c_val) * (1 - k)
                        g = (1 - m) * (1 - k)
                        b = (1 - y) * (1 - k)
                        colors.add((round(r, 2), round(g, 2), round(b, 2)))
            # Also check lines and rects for divider colors
            for obj in page.lines + page.rects:
                for key in ("stroking_color", "fill"):
                    color = obj.get(key)
                    if color and isinstance(color, (list, tuple)) and len(color) == 3:
                        colors.add(tuple(round(c, 2) for c in color))
    return colors


def _font_name_matches(requested_font: str, pdf_fonts: set[str]) -> bool:
    """Check if any extracted PDF font matches the requested font.

    Handles:
      - Space removal (e.g., 'EB Garamond' -> 'EBGaramond')
      - Liberation fallback (e.g., 'Arial' -> 'LiberationSans' on Linux)
    """
    # Normalized requested font (remove spaces)
    normalized = requested_font.replace(" ", "")

    for pdf_font in pdf_fonts:
        if normalized.lower() in pdf_font.lower():
            return True

    # Check Liberation fallback
    liberation = LIBERATION_MAP.get(requested_font)
    if liberation:
        for pdf_font in pdf_fonts:
            if liberation.lower() in pdf_font.lower():
                return True

    return False


def _color_present_in_pdf(hex_color: str, pdf_colors: set[tuple]) -> bool:
    """Check if a hex accent color appears in the PDF's extracted colors.

    Uses tolerance of 0.02 per channel for rounding differences.
    """
    expected = _hex_to_rgb_tuple(hex_color)
    tolerance = 0.02
    for color in pdf_colors:
        if len(color) >= 3 and all(
            abs(color[i] - expected[i]) <= tolerance for i in range(3)
        ):
            return True
    return False


# =============================================================================
# TIER 1: Jinja2 Rendering Checks (fast, no PDF toolchain)
# =============================================================================


class TestHTMLFontRendering:
    """Verify every font name appears in the rendered HTML for all HTML templates."""

    @pytest.mark.parametrize("template_dir", HTML_TEMPLATE_DIRS)
    @pytest.mark.parametrize("font", ALL_FONTS)
    def test_font_in_html(self, template_dir, font):
        html = _render_html(template_dir, font=font)
        assert f"'{font}'" in html, (
            f"[{template_dir}] Font '{font}' not found in rendered HTML. "
            f"Expected font-family: '{font}' in a <style> block."
        )


class TestHTMLAccentColorRendering:
    """Verify accent colors are injected into rendered HTML."""

    @pytest.mark.parametrize("template_dir", HTML_TEMPLATE_DIRS)
    @pytest.mark.parametrize("accent_color", ALL_ACCENT_COLORS)
    def test_accent_color_in_html(self, template_dir, accent_color):
        html = _render_html(template_dir, font="Arial", accent_color=accent_color)

        suppress_value = ACCENT_DEFAULTS.get(template_dir)
        if suppress_value and accent_color == suppress_value:
            # Template suppresses the override for this default value.
            # Just verify the page renders without error (no assertion on color).
            assert "<html" in html
            return

        # For all non-suppressed values, the color should appear in the HTML
        assert accent_color in html, (
            f"[{template_dir}] Accent color {accent_color} not found in rendered HTML"
        )


class TestLatexAccentColorRendering:
    """Verify accent colors appear in rendered .tex files."""

    @pytest.mark.parametrize("template_dir", LATEX_TEMPLATE_DIRS)
    @pytest.mark.parametrize("accent_color", [c for c in ALL_ACCENT_COLORS if c != "#000000"])
    def test_accent_color_in_tex(self, template_dir, accent_color):
        tex = _render_latex(template_dir, font="Arial", accent_color=accent_color)
        hex_no_hash = accent_color.lstrip("#")
        assert hex_no_hash in tex, (
            f"[{template_dir}] Accent color {accent_color} not found in rendered .tex"
        )

    @pytest.mark.parametrize("template_dir", LATEX_TEMPLATE_DIRS)
    def test_default_accent_when_black(self, template_dir):
        """When accent is #000000, LaTeX templates use their own default."""
        tex = _render_latex(template_dir, font="Arial", accent_color="#000000")
        # classic defaults to 000000, executive defaults to 1F2937
        assert "definecolor{accent}" in tex


class TestLatexFontRendering:
    r"""Verify LaTeX templates inject \setmainfont from settings.font_family.

    KNOWN BUG: classic/resume.tex has no \setmainfont at all.
    executive/resume.tex hardcodes \setmainfont{EB Garamond}.
    These tests are xfail until the bug is fixed.
    """

    # All combos except executive+EB Garamond which passes by coincidence
    # (executive hardcodes that font, not because it reads settings)
    _XFAIL_PARAMS = [
        (td, f)
        for td in LATEX_TEMPLATE_DIRS
        for f in ALL_FONTS
        if not (td == "executive" and f == "EB Garamond")
    ]

    @pytest.mark.xfail(
        reason=(
            "Known bug: LaTeX templates do not apply settings.font_family. "
            "classic/resume.tex has no \\setmainfont; "
            "executive/resume.tex hardcodes EB Garamond."
        ),
        strict=True,
    )
    @pytest.mark.parametrize("template_dir,font", _XFAIL_PARAMS)
    def test_font_in_tex(self, template_dir, font):
        tex = _render_latex(template_dir, font=font, accent_color="#000000")
        assert f"setmainfont{{{font}}}" in tex, (
            f"[{template_dir}] FONT BUG: \\setmainfont{{{font}}} not found in "
            f"rendered .tex — template is ignoring settings.font_family"
        )

    def test_executive_hardcodes_eb_garamond(self):
        """Executive template hardcodes EB Garamond and ignores font_family."""
        tex = _render_latex("executive", font="Arial", accent_color="#000000")
        assert "setmainfont{EB Garamond}" in tex, (
            "Executive template should have EB Garamond hardcoded"
        )
        assert "setmainfont{Arial}" not in tex, (
            "Executive template should NOT apply the requested font (known bug)"
        )


# =============================================================================
# TIER 2: PDF Generation + Validation (requires pdfkit + pdfplumber)
# =============================================================================


class TestPdfGenerationSmoke:
    """Generate PDFs for a pairwise matrix and validate at the PDF level.

    For each combo, verifies:
      1. PDF generated successfully (valid header, minimum size)
      2. PDF contains expected text content
      3. Requested font is embedded in the PDF
      4. Accent color (when set) appears in the PDF
    """

    @requires_pdfkit
    @pytest.mark.parametrize(
        "template_dir,font,accent_color",
        HTML_PDF_MATRIX,
        ids=[
            f"{t}-{f.replace(' ', '')}-{c or 'default'}"
            for t, f, c in HTML_PDF_MATRIX
        ],
    )
    def test_html_pdf(self, template_dir, font, accent_color, temp_dir):
        # --- Generate PDF ---
        yaml_path = _make_test_yaml(
            temp_dir, font=font, accent_color=accent_color,
            template_name=template_dir,
        )
        output_path = temp_dir / f"{template_dir}.pdf"
        session_dir = temp_dir / "icons"
        session_dir.mkdir()

        result = _generate_html_pdf(template_dir, yaml_path, output_path, session_dir)

        # 1. PDF generated successfully
        assert result.get("success") is True, (
            f"PDF generation failed for {template_dir}: {result.get('error')}"
        )
        assert output_path.exists(), "PDF file was not created"
        assert output_path.stat().st_size > 5000, (
            f"PDF too small ({output_path.stat().st_size} bytes) — likely corrupt"
        )

        # Verify valid PDF header
        with open(output_path, "rb") as f:
            header = f.read(5)
        assert header == b"%PDF-", "Invalid PDF header"

        # 2. PDF contains expected text
        if PDFPLUMBER_AVAILABLE:
            text = _extract_pdf_text(output_path)
            assert _text_in_pdf("Test User", text), (
                f"[{template_dir}] Contact name 'Test User' not found in PDF text"
            )
            assert _text_in_pdf("Acme Corp", text), (
                f"[{template_dir}] Company 'Acme Corp' not found in PDF text"
            )

            # 3. Font is embedded correctly
            pdf_fonts = _extract_pdf_fonts(output_path)
            assert len(pdf_fonts) > 0, (
                f"[{template_dir}] No fonts found in PDF"
            )
            assert _font_name_matches(font, pdf_fonts), (
                f"[{template_dir}] Requested font '{font}' not found in PDF. "
                f"PDF fonts: {pdf_fonts}"
            )

            # 4. Accent color is present (skip for default/None)
            if accent_color and accent_color != "#000000":
                pdf_colors = _extract_pdf_colors(output_path)
                assert _color_present_in_pdf(accent_color, pdf_colors), (
                    f"[{template_dir}] Accent color {accent_color} not found in PDF. "
                    f"PDF colors: {pdf_colors}"
                )

    @requires_pdfkit
    @requires_xelatex
    @pytest.mark.xfail(
        reason="Known bug: LaTeX templates ignore font_family setting",
        strict=True,
    )
    @pytest.mark.parametrize(
        "template_dir,font,accent_color",
        LATEX_PDF_MATRIX,
        ids=[
            f"{t}-{f.replace(' ', '')}-{c or 'default'}"
            for t, f, c in LATEX_PDF_MATRIX
        ],
    )
    def test_latex_pdf_font(self, template_dir, font, accent_color, temp_dir):
        """LaTeX PDF font validation — xfail until font bug is fixed."""
        yaml_path = _make_test_yaml(
            temp_dir, font=font, accent_color=accent_color,
            template_name=template_dir,
        )
        output_path = temp_dir / f"{template_dir}.pdf"
        session_dir = temp_dir / "icons"
        session_dir.mkdir()

        # LaTeX uses generate_latex_pdf directly, not pdf_generation_worker
        import app as flask_app

        data = yaml.safe_load(open(yaml_path))
        flask_app.generate_latex_pdf(
            data, str(session_dir), str(output_path), template_dir,
        )

        assert output_path.exists(), "LaTeX PDF was not created"
        assert output_path.stat().st_size > 5000

        if PDFPLUMBER_AVAILABLE:
            pdf_fonts = _extract_pdf_fonts(output_path)
            assert _font_name_matches(font, pdf_fonts), (
                f"[{template_dir}] Requested font '{font}' not found in PDF. "
                f"PDF fonts: {pdf_fonts}"
            )

    @requires_pdfkit
    @requires_xelatex
    @pytest.mark.parametrize(
        "template_dir,font,accent_color",
        [row for row in LATEX_PDF_MATRIX if row[2] is not None],
        ids=[
            f"{t}-accent-{c}"
            for t, f, c in LATEX_PDF_MATRIX
            if c is not None
        ],
    )
    def test_latex_pdf_accent_color(self, template_dir, font, accent_color, temp_dir):
        """LaTeX PDF accent color validation (separate from font xfail)."""
        yaml_path = _make_test_yaml(
            temp_dir, font=font, accent_color=accent_color,
            template_name=template_dir,
        )
        output_path = temp_dir / f"{template_dir}.pdf"
        session_dir = temp_dir / "icons"
        session_dir.mkdir()

        import app as flask_app

        data = yaml.safe_load(open(yaml_path))
        flask_app.generate_latex_pdf(
            data, str(session_dir), str(output_path), template_dir,
        )

        assert output_path.exists()
        assert output_path.stat().st_size > 5000

        if PDFPLUMBER_AVAILABLE:
            text = _extract_pdf_text(output_path)
            assert _text_in_pdf("Test User", text)

            pdf_colors = _extract_pdf_colors(output_path)
            assert _color_present_in_pdf(accent_color, pdf_colors), (
                f"[{template_dir}] Accent color {accent_color} not found in PDF. "
                f"PDF colors: {pdf_colors}"
            )


# =============================================================================
# Tier 2: Regression — default settings still produce valid PDFs
# =============================================================================


class TestPdfDefaultSettings:
    """Every HTML template produces a valid PDF with no custom settings."""

    @requires_pdfkit
    @pytest.mark.parametrize("template_dir", HTML_TEMPLATE_DIRS)
    def test_default_settings_produce_valid_pdf(self, template_dir, temp_dir):
        yaml_path = _make_test_yaml(temp_dir, template_name=template_dir)
        output_path = temp_dir / f"{template_dir}_default.pdf"
        session_dir = temp_dir / "icons"
        session_dir.mkdir()

        result = _generate_html_pdf(template_dir, yaml_path, output_path, session_dir)

        assert result.get("success") is True, (
            f"Default PDF failed for {template_dir}: {result.get('error')}"
        )
        assert output_path.exists()
        assert output_path.stat().st_size > 5000

        if PDFPLUMBER_AVAILABLE:
            text = _extract_pdf_text(output_path)
            assert _text_in_pdf("Test User", text)
            assert _text_in_pdf("Acme Corp", text)
