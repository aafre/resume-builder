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

The landing page, header, and footer have been revamped with a modern design language. **All other pages should be migrated to match.** Reference the landing page (`LandingPage.tsx`) and shared components (`components/shared/`) as the source of truth.

### Design Philosophy
- **Light-dominant minimalism** — chalk backgrounds, generous whitespace, no visual clutter
- **Extreme type contrast** — `font-extrabold` (800) headings vs `font-extralight` (200) body text
- **Accent sparingly** — green (`#00d47e`) only for CTAs, hover states, and highlights — never for large surfaces
- **Soft depth** — multi-layer shadows and subtle borders (`black/[0.06]`) instead of hard lines
- **Rounded everywhere** — minimum `rounded-lg`, cards use `rounded-2xl` or `rounded-3xl`
- **Hover lifts** — interactive elements lift (`-translate-y-0.5` buttons, `-translate-y-1` cards)
- **Scroll-triggered reveals** — all below-fold sections fade in via `<RevealSection>`

### Color Tokens (tailwind.config.js)

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | `#0c0c0c` | Primary text, headings |
| `ink-light` | `#1a1a1a` | Dark surfaces (demo chrome) |
| `chalk` | `#fafaf8` | Page/section backgrounds |
| `chalk-dark` | `#f0efe9` | Alternate surface (cards, footer) |
| `stone-warm` | `#8a8680` | Body text, subtitles |
| `mist` | `#a8a4a0` | Tertiary/muted text |
| `accent` | `#00d47e` | CTAs, highlights, badges |

Standard Tailwind `gray-{200,300,600}` for borders and secondary text. Avoid introducing new brand colors.

### Typography

| Element | Classes |
|---------|---------|
| **Hero H1** | `font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-ink` |
| **Section H2** | `font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink` |
| **Card H3** | `font-display text-xl font-bold text-ink` |
| **Body paragraph** | `font-display text-lg md:text-xl font-extralight text-stone-warm leading-relaxed` |
| **Mono label** (section eyebrow) | `font-mono text-xs tracking-[0.15em] text-accent uppercase` |
| **Meta/small text** | `text-sm text-stone-warm` |

### Button System (defined in styles.css)

| Class | Style | Usage |
|-------|-------|-------|
| `.btn-primary` | Green bg, bold, rounded-xl, shimmer hover, shadow-lg | Primary CTAs |
| `.btn-secondary` | White bg, gray border, rounded-xl, shadow-sm | Secondary actions |
| `.btn-ghost` | No bg, hover:bg-black/5, rounded-lg | Tertiary/nav links |

Sizes: `py-3.5 px-8` (default), `py-4 px-10` (hero), `py-2.5 px-5` (compact/header).

### Card Patterns

- **Feature card:** `bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300`
- **Resource card:** `bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300`
- **Template card:** `bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border-2 border-gray-200 hover:border-accent/30`

### Visual Effects (defined in styles.css)

- **`.glass`** — `bg-white/80 backdrop-blur-xl border-white/40 shadow-xl` (header, overlays)
- **`.card-gradient-border`** — subtle accent gradient border via mask composite
- **`.shadow-premium`** — 4-layer shadow for realistic depth; hover adds accent glow
- **`.bg-grain`** — optional subtle dot texture overlay

### Scroll-Reveal System

Wrap below-fold sections with `<RevealSection variant="fade-up">`. Options: `fade-up`, `fade-in`, `scale-in`, `fade-left`. Add `stagger` prop for grids. CSS in `styles.css`, hook in `useScrollReveal.ts`. Observer: 15% threshold, fires once.

### Layout Patterns

| Pattern | Classes |
|---------|---------|
| **Section outer** | `py-12 md:py-20 px-4 sm:px-6 lg:px-8` |
| **Section inner** | `max-w-6xl mx-auto` (wide) / `max-w-4xl mx-auto` (narrow) / `max-w-3xl mx-auto` (text-focused) |
| **Section heading block** | Mono eyebrow label → H2 → subtitle paragraph → `mb-12 md:mb-16` gap to content |
| **Grid** | `grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12` |
| **Stats row** | Flex with `sm:divide-x sm:divide-ink/10` dividers |

### Dark Accent Section (Final CTA pattern)
```jsx
<div className="bg-ink rounded-3xl py-20 px-6 text-center relative overflow-hidden">
  {/* Radial accent glow */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />
  {/* White text, accent CTA button */}
</div>
```

### Shared Components (components/shared/)

Use these instead of building one-off equivalents:
- `PageHero` — H1 hero with breadcrumbs, subtitle, CTA
- `RevealSection` — scroll-triggered entrance animation wrapper
- `FAQSection` — animated accordion with grid expand
- `FeatureGrid` — numbered feature list with gradient borders
- `StepByStep` — numbered step-by-step walkthrough
- `ProofSection` — social proof / stats display
- `SEOPageLayout` — standard layout shell for SEO landing pages
- `ComparisonTable` — feature comparison table
- `DownloadCTA` — call-to-action block for downloads
- `BreadcrumbsWithSchema` — breadcrumbs with JSON-LD

### Transition Defaults
- **Standard:** `transition-all duration-300`
- **Slow glass:** `transition-all duration-500`
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for scroll-reveal and premium shadows
- **Reduced motion:** All animations/transitions disabled via `@media (prefers-reduced-motion: reduce)` in styles.css

### Page Revamp Checklist

When revamping a page to the new design system:
1. Replace hardcoded `font-family` / system font stacks with `font-display` or default (now Bricolage Grotesque via `font-sans`)
2. Replace color literals with design tokens (`text-ink`, `bg-chalk`, `text-stone-warm`, `text-accent`)
3. Replace button styles with `.btn-primary` / `.btn-secondary` / `.btn-ghost`
4. Use `<RevealSection>` for below-fold sections
5. Use shared components (`PageHero`, `FAQSection`, etc.) where applicable
6. Follow section structure: mono eyebrow → H2 → subtitle → content
7. Ensure `rounded-xl`+ on all cards/containers (no sharp corners)
8. Add hover lifts and transitions to interactive elements
9. Test reduced motion — verify content is visible without animation

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