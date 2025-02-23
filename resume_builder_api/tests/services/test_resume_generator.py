# resume_builder_api/tests/services/test_resume_generator.py
import io
import pytest
from pathlib import Path
import pdfkit

from resume_builder_api.services.resume_generator import ResumeGenerator

# --- Test Helper Methods ---


def test_calculate_columns():
    """Test the static calculate_columns method."""
    assert ResumeGenerator.calculate_columns(1) == 1  # Too few items -> 1 column
    assert (
        ResumeGenerator.calculate_columns(4, max_columns=4, min_items_per_column=2) == 2
    )  # 4 items / 2 = 2 columns
    assert (
        ResumeGenerator.calculate_columns(10, max_columns=4, min_items_per_column=2)
        == 4
    )  # Caps at max_columns
    assert (
        ResumeGenerator.calculate_columns(3, max_columns=4, min_items_per_column=2) == 1
    )  # Below threshold -> 1 column


def test_get_social_media_handle():
    """Test the static get_social_media_handle method."""
    assert (
        ResumeGenerator.get_social_media_handle("https://linkedin.com/in/johndoe/")
        == "johndoe"
    )
    assert (
        ResumeGenerator.get_social_media_handle("https://linkedin.com/in/janedoe")
        == "janedoe"
    )
    assert ResumeGenerator.get_social_media_handle("") == ""
    assert ResumeGenerator.get_social_media_handle(None) == ""


# --- Fixtures ---


@pytest.fixture
def temp_dirs(tmp_path):
    """Create temporary directories for templates, icons, and output."""
    templates_dir = tmp_path / "templates"
    modern_dir = templates_dir / "modern"
    modern_dir.mkdir(parents=True)
    (modern_dir / "base.html").write_text(
        "<html><head>{% if css_path %}<link rel='stylesheet' href='{{ css_path }}'>{% endif %}</head>"
        "<body>{{ contact_info.email }}</body></html>"
    )
    (modern_dir / "styles.css").write_text("body { font-family: Arial; }")

    icons_dir = tmp_path / "icons"
    icons_dir.mkdir()

    output_dir = tmp_path / "output"
    output_dir.mkdir()

    return templates_dir, icons_dir, output_dir


@pytest.fixture
def resume_generator(temp_dirs):
    """Create a ResumeGenerator instance with temporary directories."""
    templates_dir, icons_dir, output_dir = temp_dirs
    return ResumeGenerator(
        templates_base_dir=templates_dir, icons_dir=icons_dir, output_dir=output_dir
    )


@pytest.fixture
def resume_data():
    """Provide minimal valid resume data."""
    return {
        "contact_info": {
            "email": "test@example.com",
            "linkedin": "https://linkedin.com/in/testuser",
        },
        "sections": [],
    }


@pytest.fixture
def fake_pdfkit(monkeypatch):
    """Mock pdfkit.from_file to write a dummy PDF without calling wkhtmltopdf."""

    def mock_from_file(input_file, output_file, options):
        with open(output_file, "wb") as f:
            f.write(b"%PDF-1.4\n% Dummy PDF content")

    monkeypatch.setattr(pdfkit, "from_file", mock_from_file)


# --- Test generate_pdf Method ---


def test_generate_pdf_success(resume_generator, resume_data, fake_pdfkit):
    """Test successful PDF generation."""
    output_filename = "resume_test.pdf"
    result = resume_generator.generate_pdf("modern", resume_data, output_filename)

    assert isinstance(result, Path)
    assert result.exists()
    assert result.name == output_filename
    assert result.read_bytes().startswith(b"%PDF")


def test_generate_pdf_invalid_template(resume_generator, resume_data, fake_pdfkit):
    """Test PDF generation with a non-existent template."""
    with pytest.raises(ValueError, match="Template directory 'nonexistent' not found"):
        resume_generator.generate_pdf("nonexistent", resume_data, "resume.pdf")


def test_generate_pdf_missing_contact_info(resume_generator, fake_pdfkit):
    """Test PDF generation with missing contact info."""
    invalid_data = {"sections": []}
    with pytest.raises(ValueError, match="No contact information provided"):
        resume_generator.generate_pdf("modern", invalid_data, "resume.pdf")


def test_generate_pdf_invalid_linkedin(resume_generator, fake_pdfkit):
    """Test PDF generation with an invalid LinkedIn URL."""
    invalid_data = {
        "contact_info": {
            "email": "test@example.com",
            "linkedin": "https://example.com/in/testuser",
        },
        "sections": [],
    }
    with pytest.raises(ValueError, match="Invalid LinkedIn URL provided"):
        resume_generator.generate_pdf("modern", invalid_data, "resume.pdf")


def test_generate_pdf_cleanup_on_failure(resume_generator, resume_data, monkeypatch):
    """Test that temporary HTML file is cleaned up on PDF generation failure."""

    def failing_pdfkit(input_file, output_file, options):
        raise Exception("Simulated pdfkit failure")

    monkeypatch.setattr(pdfkit, "from_file", failing_pdfkit)

    temp_files_before = list(resume_generator.output_dir.glob("temp_*.html"))
    assert len(temp_files_before) == 0

    with pytest.raises(RuntimeError, match="Error generating PDF"):
        resume_generator.generate_pdf("modern", resume_data, "resume.pdf")

    temp_files_after = list(resume_generator.output_dir.glob("temp_*.html"))
    assert len(temp_files_after) == 0  # Ensure cleanup happened
