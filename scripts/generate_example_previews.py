#!/usr/bin/env python3
"""
Generate web-optimized preview images from job example YAML files.

Converts all 26 job example YAMLs into WebP preview images using the
modern HTML template engine + wkhtmltopdf + pdf2image.

Output: docs/templates/examples/{slug}.webp (800w) + {slug}-sm.webp (400w)

Usage:
    python scripts/generate_example_previews.py
    python scripts/generate_example_previews.py --slug software-engineer  # single file
"""

import argparse
import logging
import sys
import tempfile
import uuid
from pathlib import Path

import pdfkit
import yaml
from jinja2 import Environment, FileSystemLoader

# Add project root to path so we can import helpers from resume_generator
PROJECT_ROOT = Path(__file__).parent.parent.resolve()
sys.path.insert(0, str(PROJECT_ROOT))

from resume_generator import (
    calculate_columns,
    convert_markdown_links_to_html,
    convert_markdown_formatting_to_html,
    migrate_linkedin_to_social_links,
    get_social_media_handle,
    generate_linkedin_display_text,
)

EXAMPLES_DIR = PROJECT_ROOT / "resume-builder-ui" / "public" / "examples"
OUTPUT_DIR = PROJECT_ROOT / "docs" / "templates" / "examples"

# All examples are rendered with the modern HTML template regardless of
# what template field is set in the YAML (classic requires LaTeX,
# professional/minimal don't have HTML templates).
TEMPLATE_NAME = "modern"

# Image settings
DESKTOP_WIDTH = 800
MOBILE_WIDTH = 400
WEBP_QUALITY = 82
PDF_DPI = 200

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def convert_flat_to_template_yaml(resume: dict) -> dict:
    """
    Convert job-example flat YAML schema to the template-engine schema
    expected by generate_pdf().

    Job example schema:  resume.contact, resume.summary, resume.experience[].bullets
    Template schema:     contact_info, sections[{type, name, content}]

    This is the Python equivalent of convertToEditorFormat() in
    resume-builder-ui/src/utils/yamlLoader.ts:96-164.
    """
    contact = resume.get("contact", {})

    # Build contact_info with social_links
    social_links = []
    if contact.get("linkedin"):
        social_links.append({
            "platform": "linkedin",
            "url": contact["linkedin"],
            "display_text": contact.get("name", "LinkedIn"),
        })
    if contact.get("github"):
        social_links.append({
            "platform": "github",
            "url": contact["github"],
            "display_text": contact["github"].split("/")[-1] if "/" in contact["github"] else contact["github"],
        })

    contact_info = {
        "name": contact.get("name", ""),
        "title": contact.get("title", ""),
        "email": contact.get("email", ""),
        "phone": contact.get("phone", ""),
        "location": contact.get("location", ""),
        "social_links": social_links,
    }

    sections = []

    # Summary → text section
    if resume.get("summary"):
        sections.append({
            "name": "Professional Summary",
            "type": "text",
            "content": resume["summary"].strip(),
        })

    # Experience → experience section
    if resume.get("experience"):
        exp_content = []
        for exp in resume["experience"]:
            exp_content.append({
                "company": exp.get("company", ""),
                "title": exp.get("title", ""),
                "dates": exp.get("dates", ""),
                "description": exp.get("bullets", []),
            })
        sections.append({
            "name": "Work Experience",
            "type": "experience",
            "content": exp_content,
        })

    # Education → education section
    if resume.get("education"):
        edu_content = []
        for edu in resume["education"]:
            edu_content.append({
                "school": edu.get("school", ""),
                "degree": edu.get("degree", ""),
                "year": str(edu.get("year", "")),
                "gpa": edu.get("gpa", ""),
                "honors": edu.get("honors", ""),
            })
        sections.append({
            "name": "Education",
            "type": "education",
            "content": edu_content,
        })

    # Skills → dynamic-column-list section
    if resume.get("skills"):
        sections.append({
            "name": "Skills",
            "type": "dynamic-column-list",
            "content": resume["skills"],
        })

    # Certifications → bulleted-list section
    if resume.get("certifications"):
        sections.append({
            "name": "Certifications",
            "type": "bulleted-list",
            "content": resume["certifications"],
        })

    # Projects → experience section
    if resume.get("projects"):
        proj_content = []
        for proj in resume["projects"]:
            proj_content.append({
                "company": "",
                "title": proj.get("name", ""),
                "dates": "",
                "description": [proj.get("description", "")],
            })
        sections.append({
            "name": "Projects",
            "type": "experience",
            "content": proj_content,
        })

    return {
        "template": TEMPLATE_NAME,
        "contact_info": contact_info,
        "sections": sections,
        "font": "Arial",
    }


def generate_preview_images(slug: str, pdf_path: str) -> None:
    """Convert first page of PDF to desktop + mobile WebP images."""
    from pdf2image import convert_from_path
    from PIL import Image

    images = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=PDF_DPI)
    if not images:
        raise RuntimeError(f"No images generated from PDF for {slug}")

    page = images[0]
    aspect = page.height / page.width

    for width, suffix in [(DESKTOP_WIDTH, ""), (MOBILE_WIDTH, "-sm")]:
        height = int(width * aspect)
        resized = page.resize((width, height), Image.Resampling.LANCZOS)
        out_path = OUTPUT_DIR / f"{slug}{suffix}.webp"
        resized.save(str(out_path), "WEBP", quality=WEBP_QUALITY)
        size_kb = out_path.stat().st_size / 1024
        log.info(f"  {out_path.name}: {width}x{height}, {size_kb:.1f} KB")


def render_pdf(data: dict, output_file: str) -> None:
    """
    Render template data to PDF. Mirrors resume_generator.generate_pdf() but
    uses load-error-handling=skip so wkhtmltopdf 0.12.6 (non-patched Qt,
    common in Docker slim images) doesn't abort on benign network errors.
    """
    templates_dir = PROJECT_ROOT / "templates" / TEMPLATE_NAME
    css_file = templates_dir / "styles.css"
    icons_dir = PROJECT_ROOT / "icons"

    data["icon_path"] = f"file://{icons_dir.as_posix()}"
    data["css_path"] = f"file://{css_file.as_posix()}"

    env = Environment(loader=FileSystemLoader(templates_dir))
    env.filters["markdown_links"] = convert_markdown_links_to_html
    env.filters["markdown_formatting"] = convert_markdown_formatting_to_html

    # Calculate columns for dynamic-column-list sections
    for section in data.get("sections", []):
        if section.get("type") == "dynamic-column-list":
            section["num_cols"] = calculate_columns(len(section.get("content", [])))

    # Process social links (same as generate_pdf)
    contact_info = data.get("contact_info", {})
    contact_info = migrate_linkedin_to_social_links(contact_info)
    for link in contact_info.get("social_links", []):
        url = link.get("url", "")
        if url and not url.startswith(("http://", "https://")):
            url = "https://" + url
            link["url"] = url
        platform = link.get("platform", "")
        link["handle"] = get_social_media_handle(url, platform)
        if not link.get("display_text", "").strip():
            if platform == "linkedin":
                link["display_text"] = generate_linkedin_display_text(
                    url, contact_info.get("name", "")
                )
            else:
                link["display_text"] = link["handle"] or platform.capitalize()

    # Backward compat fields
    linkedin_link = next(
        (l for l in contact_info.get("social_links", []) if l.get("platform") == "linkedin"), None
    )
    if linkedin_link:
        contact_info["linkedin"] = linkedin_link.get("url", "")
        contact_info["linkedin_handle"] = linkedin_link.get("handle", "")
        contact_info["linkedin_display"] = linkedin_link.get("display_text", "")
    else:
        contact_info["linkedin"] = ""
        contact_info["linkedin_handle"] = ""
        contact_info["linkedin_display"] = ""

    template = env.get_template("base.html")
    html_content = template.render(
        contact_info=contact_info,
        sections=data["sections"],
        icon_path=data["icon_path"],
        css_path=data["css_path"],
        font=data.get("font", "Arial"),
    )

    output_dir = PROJECT_ROOT / "output"
    output_dir.mkdir(exist_ok=True)
    temp_html = output_dir / f"temp_preview_{uuid.uuid4().hex[:8]}.html"
    temp_html.write_text(html_content)

    try:
        pdfkit.from_file(
            str(temp_html),
            output_file,
            options={
                "enable-local-file-access": "",
                "load-error-handling": "skip",
                "quiet": "",
            },
        )
    finally:
        temp_html.unlink(missing_ok=True)


def process_example(yml_path: Path) -> bool:
    """Process a single example YAML → PDF → WebP images. Returns True on success."""
    slug = yml_path.stem
    log.info(f"Processing: {slug}")

    try:
        with open(yml_path, "r", encoding="utf-8") as f:
            raw = yaml.safe_load(f)

        resume = raw.get("resume", {})
        if not resume:
            log.warning(f"  Skipping {slug}: no 'resume' key in YAML")
            return False

        data = convert_flat_to_template_yaml(resume)

        # Generate PDF to a temp file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp_pdf = tmp.name

        render_pdf(data, tmp_pdf)
        log.info(f"  PDF generated")

        # Convert to WebP images
        generate_preview_images(slug, tmp_pdf)

        # Clean up temp PDF
        Path(tmp_pdf).unlink(missing_ok=True)
        return True

    except Exception as e:
        log.error(f"  Failed to process {slug}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Generate example preview images")
    parser.add_argument("--slug", help="Process only this slug (e.g., 'software-engineer')")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.slug:
        yml_path = EXAMPLES_DIR / f"{args.slug}.yml"
        if not yml_path.exists():
            log.error(f"File not found: {yml_path}")
            sys.exit(1)
        success = process_example(yml_path)
        sys.exit(0 if success else 1)

    # Process all examples
    yml_files = sorted(EXAMPLES_DIR.glob("*.yml"))
    log.info(f"Found {len(yml_files)} example YAML files")

    succeeded, failed = 0, 0
    for yml_path in yml_files:
        if process_example(yml_path):
            succeeded += 1
        else:
            failed += 1

    log.info(f"Done: {succeeded} succeeded, {failed} failed, {succeeded * 2} images generated")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
