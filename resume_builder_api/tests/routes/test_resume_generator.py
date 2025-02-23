# tests/test_resume_generator_route.py
import io
import pytest
from fastapi.testclient import TestClient
import yaml


@pytest.fixture
def valid_yaml_file():
    """Return a BytesIO stream of a minimal valid YAML resume."""
    yaml_content = """
    contact_info:
      email: "test@example.com"
      linkedin: "https://linkedin.com/in/testuser"
    sections:
      - name: "Experience"
        content: []
    """
    return io.BytesIO(yaml_content.encode("utf-8"))


@pytest.fixture
def valid_icon_file():
    """Return a tuple simulating an uploaded icon file."""
    return ("icon.png", io.BytesIO(b"PNGDATA"), "image/png")


@pytest.fixture
def fake_resume_pdf(monkeypatch, tmp_path):
    """
    Monkeypatch the ResumeGenerator.generate_pdf method so that it writes a dummy PDF.
    """
    from resume_builder_api.services.resume_generator import ResumeGenerator

    def fake_generate_pdf(self, template_name, data, output_file):
        output_path = tmp_path / output_file
        output_path.write_bytes(b"%PDF-1.4 dummy PDF content")
        return output_path

    monkeypatch.setattr(ResumeGenerator, "generate_pdf", fake_generate_pdf)


# --- Tests ---


def test_generate_resume_missing_yaml(
    client: TestClient,
):
    """
    Test that missing the YAML file results in a validation error.
    """
    response = client.post("/api/generate", data={"template": "modern"})
    # FastAPI validation returns 422 when required files are missing.
    assert response.status_code == 422


def test_generate_resume_valid(client: TestClient, fake_resume_pdf, valid_yaml_file):
    """
    Test generating a resume with valid YAML and no icons.
    """
    response = client.post(
        "/api/generate",
        data={"template": "modern-no-icons"},
        files={"yaml_file": ("resume.yaml", valid_yaml_file, "application/x-yaml")},
    )
    assert response.status_code == 200
    # Check that the response has PDF content type and dummy PDF content.
    assert "application/pdf" in response.headers["content-type"]
    assert response.content.startswith(b"%PDF")


def test_generate_resume_valid_with_icons(
    client: TestClient, fake_resume_pdf, valid_yaml_file, valid_icon_file
):
    """
    Test generating a resume with valid YAML and one icon.
    """
    response = client.post(
        "/api/generate",
        data={"template": "modern-no-icons"},
        files={
            "yaml_file": ("resume.yaml", valid_yaml_file, "application/x-yaml"),
            "icons": valid_icon_file,
        },
    )
    assert response.status_code == 200
    assert "application/pdf" in response.headers["content-type"]
    assert response.content.startswith(b"%PDF")


def test_generate_resume_invalid_template(client: TestClient, valid_yaml_file):
    """
    Test that using an invalid template returns a 400 error.
    """
    response = client.post(
        "/api/generate",
        data={"template": "nonexistent"},
        files={"yaml_file": ("resume.yaml", valid_yaml_file, "application/x-yaml")},
    )
    # The route should raise an HTTPException (500) when the template directory is not found.
    assert response.status_code == 400
    data = response.json()
    assert "Invalid template" in data["detail"]["error"]
