from pathlib import Path

import yaml

from resume_builder_api.constants import TEMPLATES_DIR


def load_templates_map(templates_dir: Path = TEMPLATES_DIR) -> dict:
    """
    Dynamically build a mapping of template IDs to their YAML file paths.

    Each template is expected to reside in its own subdirectory within samples_dir.
    Optionally, a template folder may contain a 'meta.yml' file with metadata (including the id).
    If no meta file is present, the folder name is used as the template id.
    The YAML file is assumed to be named 'resume.yml'.

    Returns:
        dict: Mapping of template_id -> resume YAML file Path.
    """

    templates_map = {}

    for template_dir in templates_dir.iterdir():
        if not template_dir.is_dir():
            continue
        meta_file = template_dir / "meta.yml"
        if not meta_file.exists():
            continue  # Skip folders without meta.yml
        with open(meta_file, "r") as mf:
            meta = yaml.safe_load(mf)
        for tmpl in meta.get("templates", []):
            template_id = tmpl.get("id")
            resume_file = tmpl.get("resume_file")
            if template_id and resume_file:
                resume_path = (template_dir / resume_file).resolve()
                if resume_path.exists():
                    templates_map[template_id] = {
                        "path": resume_path,
                        "name": tmpl.get("name"),
                        "description": tmpl.get("description"),
                        "image_url": tmpl.get("image_url"),
                    }
    return templates_map


if __name__ == "__main__":
    template_map = load_templates_map()
    print(template_map)
