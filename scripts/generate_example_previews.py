#!/usr/bin/env python3
"""
Generate web-optimized preview images from job example YAML files.

Converts all 26 job example YAMLs into WebP preview images using the
existing resume_generator.py subprocess workflow (same as app.py production).

Flow: flat YAML → template YAML → resume_generator.py subprocess → PDF → WebP

Output: docs/templates/examples/{slug}.webp (800w) + {slug}-sm.webp (400w)

Usage:
    python scripts/generate_example_previews.py
    python scripts/generate_example_previews.py --slug software-engineer  # single file
"""

import argparse
import logging
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

EXAMPLES_DIR = PROJECT_ROOT / "resume-builder-ui" / "public" / "examples"
OUTPUT_DIR = PROJECT_ROOT / "docs" / "templates" / "examples"

# All examples rendered with modern HTML template (classic requires LaTeX,
# professional/minimal don't have HTML template directories).
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
    Convert job-example flat YAML to template-engine format.

    Job example:  resume.contact, resume.summary, resume.experience[].bullets
    Template:     contact_info{social_links}, sections[{type, name, content}]

    Python equivalent of convertToEditorFormat() in yamlLoader.ts:96-164.
    """
    contact = resume.get("contact", {})

    # Build social_links from flat contact fields
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

    if resume.get("summary"):
        sections.append({
            "name": "Professional Summary",
            "type": "text",
            "content": resume["summary"].strip(),
        })

    if resume.get("experience"):
        sections.append({
            "name": "Work Experience",
            "type": "experience",
            "content": [
                {
                    "company": exp.get("company", ""),
                    "title": exp.get("title", ""),
                    "dates": exp.get("dates", ""),
                    "description": exp.get("bullets", []),
                }
                for exp in resume["experience"]
            ],
        })

    if resume.get("education"):
        sections.append({
            "name": "Education",
            "type": "education",
            "content": [
                {
                    "school": edu.get("school", ""),
                    "degree": edu.get("degree", ""),
                    "year": str(edu.get("year", "")),
                    "gpa": edu.get("gpa", ""),
                    "honors": edu.get("honors", ""),
                }
                for edu in resume["education"]
            ],
        })

    if resume.get("skills"):
        sections.append({
            "name": "Skills",
            "type": "dynamic-column-list",
            "content": resume["skills"],
        })

    if resume.get("certifications"):
        sections.append({
            "name": "Certifications",
            "type": "bulleted-list",
            "content": resume["certifications"],
        })

    if resume.get("projects"):
        sections.append({
            "name": "Projects",
            "type": "experience",
            "content": [
                {
                    "company": "",
                    "title": proj.get("name", ""),
                    "dates": "",
                    "description": [proj.get("description", "")],
                }
                for proj in resume["projects"]
            ],
        })

    return {
        "template": TEMPLATE_NAME,
        "font": "Arial",
        "contact_info": contact_info,
        "sections": sections,
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

        template_data = convert_flat_to_template_yaml(resume)

        # Write temp YAML in template format (what resume_generator.py expects)
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yml", delete=False, dir=str(PROJECT_ROOT / "output")
        ) as tmp_yml:
            yaml.dump(template_data, tmp_yml, default_flow_style=False)
            tmp_yml_path = tmp_yml.name

        # Generate PDF via subprocess — same workflow as app.py:180
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
            tmp_pdf_path = tmp_pdf.name

        cmd = [
            "python", "resume_generator.py",
            "--template", TEMPLATE_NAME,
            "--input", tmp_yml_path,
            "--output", tmp_pdf_path,
        ]

        result = subprocess.run(
            cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT)
        )

        # Clean up temp YAML
        Path(tmp_yml_path).unlink(missing_ok=True)

        if result.returncode != 0:
            log.error(f"  resume_generator.py failed: {result.stderr.strip()}")
            Path(tmp_pdf_path).unlink(missing_ok=True)
            return False

        # Verify PDF was created
        if not Path(tmp_pdf_path).exists() or Path(tmp_pdf_path).stat().st_size == 0:
            log.error(f"  PDF not created or empty")
            Path(tmp_pdf_path).unlink(missing_ok=True)
            return False

        log.info(f"  PDF generated ({Path(tmp_pdf_path).stat().st_size} bytes)")

        # Convert to WebP images
        generate_preview_images(slug, tmp_pdf_path)

        # Clean up temp PDF
        Path(tmp_pdf_path).unlink(missing_ok=True)
        return True

    except Exception as e:
        log.error(f"  Failed to process {slug}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Generate example preview images")
    parser.add_argument("--slug", help="Process only this slug (e.g., 'software-engineer')")
    args = parser.parse_args()

    # Ensure output directories exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (PROJECT_ROOT / "output").mkdir(exist_ok=True)

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
