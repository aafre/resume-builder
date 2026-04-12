#!/usr/bin/env python3
"""One-off script to generate the executive template preview image.

Renders the executive LaTeX template with sample data, compiles to PDF,
and converts the first page to WebP for the template gallery.

Usage (from repo root, inside devcontainer):
    python scripts/generate_executive_preview.py
"""

import copy
import re
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader
from pdf2image import convert_from_path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
OUTPUT_DIR = PROJECT_ROOT / "docs" / "templates" / "examples"


# --- Minimal LaTeX helpers (subset of app.py) ---

def _escape_latex(text):
    if not isinstance(text, str):
        return text
    chars = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "{": r"\{",
        "}": r"\}",
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        "-": r"{-}",
    }
    pattern = re.compile("|".join(re.escape(k) for k in chars))
    return pattern.sub(lambda m: chars[m.group(0)], text)


_MD_LINK = re.compile(r"\[([^\]]+)\]\(([^\)]+)\)")
_MD_RULES = [
    (re.compile(r"\*\*(.+?)\*\*"), r"\\textbf{\1}"),
    (re.compile(r"__(.+?)__"), r"\\textbf{\1}"),
    (re.compile(r"\*(.+?)\*"), r"\\textit{\1}"),
    (re.compile(r"_(.+?)_"), r"\\textit{\1}"),
    (re.compile(r"~~(.+?)~~"), r"\\sout{\1}"),
    (re.compile(r"\+\+(.+?)\+\+"), r"\\underline{\1}"),
]


def _md_links_latex(text):
    if not text or not isinstance(text, str):
        return text
    return _MD_LINK.sub(r"\\href{\2}{\1}", text)


def _md_fmt_latex(text):
    if not text or not isinstance(text, str):
        return text
    text = _escape_remaining(text)
    for pat, repl in _MD_RULES:
        text = pat.sub(repl, text)
    return text


def _escape_remaining(text):
    out = []
    i = 0
    while i < len(text):
        if text[i] == '\\' and i + 1 < len(text) and text[i + 1] in ('t', 'h', 's', 'u'):
            cmd_end = text.find('}', i)
            if cmd_end != -1:
                out.append(text[i:cmd_end + 1])
                i = cmd_end + 1
                continue
        if text[i] == '_':
            out.append(r'\_')
        elif text[i] == '~':
            out.append(r'\textasciitilde{}')
        else:
            out.append(text[i])
        i += 1
    return ''.join(out)


def _prepare_data(data):
    data = copy.deepcopy(data)

    def escape(item, key=None):
        if isinstance(item, str):
            return item if key == "type" else _escape_latex(item)
        if isinstance(item, dict):
            return {k: escape(v, k) for k, v in item.items()}
        if isinstance(item, list):
            return [escape(e) for e in item]
        return item

    data = escape(data)

    # Process social links
    contact = data.get("contact_info", {})
    for link in contact.get("social_links", []):
        url = link.get("url", "")
        if not url.startswith("http"):
            url = "https://" + url
            link["url"] = url
        if not link.get("display_text"):
            link["display_text"] = link.get("handle", link.get("platform", ""))
    data["contact_info"] = contact
    return data


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Load sample YAML
    sample_path = PROJECT_ROOT / "samples" / "executive" / "sample_data.yml"
    with open(sample_path) as f:
        yaml_data = yaml.safe_load(f)

    # Normalize sections (add type if missing)
    for section in yaml_data.get("sections", []):
        if not section.get("type"):
            name = section.get("name", "").lower()
            if name == "experience":
                section["type"] = "experience"
            elif name == "education":
                section["type"] = "education"

    # Prepare data with LaTeX escaping
    prepared = _prepare_data(yaml_data)

    # Re-inject un-escaped settings (accent_color contains #)
    settings = yaml_data.get("settings", {})
    prepared["settings"] = settings

    # Render Jinja2 template
    template_dir = PROJECT_ROOT / "templates" / "executive"
    env = Environment(
        loader=FileSystemLoader(template_dir),
        block_start_string="\\BLOCK{",
        block_end_string="}",
        variable_start_string="\\VAR{",
        variable_end_string="}",
        comment_start_string="\\#{",
        comment_end_string="}",
        line_statement_prefix="%%",
        line_comment_prefix="%#",
        trim_blocks=True,
        autoescape=False,
    )
    env.filters["markdown_links"] = _md_links_latex
    env.filters["markdown_formatting"] = _md_fmt_latex

    template = env.get_template("resume.tex")
    latex_content = template.render(**prepared)

    # Compile with xelatex
    session_id = str(uuid.uuid4())[:8]
    tmp = Path(tempfile.gettempdir())
    tex_file = tmp / f"exec_preview_{session_id}.tex"
    pdf_file = tmp / f"exec_preview_{session_id}.pdf"

    tex_file.write_text(latex_content, encoding="utf-8")
    print(f"  Wrote LaTeX to {tex_file}")

    cmd = ["xelatex", "-interaction=nonstopmode", "-output-directory", str(tmp), str(tex_file)]

    # Run xelatex twice (fancyhdr/hyperref need two passes for page numbers)
    for pass_num in (1, 2):
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(tmp))
        if not pdf_file.exists():
            print(f"ERROR: xelatex pass {pass_num} failed to produce PDF")
            print(result.stdout[-2000:] if result.stdout else "(no stdout)")
            print(result.stderr[-2000:] if result.stderr else "(no stderr)")
            return
        size = pdf_file.stat().st_size
        print(f"  xelatex pass {pass_num} OK (rc={result.returncode}, pdf={size} bytes)")

    # Print last 40 lines of xelatex log for debugging
    log_file = tmp / f"exec_preview_{session_id}.log"
    if log_file.exists():
        lines = log_file.read_text(errors="replace").splitlines()
        print(f"\n  --- xelatex log (last 40 lines) ---")
        for line in lines[-40:]:
            print(f"  {line}")

    # Check PDF is valid
    info = subprocess.run(["pdfinfo", str(pdf_file)], capture_output=True, text=True)
    print(f"  pdfinfo: {info.stdout.strip()[:200]}")
    if info.returncode != 0:
        print(f"  WARNING: pdfinfo failed: {info.stderr.strip()[:500]}")

    print(f"  PDF generated: {pdf_file}")

    # Copy PDF to output
    output_pdf = OUTPUT_DIR / "executive.pdf"
    shutil.copy2(pdf_file, output_pdf)
    print(f"  Copied to {output_pdf}")

    # Convert first page to WebP
    images = convert_from_path(str(pdf_file), first_page=1, last_page=1, dpi=200)
    if images:
        img = images[0]

        # Full size (800w)
        w = 800
        h = int(img.height * (w / img.width))
        full = img.resize((w, h), Image.LANCZOS)
        full_path = OUTPUT_DIR / "executive.webp"
        full.save(str(full_path), "WEBP", quality=82)
        print(f"  WebP (800w): {full_path}")

        # Small (400w)
        w_sm = 400
        h_sm = int(img.height * (w_sm / img.width))
        small = img.resize((w_sm, h_sm), Image.LANCZOS)
        small_path = OUTPUT_DIR / "executive-sm.webp"
        small.save(str(small_path), "WEBP", quality=82)
        print(f"  WebP (400w): {small_path}")

    # Cleanup temp files
    for p in tmp.glob(f"exec_preview_{session_id}.*"):
        p.unlink(missing_ok=True)

    print("\nDone! Upload with: python scripts/upload_previews_to_supabase.py")


if __name__ == "__main__":
    main()
