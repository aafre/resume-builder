# Preview Image Generation

Preview images for both **9 registry templates** and **26 job example pages** are generated from YAML data, converted to uniform WebP images, and served from Supabase Storage CDN.

## Architecture

```
YAML source
  → resume_generator.py (HTML/CSS or LaTeX → PDF)
    → pdf2image + Pillow (PDF → WebP)
      → Supabase Storage bucket "template-previews"
        → CDN URL used by TemplateCard + JobExamplePage
```

**Bucket:** `template-previews` (public, WebP only)
**CDN base:** `{VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
**Cache:** `public, max-age=31536000, immutable` (1 year, CDN-cached)

Each item produces two files:
- `{slug}.webp` — 800px wide (desktop)
- `{slug}-sm.webp` — 400px wide (mobile, via `srcSet`)

## Unified Script: `scripts/generate_all_previews.py`

Generates previews for everything — templates AND job examples — in one run.

### Usage

```bash
# Everything (9 templates + 26 job examples)
python scripts/generate_all_previews.py

# Only the 9 registry templates
python scripts/generate_all_previews.py --templates

# Only the 26 job examples
python scripts/generate_all_previews.py --examples

# Single template by ID
python scripts/generate_all_previews.py --template-id modern-with-icons

# Single job example by slug
python scripts/generate_all_previews.py --slug software-engineer
```

### Running in Docker (recommended)

The dev script container has all dependencies (wkhtmltopdf, poppler, texlive):

```bash
docker build -t resume-script -f Dockerfile.dev.script .

# Generate all previews
docker run --rm \
  -v "$(pwd)/docs/templates/examples:/app/docs/templates/examples" \
  resume-script python scripts/generate_all_previews.py

# Templates only
docker run --rm \
  -v "$(pwd)/docs/templates/examples:/app/docs/templates/examples" \
  resume-script python scripts/generate_all_previews.py --templates
```

### Upload to Supabase CDN

Requires `.env` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

```bash
# All images
python scripts/upload_previews_to_supabase.py

# Single slug
python scripts/upload_previews_to_supabase.py --slug software-engineer
```

## Image Sources

| Type | YAML source | Template engine | Output slug |
|------|-------------|-----------------|-------------|
| Registry templates | `samples/{dir}/{file}.yml` | Uses own template ID (HTML or LaTeX) | Preview filename stem from `registry.py` |
| Job examples | `resume-builder-ui/public/examples/{slug}.yml` | Always `modern` (HTML) | `{slug}` |

### Template → Slug Mapping

| Template ID | Preview slug | Engine |
|-------------|-------------|--------|
| classic-alex-rivera | `alex_rivera` | LaTeX |
| classic-jane-doe | `jane_doe` | LaTeX |
| modern-with-icons | `modern-with-icons` | HTML |
| modern-no-icons | `modern-no-icons` | HTML |
| ats-optimized | `ats-optimized` | HTML |
| student | `student` | HTML |
| executive | `executive` | LaTeX |
| two-column | `two-column` | HTML |
| uk-cv | `uk-cv` | HTML |

## Prerequisites

**Python packages:** `pyyaml`, `pdf2image`, `Pillow` (in `requirements.txt`)

**System packages:**
- `wkhtmltopdf` — PDF generation for HTML templates
- `poppler-utils` — PDF → image conversion (`pdf2image`)
- `texlive-xetex`, `texlive-fonts-recommended` — LaTeX template rendering

All included in `Dockerfile.dev.script`.

## When to Regenerate

- **YAML content changed** — regenerate affected slug(s)
- **Template CSS/HTML/LaTeX changed** — regenerate all templates using that engine
- **New template or job example added** — generate + upload the new slug
- **Font changes** — regenerate everything (fonts affect PDF rendering)

## Adding a New Job Example

1. Create `resume-builder-ui/public/examples/{new-slug}.yml`
2. Add entry to `resume-builder-ui/src/data/jobExamples/index.ts`
3. Generate: `python scripts/generate_all_previews.py --slug {new-slug}`
4. Upload: `python scripts/upload_previews_to_supabase.py --slug {new-slug}`
5. Add URL to `resume-builder-ui/src/data/sitemapUrls.ts`

## File Reference

| File | Purpose |
|------|---------|
| `scripts/generate_all_previews.py` | Unified YAML → PDF → WebP generation (templates + examples) |
| `scripts/upload_previews_to_supabase.py` | Upload WebP files to Supabase Storage |
| `docs/templates/examples/*.webp` | Generated images (gitignored) |
| `resume-builder-ui/src/components/seo/JobExamplePage.tsx` | Frontend consuming CDN images |
| `resume-builder-ui/public/examples/*.yml` | Job example source YAML files |
| `samples/` | Template sample YAML files |
| `templates/registry.py` | Template registry with preview filenames |

## Legacy Script

`scripts/generate_example_previews.py` — original script that only handles job examples (not templates). Superseded by `generate_all_previews.py`.
