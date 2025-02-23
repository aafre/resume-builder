# resume_builder_api/routes/resume_generator.py
from typing import List, Optional
from fastapi import APIRouter, Form, HTTPException, Depends, Request, File, UploadFile
from fastapi.responses import FileResponse
from pathlib import Path
from datetime import datetime
import yaml

from resume_builder_api.models import GeneratePDFResponse, ErrorResponse
from resume_builder_api.constants import (
    JINJA_TEMPLATES_DIR,
    ICONS_DIR,
    MAX_REQUEST_SIZE,
    OUTPUT_DIR,
    TEMPLATES_DIR,
)
from resume_builder_api.services.resume_generator import ResumeGenerator
from resume_builder_api.services.template_service import load_templates_map

router = APIRouter(tags=["Resume Generator"])

ALLOWED_ICON_EXTENSIONS = {"png", "jpg", "jpeg", "svg"}
ALLOWED_ICON_SIZE = 1024 * 1024  # 1 MB


def get_resume_generator():
    return ResumeGenerator(
        templates_base_dir=JINJA_TEMPLATES_DIR,
        icons_dir=ICONS_DIR,
        output_dir=OUTPUT_DIR,
    )


def raise_error(status_code: int, message: str):
    raise HTTPException(
        status_code=status_code, detail=ErrorResponse(error=message).dict()
    )


async def get_icons(request: Request) -> List[UploadFile]:
    form = await request.form()
    icons = form.getlist("icons")
    # Filter out empty string values.
    valid_icons = []
    for icon in icons:
        # If the item is already an UploadFile, it's valid.
        if isinstance(icon, UploadFile):
            valid_icons.append(icon)
        # If it's a string (empty), skip it.
        elif isinstance(icon, str) and icon.strip() == "":
            continue
    return valid_icons


@router.post(
    "/generate",
    response_model=GeneratePDFResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def generate_resume(
    template: str = Form("modern-no-icons"),
    yaml_file: UploadFile = File(...),
    icons: List[UploadFile] = Depends(get_icons),
    generator: ResumeGenerator = Depends(get_resume_generator),
    req: Request = None,
):
    """
    Generate a resume PDF from an uploaded YAML file and optional icons.
    """
    if (
        req
        and req.headers.get("Content-Length")
        and int(req.headers["Content-Length"]) > MAX_REQUEST_SIZE
    ):
        raise HTTPException(status_code=413, detail="Request body too large")

    # Convert None to empty list for icons
    if icons is None:
        icons = []

    # Get list of valid templates dynamically.
    VALID_TEMPLATES = tuple(load_templates_map(TEMPLATES_DIR).keys())
    if template not in VALID_TEMPLATES:
        raise_error(
            400,
            f"Invalid template: {template}. Available: {', '.join(VALID_TEMPLATES)}",
        )

    # Validate YAML file extension.
    if not yaml_file.filename.endswith((".yaml", ".yml")):
        raise_error(400, "YAML file must have .yaml or .yml extension")

    # Read and parse YAML file.
    with yaml_file.file as f:
        try:
            data = yaml.safe_load(f)
            if not isinstance(data, dict):
                raise_error(400, "Invalid YAML content: must be a dictionary")
        except yaml.YAMLError as e:
            raise_error(400, f"Error parsing YAML: {e}")

    # Process icon uploads.
    for icon in icons:
        if icon.filename:
            ext = (
                icon.filename.rsplit(".", 1)[-1].lower() if "." in icon.filename else ""
            )
            ALLOWED_ICON_EXTENSIONS = {"png", "jpg", "jpeg", "svg"}
            if ext not in ALLOWED_ICON_EXTENSIONS:
                raise_error(400, f"Invalid icon file type: {icon.filename}")
            icon_path = ICONS_DIR / icon.filename
            with open(icon_path, "wb") as f:
                f.write(await icon.read())

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"Resume_{timestamp}.pdf"

    try:
        pdf_path = generator.generate_pdf(template, data, output_filename)
        download_url = (
            str(req.url_for("download_resume", filename=output_filename))
            if req
            else None
        )
        return FileResponse(
            path=str(pdf_path),
            filename=output_filename,
            media_type="application/pdf",
        )
    except ValueError as e:
        raise_error(400, str(e))
    except RuntimeError as e:
        raise_error(500, str(e))


@router.get("/download/{filename}")
async def download_resume(filename: str):
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise_error(404, "File not found")
    return FileResponse(path=file_path, filename=filename, media_type="application/pdf")
