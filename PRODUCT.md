# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

EasyFreeResume serves three audiences, **weighted equally** — no single one is the primary persona, and design decisions are made per surface rather than around one person:

1. **The cold, skeptical search visitor.** Arrives from Google having been burned by a "free" builder that paywalled the download. Must be convinced the product is genuinely free before investing effort, then reach a finished PDF quickly.
2. **The entry-level / first-resume writer.** Student, career-starter, career-changer, or returner with sparse material and no reference for what good looks like. Needs structure, examples, and guardrails more than speed.
3. **The mid-career ATS tailorer.** Already has a resume and is adapting it per job posting. Cares about keyword coverage and ATS pass rate. The editor + keyword scanner loop is their core workflow.

Acquisition-side segments (students, veterans, IT professionals, nurses) have dedicated landing pages. These are search entry points, not separate product personas.

## Product Purpose

Create professional, ATS-friendly resumes in minutes, free, with no paywall at the download step. Success is a completed PDF in the user's hands — the download is the conversion event, not a signup or an upgrade.

## Positioning

**Actually free, verified at the download step.** The category norm is a free editor with a paid export; EasyFreeResume's differentiator is that the resume is generated and downloaded without payment, and without an account being required. The product is monetized by ads, not by gating the user's own document — a claim competitors structurally cannot copy without abandoning their revenue model.

Secondary differentiators: local-first data handling (the resume lives on the user's device unless they choose otherwise), YAML export so the user can take their data and leave, and server-side PDF generation from HTML/CSS templates that keeps output text-based and machine-parseable.

## Operating Context

- **Anonymous by default.** Users can build and download a resume with no account at all.
- **Optional accounts.** Signing in (Supabase auth) lets a user find their previous resumes and save **up to 5 versions / distinct resumes** in free cloud storage. Accounts are an unlock, never a gate on the core build-and-download path.
- **Core surfaces:** landing page (`/`), templates hub (`/templates`), the editor (`/editor`, `/editor/:resumeId`), saved resumes (`/my-resumes`), keyword scanner (`/resume-keyword-scanner`), job/role example pages, and a large SEO content layer (~50 blog posts, comparison pages, keyword pages, jobs matrix).
- **Traffic is search-dominant.** Most sessions begin on an SEO landing or blog page, not the home page. Entry is lateral and cold.
- **Real usage scene:** a job seeker under time pressure, often on mobile, frequently mid-application. Interruption and return are normal.

## Capabilities and Constraints

**Capabilities**
- Visual section-based resume editor (no YAML editing required); drag-to-reorder sections; auto-save; rich-text fields.
- Section types: `text`, `bulleted-list`, `inline-list`, `icon-list`, `dynamic-column-list`, `experience`, `education`.
- Four shipped templates: Professional (`classic-alex-rivera`), Elegant (`classic-jane-doe`), Minimalist (`modern-no-icons`), Modern (`modern-with-icons`).
- Custom icon upload (PNG/JPG/SVG).
- YAML import/export — the user's data is portable in and out.
- Client-side keyword scanner comparing a resume against a job description.
- Live preview of the generated resume.

**Technical constraints**
- PDF is generated server-side (Flask + Jinja2 + pdfkit) from HTML/CSS templates — the editor's visual language and the PDF's visual language are separate systems and must not be conflated.
- Frontend is React 18 + TypeScript + Vite + Tailwind; the design system is documented in `CLAUDE.md` ("Design System (2026 Revamp)") with tokens in `tailwind.config.js`.
- SEO pages are prerendered; Core Web Vitals (especially LCP and CLS) are actively monitored and have historically been regressed by layout and ad changes.

**Binding constraints — all future design work must preserve these**
- **AdSense placements are load-bearing.** Ads are the revenue that makes "actually free" possible. Slot inventory must stay intact; removing, burying, or shrinking units is a business decision, not a design one. Slot reference is in `CLAUDE.md`.
- **SEO governance in `seo-tracking/` is authoritative.** Titles, H1s, meta, schema, and URLs are governed. Tier-1 pages require owner sign-off. Design cannot change them unilaterally. Read `seo-tracking/strategy.md`, `protected-pages.md`, `changelog.md`, and `mistakes-learned.md` before any SEO-affecting change, and log changes afterward.
- **ATS-safe PDF output.** Generated PDFs must stay machine-parseable. Visual ambition in resume templates is capped by what ATS parsers survive — no multi-column tricks, images-as-text, or exotic glyphs in the output document.
- **WCAG 2.2 AA.** Accessibility is held to a stated standard, not best-effort.

**Undecided / not established**
- Whether a paid tier exists in future. No pricing, licensing, or premium capability is confirmed — do not imply one.

## Brand Commitments

- Name is **EasyFreeResume**, one word. In title tags the brand name must always appear **first**, never trailing.
- Public promise, used across marketing surfaces: **"No sign-up. No tracking. 100% free."** Design must not contradict it. Note the nuance that copy must respect: sign-up is *optional and additive*, and analytics (PostHog) exist in a privacy-conscious configuration — claims must stay accurate to what the product actually does.
- Live product: `https://easyfreeresume.com`. Repo: `github.com/aafre/resume-builder`.
- Design language is the documented 2026 revamp: light-dominant minimalism, chalk backgrounds, extreme type contrast (`font-extrabold` headings vs `font-extralight` body), green `#00d47e` accent used sparingly, soft multi-layer depth, rounded surfaces, scroll-triggered reveals. Tokens: `ink`, `ink-light`, `chalk`, `chalk-dark`, `stone-warm`, `mist`, `accent`. The landing page, header, and footer are the reference implementation; other pages are explicitly slated to be migrated to match.

## Evidence on Hand

- **Real product screenshots / template previews:** `docs/templates/*.png`, plus 26 job-example previews served from Supabase Storage CDN (runbook: `docs/templates/PREVIEW-IMAGES.md`).
- **Real search performance data:** Google Search Console exports in `SearchConsole/` and snapshots in `seo-tracking/gsc-snapshots.md`.
- **Real revenue data:** AdSense reporting (`scripts/adsense_report.py`).
- **Real usage analytics:** PostHog (recently added).
- **Working sample resumes:** `samples/classic/`, `samples/modern/`.
- **Absent — must not be fabricated:** named customers, testimonials, user counts, review quotes, awards, press mentions, funding, team size, and any pricing or premium tier. If a surface needs social proof, it must come from something real (GitHub stars, template count, GSC-verifiable traffic) or be omitted.

## Product Principles

1. **The download is never held hostage.** Any flow that makes a user feel they might hit a paywall or a forced signup before getting their PDF is a product failure, regardless of how it looks.
2. **Accounts add, never gate.** Every core capability works anonymously. Sign-in earns its place by offering something extra (finding past work, 5 cloud-saved versions), and is offered where that value is obvious rather than at the entrance.
3. **The visitor arrives cold and lateral.** Most sessions do not start at the home page. Every surface must independently establish what this is, that it's free, and where to start.
4. **Free is paid for by ads — respect both sides.** Ad inventory is protected, and ads must never degrade the build-and-download path or the Core Web Vitals that carry the search traffic funding it.
5. **The PDF is the product; the UI is the workshop.** Editor and template design serve output quality and ATS survivability. Expressive design belongs in the marketing and content surfaces, not in the generated document.

## Accessibility & Inclusion

WCAG 2.2 AA is the required standard, confirmed as binding. Practical implications for this product: keyboard-operable editor including drag-to-reorder alternatives, visible focus states, contrast that survives the light-dominant palette (particularly `stone-warm` and `mist` on `chalk`), respect for `prefers-reduced-motion` across the scroll-reveal system, and correct labeling on the resume form controls.
