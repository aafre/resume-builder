# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
import yaml

from resume_builder_api.api import app


@pytest.fixture
def temp_templates_dir(tmp_path):
    """
    Creates a temporary samples directory structure for templates.
    Structure:
      samples/
        modern/
          meta.yml
          john_doe.yml
          john_doe_no_icon.yml
          modern-with-icons.png
          modern-no-icons.png
    """
    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()
    modern_dir = samples_dir / "modern"
    modern_dir.mkdir()

    # Create meta.yml in the modern folder
    meta = {
        "templates": [
            {
                "id": "modern-with-icons",
                "name": "Modern (With Icons)",
                "description": "Professional layout with decorative icons.",
                "resume_file": "john_doe.yml",
                "image_url": "modern-with-icons.png",
            },
            {
                "id": "modern-no-icons",
                "name": "Modern (No Icons)",
                "description": "Simple and clean layout without icons.",
                "resume_file": "john_doe_no_icon.yml",
                "image_url": "modern-no-icons.png",
            },
        ]
    }
    (modern_dir / "meta.yml").write_text(yaml.safe_dump(meta))

    # Create resume YAML files
    with open(modern_dir / "john_doe.yml", "w") as f:
        yaml.safe_dump({"sections": []}, f)
    with open(modern_dir / "john_doe_no_icon.yml", "w") as f:
        yaml.safe_dump({"sections": []}, f)

    # Create dummy image files
    (modern_dir / "modern-with-icons.png").write_bytes(b"PNGDATA")
    (modern_dir / "modern-no-icons.png").write_bytes(b"PNGDATA")

    return samples_dir


@pytest.fixture
def client(temp_templates_dir, monkeypatch):
    """
    Overrides the TEMPLATES_DIR constant to use our temporary samples directory.
    Returns a FastAPI TestClient instance.
    """
    # Override the TEMPLATES_DIR in the constants module
    monkeypatch.setattr(
        "resume_builder_api.constants.TEMPLATES_DIR", temp_templates_dir
    )
    return TestClient(app)
