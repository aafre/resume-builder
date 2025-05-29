from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
import yaml

from resume_builder_api.models import Template, TemplatesResponse, TemplateDataResponse
from resume_builder_api.constants import TEMPLATES_DIR
from resume_builder_api.services.template_service import load_templates_map

router = APIRouter(tags=["Templates"])


@router.get("/templates", response_model=TemplatesResponse)
async def get_templates(request: Request):
    """
    Fetch available templates with metadata for display.
    """
    try:
        # Dynamically load all templates from the samples directory.
        templates_map = load_templates_map(TEMPLATES_DIR)
        templates = []
        for template_id, data in templates_map.items():
            image_url = str(
                request.url_for("get_template_image", template_id=template_id)
            )
            templates.append(
                Template(
                    id=template_id,
                    name=data.get("name"),
                    description=data.get("description"),
                    image_url=image_url,
                )
            )
        return TemplatesResponse(templates=templates)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch templates")


@router.get("/template/{template_id}", response_model=TemplateDataResponse)
async def get_template_data(template_id: str):
    """
    Fetch the YAML content and metadata for the specified template.
    """
    templates_map = load_templates_map(TEMPLATES_DIR)
    if template_id not in templates_map:
        raise HTTPException(status_code=404, detail="Template not found")
    template_data = templates_map[template_id]
    template_path = template_data["path"]
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Template file not found")
    try:
        with open(template_path, "r") as file:
            yaml_content = yaml.safe_load(file)
    except Exception:
        raise HTTPException(status_code=500, detail="Error reading template file")

    supports_icons = any(
        "icon" in item
        for section in yaml_content.get("sections", [])
        for item in section.get("content", [])
        if isinstance(item, dict)
    )

    return TemplateDataResponse(
        yaml=yaml.safe_dump(yaml_content),
        template_id=template_id,
        supportsIcons=supports_icons,
    )


@router.get("/template/{template_id}/download")
async def download_template(template_id: str):
    """
    Download the YAML file for the specified template.
    """
    templates_map = load_templates_map(TEMPLATES_DIR)
    if template_id not in templates_map:
        raise HTTPException(status_code=404, detail="Template not found")
    template_data = templates_map[template_id]
    template_path = template_data["path"]
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Template file not found")
    return FileResponse(
        path=str(template_path),
        media_type="application/x-yaml",
        filename=f"{template_id}.yml",
    )


@router.get("/template/{template_id}/image", name="get_template_image")
async def get_template_image(template_id: str):
    """
    Serve the image for the specified template.
    """
    templates_map = load_templates_map(TEMPLATES_DIR)
    if template_id not in templates_map:
        raise HTTPException(status_code=404, detail="Template not found")
    template_data = templates_map[template_id]
    image_filename = template_data.get("image_url")
    if not image_filename:
        raise HTTPException(status_code=404, detail="Image not defined for template")
    # Image is stored in the same folder as the meta and resume files.
    image_path = template_data["path"].parent / image_filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found")
    return FileResponse(path=str(image_path))
