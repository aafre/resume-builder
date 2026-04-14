#!/usr/bin/env python3
"""
Generate template preview PNG images for the template picker.

Renders each template's sample YAML → PDF → PNG (first page only).
Output: docs/templates/{preview_filename}

Usage:
    python scripts/generate_template_previews.py           # all templates
    python scripts/generate_template_previews.py --id ats-optimized  # single

Requires: wkhtmltopdf (Linux), pdf2image, Pillow
Run inside Docker dev container.
"""

import argparse
import logging
import subprocess
import sys
import tempfile
from pathlib import Path

from pdf2image import convert_from_path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
OUTPUT_DIR = PROJECT_ROOT / "docs" / "templates"

# PNG output width for template picker
PREVIEW_WIDTH = 800
PDF_DPI = 200

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def generate_preview(template_id: str, template_dir: str, sample_path: Path, preview_filename: str, engine: str) -> bool:
    """Generate a single template preview: YAML → PDF → PNG."""
    if engine == "latex":
        log.warning(f"[{template_id}] LaTeX templates not supported by this script (needs xelatex). Skipping.")
        return False

    if not sample_path.exists():
        log.error(f"[{template_id}] Sample file missing: {sample_path}")
        return False

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        pdf_path = tmp_path / "output.pdf"

        # Generate PDF via resume_generator.py
        cmd = [
            sys.executable, str(PROJECT_ROOT / "resume_generator.py"),
            "--template", template_dir,
            "--input", str(sample_path),
            "--output", str(pdf_path),
        ]
        log.info(f"[{template_id}] Generating PDF...")
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(PROJECT_ROOT))
        if result.returncode != 0:
            log.error(f"[{template_id}] PDF generation failed:\n{result.stderr}")
            return False

        if not pdf_path.exists():
            log.error(f"[{template_id}] PDF not created at {pdf_path}")
            return False

        # Convert first page to PNG
        log.info(f"[{template_id}] Converting PDF → PNG...")
        pages = convert_from_path(str(pdf_path), dpi=PDF_DPI, first_page=1, last_page=1)
        if not pages:
            log.error(f"[{template_id}] No pages extracted from PDF")
            return False

        img = pages[0]

        # Resize to target width, maintaining aspect ratio
        aspect = img.height / img.width
        target_height = int(PREVIEW_WIDTH * aspect)
        img = img.resize((PREVIEW_WIDTH, target_height), Image.LANCZOS)

        # Save as PNG
        output_path = OUTPUT_DIR / preview_filename
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        img.save(str(output_path), "PNG", optimize=True)
        log.info(f"[{template_id}] ✓ Saved {output_path} ({img.width}x{img.height})")
        return True


def main():
    parser = argparse.ArgumentParser(description="Generate template preview images")
    parser.add_argument("--id", help="Generate preview for a single template ID")
    args = parser.parse_args()

    # Import registry to get template configs
    sys.path.insert(0, str(PROJECT_ROOT))
    from templates.registry import TEMPLATES, _ALIAS_IDS

    success = 0
    failed = 0

    for tid, cfg in TEMPLATES.items():
        if tid in _ALIAS_IDS:
            continue
        if args.id and tid != args.id:
            continue

        sample_path = PROJECT_ROOT / cfg.sample
        ok = generate_preview(tid, cfg.dir, sample_path, cfg.preview, cfg.engine.value)
        if ok:
            success += 1
        else:
            failed += 1

    log.info(f"\nDone: {success} generated, {failed} failed/skipped")


if __name__ == "__main__":
    main()
