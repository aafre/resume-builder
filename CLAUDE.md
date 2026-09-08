# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume Builder is a full-stack application with Flask backend and React frontend. The app generates professional PDF resumes from YAML templates using HTML/CSS templates and pdfkit.

**Architecture:**
- **Frontend**: React + TypeScript + Vite (resume-builder-ui/)
- **Backend**: Flask app (app.py) - serves React app and handles API requests
- **PDF Generation**: Python script (resume_generator.py) using Jinja2 templates + pdfkit
- **Templates**: HTML/CSS templates in templates/ directory (currently "modern" theme)

## Development Commands

### Frontend (resume-builder-ui/)
```bash
cd resume-builder-ui
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run Vitest tests
npm run test:watch   # Run tests in watch mode
npm run coverage     # Generate test coverage
```

### Backend - Flask
```bash
python app.py        # Start Flask development server on port 5000
```

### PDF Generation
```bash
python resume_generator.py --template modern --input samples/modern/john_doe.yml --output output/resume.pdf
```

### Testing
```bash
# Frontend tests
cd resume-builder-ui && npm test
```

### Docker
```bash
# API container
docker build -t resume-api -f Dockerfile.dev.api .
docker run -p 5000:5000 resume-api

# Script container
docker build -t resume-script -f Dockerfile.dev.script .
```

## Key Architecture Details

### Data Flow
1. User uploads YAML file + optional icons via React frontend
2. Flask backend receives files, validates YAML structure
3. resume_generator.py processes YAML using Jinja2 templates
4. HTML is rendered with custom CSS styling
5. pdfkit converts HTML to PDF and returns to user

### Template System
- Templates are in templates/{template_name}/ directories
- Each template has base.html, styles.css, and component HTML files
- YAML structure defined by TypeScript interfaces in resume-builder-ui/src/types.ts
- Sample YAML files in samples/ directory show expected structure

### Section Types
The YAML resume format supports these section types:
- `text`: Single paragraph content
- `bulleted-list`: List with bullet points  
- `inline-list`: Comma-separated inline list
- `icon-list`: List items with optional icons (certifications)
- `dynamic-column-list`: Auto-adjusting column layout
- `experience`: Job history with company, title, dates, description
- `education`: Academic qualifications with degree, school, year

### Job Example Preview Images
- 26 job example pages show real template preview images served from Supabase Storage CDN
- See `docs/templates/PREVIEW-IMAGES.md` for the full runbook (generate, upload, add new examples)
- Scripts: `scripts/generate_example_previews.py` (YAML → PDF → WebP) and `scripts/upload_previews_to_supabase.py` (WebP → CDN)
- Images are in `docs/templates/examples/` (gitignored)

### Icon System
- Icons stored in icons/ directory
- Supported formats: PNG, JPG, SVG
- Icons referenced by filename in YAML (e.g., `icon: "company_google.png"`)
- Frontend allows icon upload during resume creation

### API Endpoints
- `GET /api/templates` - List available templates
- `GET /api/template/{id}` - Get template YAML data
- `POST /api/generate` - Generate PDF from YAML + icons
- `GET /api/template/{id}/download` - Download template YAML

### File Structure Notes
- app.py is the Flask app that serves the React frontend and handles API requests
- Templates use Jinja2 with custom functions like calculate_columns() for dynamic layouts

### Preview Hook Dependency Pattern
The `usePreview` hook follows React best practices for dependency arrays to ensure data freshness and prevent stale closures.
- Functions like `checkAndRefreshIfStale` include all reactive values they depend on, such as `previewUrl` and `isStale`.
- This prevents bugs where the function might operate on outdated state.
- Potential issues like re-renders are managed with request deduplication and memoization within the hook.
- See `usePreview.ts:390` for the implementation of `checkAndRefreshIfStale`.

### Ads Configuration

The app uses Google AdSense with two ad strategies:
- **Auto Ads**: Enabled by default, Google automatically places ads
- **Explicit Ads**: Manual ad placements in specific locations (disabled by default)

#### Enabling Explicit Ads

Explicit ads are controlled by the `VITE_ENABLE_EXPLICIT_ADS` environment variable (default: `false`).

**Before enabling, complete these steps:**

1. **Add page exclusions in AdSense** (to prevent double-ads from Auto Ads + Explicit):
   - Go to: AdSense → Ads → Auto ads → Excluded pages
   - Add exclusions for pages with explicit ads:
     - `/` (landing page)
     - `/templates`
     - `/blog`
     - `/blog/*`
     - `/editor/*`
     - `/free-resume-builder-no-sign-up`
     - `/ats-resume-templates`
     - `/resume-keywords`

2. **Set the environment variable in production**:
   ```bash
   VITE_ENABLE_EXPLICIT_ADS=true
   ```

3. **Monitor for a few days**:
   - Check ad density doesn't violate AdSense policies
   - Monitor revenue impact
   - Consider pausing any running experiments while testing

#### Ad Slot Reference

| Location | Slot ID | Ad Unit Name |
|----------|---------|--------------|
| Landing page (below stats) | `1232650916` | efr-landing-incontent |
| Free Resume Builder page | `3994545622` | efr-freepage-incontent |
| Templates Hub page | `6343391269` | efr-templates-incontent |
| Resume Keywords page | `9055300614` | efr-keywords-incontent |
| Blog index (in-feed) | `7742218947` | efr-blog-infeed |
| Template carousel (in-feed) | `3806186822` | efr-carousel-infeed |
| Editor sidebar | `3691293294` | efr-editor-sidebar |
| Mobile top (all non-editor pages) | `2808813237` | efr-mobile-top |


### Blog Page Update Checklist

When modifying a blog page (especially comparison/competitor pages), update the date in **both** places:
1. **`dateModified`** in the `generateComparisonSchema()` call inside the blog component (e.g., `ZetyVsEasyFreeResume.tsx`)
2. **`lastmod`** in `resume-builder-ui/src/data/sitemapUrls.ts` for the corresponding URL entry

The sitemap is regenerated during `npm run build`, but the source dates in `sitemapUrls.ts` are manual.

## Design System (2026 Revamp)

**`DESIGN.md` at the repo root is the single source of truth** — tokens, measured
contrast tables, typography, buttons, cards, effects, layout, the shared-component
list, the scroll-reveal system, and the page-revamp checklist all live there. Read it
before any visual change. What follows is only the handful of rules that are easy to
get wrong and expensive to get wrong.

The landing page (`LandingPage.tsx`) and `components/shared/` are the reference
implementations. Other pages are still being migrated to match.

### The rules worth inlining

- **Tokens, verbatim from `tailwind.config.js`** (the config is authoritative, not this
  file): `ink` `#0c0c0c`, `ink-light` `#1a1a1a`, `chalk` `#fafaf8`, `chalk-dark`
  `#f6f6f5`, `accent` `#00d47e`, `accent-text` `#007a48`. **There is no `mist` token
  and no `stone-warm`/`stone-warm-inverse` token** — muted/secondary text is opacity of
  an existing token (`text-ink/60`, `text-white/60`), not a standalone grey. The prior
  `stone-warm` pair (`#6b6761`/`#a8a4a0`) carried a taupe cast that clashed with the
  rest of the palette and was replaced for that reason — don't reintroduce a bespoke
  grey hex.

- **Muted text is surface-polarity-paired, and each value is only AA-valid against the
  polarity it was measured on. Never use one on the other's ground.** `text-ink/60` is
  for light grounds (Chalk / white / Chalk Dark: 5.09 / 5.16 / 5.01);
  `text-white/60` is for dark grounds (Ink / Ink Light / white-5%-over-Ink-Light:
  7.28 / 6.93 / 6.43). Swapping them fails AA in both directions.

- **`text-accent` is a fill color, not a text color, on light grounds** — `#00d47e`
  measures 1.87:1 on Chalk. Accent text under 24px and *every* focus ring use
  `text-accent-text` / `ring-accent-text` (5.18:1 on Chalk). The one exception: inside a
  `bg-ink` block `text-accent` measures 9.98:1 and is correct — which is why the mono
  eyebrows in dark closing-CTA blocks keep it. The ratio inverts with the ground, so
  this is never a safe find-replace in either direction.

- **Tailwind silently drops unknown utilities.** A typo'd or deleted token (`text-mist`)
  emits no CSS and fails no gate — not `tsc -b`, not `vitest`, not `npm run build`.
  Check a class against `tailwind.config.js` rather than against memory.

- **Section structure:** mono eyebrow → H2 → subtitle → `mb-12 md:mb-16` → content.

- **Type contrast is the system:** `font-extrabold` (800) headings against
  `font-extralight` (200) body. Nothing between 200 and 800 for editorial text.

- **Below-fold sections** pair `.cv-auto` with a `.cv-h-*` intrinsic-size hint, and wrap
  in `<RevealSection>` — marketing surfaces only, never the editor or my-resumes.

- **`overflow: clip`, not `overflow: hidden`,** on layout containers; `hidden` silently
  creates a scroll container and has broken this app's flex layout before.

## SEO/GEO Governance

Before making ANY change that affects SEO (titles, meta tags, schema, URLs, H1s, new pages, page deletions, route changes):

1. Read `seo-tracking/strategy.md` for current priorities (P0-P4)
2. Check `seo-tracking/protected-pages.md` — Tier 1 pages require owner sign-off before modification
3. Check `seo-tracking/changelog.md` — do not modify pages with recent changes that haven't activated yet (allow 2-4 weeks)
4. Check `seo-tracking/mistakes-learned.md` — avoid repeating past errors
5. Log all changes in `seo-tracking/changelog.md` with: date, what changed, files modified, reason, GSC stats at time of change
6. If adding/changing a URL: verify it's in the sitemap, not a redirect source, and accessible via direct server request
7. Entity signals (sameAs arrays) must stay in sync across: index.html (WebApplication + Organization), schemaGenerators.ts (SoftwareApplication), Footer.tsx
8. Brand name "EasyFreeResume" must always appear first in title tags — never at the end

The `seo-tracking/` directory is the single source of truth. Do not rely on memory.

### SEO Tracking Directory

All SEO/GEO tracking lives in `seo-tracking/` at the repo root (gitignored, not committed).

**Files:**
- `changelog.md` — Running log of every SEO change (read before making changes)
- `gsc-snapshots.md` — Weekly GSC stats snapshots
- `protected-pages.md` — Pages that must NOT be changed without explicit approval
- `strategy.md` — SEO/GEO priorities and planned work
- `mistakes-learned.md` — SEO mistakes log; check before repeating past errors

### Sitemap Rules

When editing `sitemapUrls.ts`:
- Cross-check new URLs against the redirect list in `App.tsx` (~line 680-692) and `app.py` redirects
- If the URL is a redirect source, use the destination URL instead
- Update `lastmod` to today's date for any URL whose content was modified
- Never remove a URL from the sitemap without checking its GSC performance first

### robots.txt — served from GCS, NOT the repo

Production `/robots.txt` is a **Cloudflare 301 redirect to a Google Cloud Storage bucket object**: `gs://easyfreeresume-static/robots/robots.txt` (public URL: `https://storage.googleapis.com/easyfreeresume-static/robots/robots.txt`). The redirect rule lives in Cloudflare — there is no reference to it anywhere in the repo.

- **Editing `resume-builder-ui/public/robots.txt` does NOTHING in production** — Cloudflare intercepts `/robots.txt` before it reaches the app. Keep the repo file in sync as documentation of intent, but the repo change is inert.
- **To actually change prod robots.txt:** update the GCS bucket object (owner/infra with account access), uploading as public-read in one step so it never has a private window: `gsutil -h "Content-Type:text/plain" cp -a public-read robots.txt gs://easyfreeresume-static/robots/robots.txt`.
  - **Gotcha 1 — ACL:** a plain `gsutil cp` (without `-a public-read`) overwrites the object as **private**, so anonymous reads then 403 (which would take `/robots.txt` down site-wide once the edge cache lapses). The `-a public-read` flag above prevents this; if you already ran a plain `cp`, re-apply public read: `gsutil acl ch -u AllUsers:R gs://easyfreeresume-static/robots/robots.txt`.
  - **Gotcha 2 — cache:** the object serves with `Cache-Control: public, max-age=3600`, cached by Google's edge and Cloudflare. Purge the Cloudflare cache for `/robots.txt` to go live immediately; otherwise expect up to ~1h lag.
  - **Verify at origin (bypasses cache):** `curl -sS -w "%{http_code}\n" "https://storage.googleapis.com/easyfreeresume-static/robots/robots.txt?v=$RANDOM"` → expect `200` and the new content.
- By contrast, `/llms.txt` and `/sitemap.xml` **are** served from the app, so repo edits to those take effect on deploy.

### Weekly SEO Review Protocol

1. Export GSC data to `SearchConsole/{YYYY-MM-DD}/`
2. Add snapshot to `gsc-snapshots.md`
3. Compare to prior week — flag pages that dropped >5 positions
4. Update `protected-pages.md` if new pages crossed threshold
5. Review open items in `strategy.md`

# Repo workflow

## Git commit style
- Make **small, atomic commits** (one logical change per commit).
- After each completed subtask: run relevant tests, stage only related files, commit.
- If changes touch multiple concerns, **split into multiple commits** (do not bundle).

## Commit message format
- Use: <type>(<scope>): <imperative summary>
- Types: feat, fix, refactor, perf, test, docs, chore
- Summary: present tense, <= ~72 chars.


When responding to me: Be extremely concise and sacrifice grammar for sake of concision. 