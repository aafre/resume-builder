# Job Example Preview Images

Preview images for the 26 job example pages (`/examples/{slug}`) are generated from YAML data, converted to WebP, and served from Supabase Storage CDN.

## Architecture

```
YAML (public/examples/*.yml)
  → resume_generator.py (HTML/CSS → PDF via pdfkit)
    → pdf2image + Pillow (PDF → WebP)
      → Supabase Storage bucket "template-previews"
        → CDN URL used by JobExamplePage.tsx
```

**Bucket:** `template-previews` (public, WebP only)
**CDN base:** `{VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
**Cache:** `public, max-age=31536000, immutable` (1 year, CDN-cached)

Each slug produces two files:
- `{slug}.webp` — 800px wide (desktop)
- `{slug}-sm.webp` — 400px wide (mobile, via `srcSet`)

## Prerequisites

```bash
pip install pyyaml pdf2image Pillow python-dotenv supabase
```

System dependency: [Poppler](https://poppler.freedesktop.org/) (for `pdf2image`).
- Windows: `choco install poppler` or download from [poppler releases](https://github.com/osrf/poppler-win32/releases)
- macOS: `brew install poppler`
- Linux: `apt install poppler-utils`

Also requires `wkhtmltopdf` (used by `pdfkit` inside `resume_generator.py`).

## How to Update Preview Images

### 1. Regenerate images from YAML

```bash
# All 26 examples
python scripts/generate_example_previews.py

# Single slug
python scripts/generate_example_previews.py --slug software-engineer
```

Output goes to `docs/templates/examples/`.

### 2. Upload to Supabase Storage (production CDN)

Requires `.env` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

```bash
# All images
python scripts/upload_previews_to_supabase.py

# Single slug
python scripts/upload_previews_to_supabase.py --slug software-engineer
```

The upload script uses `upsert: true` so it overwrites existing files.

### 3. Verify

Visit any example page (e.g., `/examples/software-engineer`) and confirm the image loads from the CDN URL.

## When to Regenerate

- **YAML content changed** — if you edit a job example YAML in `resume-builder-ui/public/examples/`, regenerate its preview
- **Template CSS/HTML changed** — if `templates/modern/` styles change, regenerate all 26 previews
- **New job example added** — generate + upload the new slug

## Adding a New Job Example

1. Create `resume-builder-ui/public/examples/{new-slug}.yml` (follow existing format)
2. Add the slug to the registry in `resume-builder-ui/src/data/jobExamples/`
3. Generate preview: `python scripts/generate_example_previews.py --slug {new-slug}`
4. Upload: `python scripts/upload_previews_to_supabase.py --slug {new-slug}`
5. Add the URL to `sitemapUrls.ts`

## File Reference

| File | Purpose |
|------|---------|
| `scripts/generate_example_previews.py` | YAML → PDF → WebP generation |
| `scripts/upload_previews_to_supabase.py` | Upload WebP files to Supabase Storage |
| `docs/templates/examples/*.webp` | Generated images (gitignored) |
| `resume-builder-ui/src/components/seo/JobExamplePage.tsx` | Frontend component consuming CDN images |
| `resume-builder-ui/public/examples/*.yml` | Source YAML files |
