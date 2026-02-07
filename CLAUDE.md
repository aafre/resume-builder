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

### Job Search Engine
The job search uses a 3-tier progressive broadening strategy (Tier 1: primary query → Tier 2: synonym expansion → Tier 3: AI fallback) with 0-100 scoring against the user's resume. Skill queries (e.g. "python") are auto-detected and broadened to search descriptions. See **[docs/features/JOB_SEARCH_FLOW.md](docs/features/JOB_SEARCH_FLOW.md)** for the full flowchart and scoring breakdown.

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

# Repo workflow

## Git commit style
- Make **small, atomic commits** (one logical change per commit).
- After each completed subtask: run relevant tests, stage only related files, commit.
- If changes touch multiple concerns, **split into multiple commits** (do not bundle).

## Commit message format
- Use: <type>(<scope>): <imperative summary>
- Types: feat, fix, refactor, perf, test, docs, chore
- Summary: present tense, <= ~72 chars.