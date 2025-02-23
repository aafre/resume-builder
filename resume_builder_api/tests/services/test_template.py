import pytest
import yaml

from resume_builder_api.services.template_service import load_templates_map


@pytest.fixture
def create_template_folder(tmp_path):
    """
    Creates a temporary template folder with a given meta.yml and resume file.
    Returns the path to the template folder.
    """

    def _create_template_folder(
        folder_name: str,
        meta: dict,
        resume_filename: str = None,
        resume_content: dict = None,
    ):
        folder = tmp_path / folder_name
        folder.mkdir()
        meta_file = folder / "meta.yml"
        with open(meta_file, "w") as mf:
            yaml.safe_dump(meta, mf)
        if resume_filename:
            resume_file = folder / resume_filename
            if resume_content is None:
                resume_content = {"contact_info": {"email": "test@example.com"}}
            with open(resume_file, "w") as rf:
                yaml.safe_dump(resume_content, rf)
        return folder

    return _create_template_folder


def test_load_templates_map_with_valid_meta(create_template_folder, tmp_path):
    meta = {
        "templates": [
            {
                "id": "modern-with-icons",
                "name": "Modern (With Icons)",
                "description": "Professional layout with decorative icons.",
                "resume_file": "john_doe.yml",
                "image_url": "modern-with-icons.png",
            }
        ]
    }
    create_template_folder("modern", meta, "john_doe.yml")

    # Create a temporary samples directory with one valid template folder
    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()
    (tmp_path / "modern").rename(samples_dir / "modern")

    templates_map = load_templates_map(samples_dir)
    assert "modern-with-icons" in templates_map
    mapping = templates_map["modern-with-icons"]
    # Check that the path is absolute and points to the correct file
    assert mapping["path"].is_absolute()
    assert mapping["name"] == "Modern (With Icons)"
    assert mapping["description"] == "Professional layout with decorative icons."
    assert mapping["image_url"] == "modern-with-icons.png"


def test_load_templates_map_without_meta(tmp_path):
    # Create a folder without meta.yml
    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()
    folder = samples_dir / "template_without_meta"
    folder.mkdir()
    # Even if a resume file exists, it should be skipped
    (folder / "resume.yml").write_text("contact_info: {email: test@example.com}")

    templates_map = load_templates_map(samples_dir)
    assert templates_map == {}


def test_load_templates_map_missing_resume_file(create_template_folder, tmp_path):
    meta = {
        "templates": [
            {
                "id": "modern-no-icons",
                "name": "Modern (No Icons)",
                "description": "Simple and clean layout without icons.",
                "resume_file": "nonexistent.yml",
                "image_url": "modern-no-icons.png",
            }
        ]
    }
    # Create the folder without creating the resume file
    create_template_folder("modern", meta)

    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()
    (tmp_path / "modern").rename(samples_dir / "modern")

    templates_map = load_templates_map(samples_dir)
    # Since the resume file doesn't exist, the template should not be included
    assert "modern-no-icons" not in templates_map


def test_load_templates_map_multiple_folders(create_template_folder, tmp_path):
    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()

    meta1 = {
        "templates": [
            {
                "id": "template1",
                "name": "Template One",
                "description": "First template",
                "resume_file": "resume1.yml",
                "image_url": "template1.png",
            }
        ]
    }
    meta2 = {
        "templates": [
            {
                "id": "template2",
                "name": "Template Two",
                "description": "Second template",
                "resume_file": "resume2.yml",
                "image_url": "template2.png",
            }
        ]
    }
    create_template_folder("folder1", meta1, "resume1.yml")
    create_template_folder("folder2", meta2, "resume2.yml")

    # Move both folders into samples_dir
    (tmp_path / "folder1").rename(samples_dir / "folder1")
    (tmp_path / "folder2").rename(samples_dir / "folder2")

    templates_map = load_templates_map(samples_dir)
    assert "template1" in templates_map
    assert "template2" in templates_map


def test_load_templates_map_ignores_non_directories(tmp_path):
    samples_dir = tmp_path / "samples"
    samples_dir.mkdir()
    # Create a file (not a directory) in samples_dir
    non_dir_file = samples_dir / "not_a_folder.txt"
    non_dir_file.write_text("I am not a folder")

    # Even if there is no valid template folder, the function should simply return an empty mapping
    templates_map = load_templates_map(samples_dir)
    assert templates_map == {}
