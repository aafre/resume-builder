#!/usr/bin/env python3
"""
Generate web-optimized preview images for ALL resume assets:
  - 9 registry templates (from samples/ YAML files)
  - 26 job example resumes (from public/examples/ YAML files)

Outputs uniform WebP images (800w desktop + 400w mobile) for both.

Usage:
    python scripts/generate_all_previews.py                    # everything
    python scripts/generate_all_previews.py --templates        # only 9 templates
    python scripts/generate_all_previews.py --examples         # only 26 job examples
    python scripts/generate_all_previews.py --slug software-engineer  # single example
    python scripts/generate_all_previews.py --template-id modern-with-icons  # single template

Requires: pyyaml, pdf2image, Pillow, poppler-utils, wkhtmltopdf
LaTeX templates also require: texlive-xetex, texlive-fonts-recommended
"""

import argparse
import logging
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from pdf2image import convert_from_path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
sys.path.insert(0, str(PROJECT_ROOT))

EXAMPLES_DIR = PROJECT_ROOT / "resume-builder-ui" / "public" / "examples"
OUTPUT_DIR = PROJECT_ROOT / "docs" / "templates" / "examples"

# Image settings (same dimensions for templates AND examples)
DESKTOP_WIDTH = 800
MOBILE_WIDTH = 400
WEBP_QUALITY = 82
PDF_DPI = 200

# Job examples are all rendered with the modern HTML template
EXAMPLE_TEMPLATE_DIR = "modern"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def generate_preview_images(slug: str, pdf_path: str, output_dir: Path) -> None:
    """Convert first page of PDF to desktop + mobile WebP images."""
    images = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=PDF_DPI)
    if not images:
        raise RuntimeError(f"No images generated from PDF for {slug}")

    page = images[0]
    aspect = page.height / page.width

    for width, suffix in [(DESKTOP_WIDTH, ""), (MOBILE_WIDTH, "-sm")]:
        height = int(width * aspect)
        resized = page.resize((width, height), Image.Resampling.LANCZOS)
        out_path = output_dir / f"{slug}{suffix}.webp"
        resized.save(str(out_path), "WEBP", quality=WEBP_QUALITY)
        size_kb = out_path.stat().st_size / 1024
        log.info(f"  {out_path.name}: {width}x{height}, {size_kb:.1f} KB")


def run_html_pdf(template_dir: str, input_path: str, output_path: str) -> bool:
    """Generate PDF via resume_generator.py (HTML engine). Pass directory name, not ID."""
    cmd = [
        "python", "resume_generator.py",
        "--template", template_dir,
        "--input", input_path,
        "--output", output_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT))
    if result.returncode != 0 or not Path(output_path).exists() or Path(output_path).stat().st_size == 0:
        stderr = result.stderr.strip().splitlines()[-3:] if result.stderr else []
        stdout = result.stdout.strip().splitlines()[-3:] if result.stdout else []
        for line in stderr + stdout:
            log.error(f"    {line}")
        return False
    return True


def run_latex_pdf(template_dir: str, yaml_data: dict, output_path: str) -> bool:
    """Generate PDF via LaTeX (xelatex). Uses the renderer's latex pipeline."""
    try:
        from templates.renderer import generate_pdf as renderer_generate_pdf
        from templates.registry import get as get_template

        # Find a template ID that maps to this directory
        # (renderer needs the ID to look up config)
        all_templates = get_registry_templates()
        match = [t for t in all_templates if t.dir == template_dir]
        if not match:
            log.error(f"  No template found for dir={template_dir}")
            return False

        renderer_generate_pdf(
            template_id=match[0].id,
            yaml_data=yaml_data,
            output_path=output_path,
        )

        if not Path(output_path).exists() or Path(output_path).stat().st_size == 0:
            log.error(f"  PDF not created or empty after LaTeX render")
            return False
        return True
    except Exception as e:
        log.error(f"  LaTeX render failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Job example processing (flat YAML → template YAML → PDF → WebP)
# ---------------------------------------------------------------------------

def convert_flat_to_template_yaml(resume: dict) -> dict:
    """Convert job-example flat YAML to template-engine format."""
    contact = resume.get("contact", {})

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
        "template": EXAMPLE_TEMPLATE_DIR,
        "font": "Arial",
        "contact_info": contact_info,
        "sections": sections,
    }


def process_example(yml_path: Path) -> bool:
    """Process a single job example YAML → PDF → WebP. Returns True on success."""
    slug = yml_path.stem
    log.info(f"[example] {slug}")

    try:
        with open(yml_path, "r", encoding="utf-8") as f:
            raw = yaml.safe_load(f)

        resume = raw.get("resume", {})
        if not resume:
            log.warning(f"  Skipping {slug}: no 'resume' key")
            return False

        template_data = convert_flat_to_template_yaml(resume)

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".yml", delete=False, dir=str(PROJECT_ROOT / "output")
        ) as tmp_yml:
            yaml.dump(template_data, tmp_yml, default_flow_style=False)
            tmp_yml_path = tmp_yml.name

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
            tmp_pdf_path = tmp_pdf.name

        success = run_html_pdf(EXAMPLE_TEMPLATE_DIR, tmp_yml_path, tmp_pdf_path)
        Path(tmp_yml_path).unlink(missing_ok=True)

        if not success:
            Path(tmp_pdf_path).unlink(missing_ok=True)
            return False

        log.info(f"  PDF OK ({Path(tmp_pdf_path).stat().st_size} bytes)")
        generate_preview_images(slug, tmp_pdf_path, OUTPUT_DIR)
        Path(tmp_pdf_path).unlink(missing_ok=True)
        return True

    except Exception as e:
        log.error(f"  Failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Template processing (sample YAML → PDF → WebP)
# ---------------------------------------------------------------------------

def get_registry_templates() -> list:
    """Import the template registry and return display templates."""
    from templates.registry import get_display_templates
    return get_display_templates()


def process_template(template_config) -> bool:
    """Process a single registry template → PDF → WebP. Returns True on success."""
    tid = template_config.id
    tdir = template_config.dir
    sample_path = PROJECT_ROOT / template_config.sample
    engine = template_config.engine.value  # 'html' or 'latex'

    # Output slug from preview filename (e.g., "alex_rivera" from "alex_rivera.png")
    preview_name = template_config.preview
    slug = Path(preview_name).stem if preview_name else tid

    log.info(f"[template] {tid} → {slug} (engine={engine}, dir={tdir})")

    if not sample_path.exists():
        log.error(f"  Sample not found: {sample_path}")
        return False

    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
            tmp_pdf_path = tmp_pdf.name

        if engine == "latex":
            # LaTeX: load YAML data and use renderer pipeline
            with open(sample_path, "r", encoding="utf-8") as f:
                yaml_data = yaml.safe_load(f)
            success = run_latex_pdf(tdir, yaml_data, tmp_pdf_path)
        else:
            # HTML: pass directory name (not template ID) to resume_generator.py
            success = run_html_pdf(tdir, str(sample_path), tmp_pdf_path)

        if not success:
            Path(tmp_pdf_path).unlink(missing_ok=True)
            return False

        log.info(f"  PDF OK ({Path(tmp_pdf_path).stat().st_size} bytes)")
        generate_preview_images(slug, tmp_pdf_path, OUTPUT_DIR)
        Path(tmp_pdf_path).unlink(missing_ok=True)
        return True

    except Exception as e:
        log.error(f"  Failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Generate preview images for all resume templates and job examples"
    )
    parser.add_argument("--templates", action="store_true",
                        help="Generate only the 9 registry template previews")
    parser.add_argument("--examples", action="store_true",
                        help="Generate only the 26 job example previews")
    parser.add_argument("--slug",
                        help="Single job example slug (e.g., 'software-engineer')")
    parser.add_argument("--template-id",
                        help="Single template ID (e.g., 'modern-with-icons')")
    args = parser.parse_args()

    # Default: generate everything if no flags
    do_templates = args.templates or args.template_id or (not args.examples and not args.slug)
    do_examples = args.examples or args.slug or (not args.templates and not args.template_id)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (PROJECT_ROOT / "output").mkdir(exist_ok=True)

    total_ok, total_fail = 0, 0

    if do_templates:
        log.info("=" * 60)
        log.info("GENERATING TEMPLATE PREVIEWS")
        log.info("=" * 60)

        templates = get_registry_templates()
        if args.template_id:
            templates = [t for t in templates if t.id == args.template_id]
            if not templates:
                log.error(f"Template not found: {args.template_id}")
                sys.exit(1)

        log.info(f"Found {len(templates)} templates")
        for t in templates:
            if process_template(t):
                total_ok += 1
            else:
                total_fail += 1

    if do_examples:
        log.info("=" * 60)
        log.info("GENERATING JOB EXAMPLE PREVIEWS")
        log.info("=" * 60)

        if args.slug:
            yml_files = [EXAMPLES_DIR / f"{args.slug}.yml"]
            if not yml_files[0].exists():
                log.error(f"Not found: {yml_files[0]}")
                sys.exit(1)
        else:
            yml_files = sorted(EXAMPLES_DIR.glob("*.yml"))

        log.info(f"Found {len(yml_files)} examples")
        for yml_path in yml_files:
            if process_example(yml_path):
                total_ok += 1
            else:
                total_fail += 1

    log.info("=" * 60)
    log.info(f"DONE: {total_ok} succeeded, {total_fail} failed, {total_ok * 2} images")
    if total_fail:
        log.warning(f"{total_fail} failed — see errors above")
        sys.exit(1)


if __name__ == "__main__":
    main()
