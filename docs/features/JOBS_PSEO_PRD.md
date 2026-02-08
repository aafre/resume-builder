# PRD: Jobs pSEO & Search Engine Improvements — EasyFreeResume.com

**Author:** Amit (VP Software Engineering)
**Date:** 8 February 2026
**Status:** Draft v2 — SEO-hardened
**Stack:** Flask (Python) backend · React/Vite frontend · Docker · Supabase · Adzuna API (affiliate)

---

## 1. Executive Summary

Build programmatic SEO (pSEO) landing pages for job search across role × location combinations, improve the existing job search engine, and maximise AdSense + Adzuna affiliate revenue. The goal is to go from a single client-side `/jobs` route (invisible to Google) to **2,000+ indexable, server-rendered pages** targeting long-tail "{role} jobs in {city}" queries.

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (90 days post-launch) |
|------|--------|------------------------------|
| Organic traffic to job pages | Google Search Console clicks | 5,000+ clicks/month |
| Indexed job pages | GSC Coverage report | 80%+ of generated pages indexed |
| Adzuna affiliate revenue | Click-throughs to Adzuna | 3%+ CTR on job listings |
| AdSense revenue from job pages | RPM on `/jobs/*` routes | Match or exceed site average RPM |
| SEO health | Core Web Vitals (CWV) | All pages pass CWV on mobile |

---

## 3. Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │          Googlebot / User        │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │        Flask (app.py)            │
                    │   serve() catch-all handler      │
                    └──────────────┬──────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
   ┌──────────▼─────────┐  ┌──────▼───────┐  ┌─────────▼────────┐
   │  Bot / First Load   │  │  SPA Client  │  │  API Endpoints   │
   │  → SSR HTML shell   │  │  → React app │  │  POST /api/jobs  │
   │  (pre-rendered)     │  │  (hydrates)  │  │  GET /api/jobs   │
   └──────────┬──────────┘  └──────────────┘  └────────┬─────────┘
              │                                         │
   ┌──────────▼──────────┐                   ┌─────────▼─────────┐
   │  Static HTML Cache  │                   │   job_engine.py   │
   │  (filesystem/Redis) │                   │   3-tier search   │
   └─────────────────────┘                   └─────────┬─────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │   Adzuna API    │
                                              └─────────────────┘
```

---

## 4. Feature Requirements

---

### FEATURE 1: Role × Location Matrix Generator

**What:** A Python script/module that generates the canonical list of all pSEO page combinations.

**Why:** This is the seed data that drives everything — URL generation, sitemap, internal linking, and page rendering.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F1.1 | Produce a list of `(slug, display_title, location_slug, location_display)` tuples | P0 |
| F1.2 | Roles sourced from `TITLE_SYNONYMS` keys in `job_engine.py` (~120 entries) | P0 |
| F1.3 | Locations: Top 20 UK cities + "remote" (see Appendix A) | P0 |
| F1.4 | Generate URL-safe slugs: `software-engineer`, `london` (lowercase, hyphens, no special chars) | P0 |
| F1.5 | Support a "remote" pseudo-location with no city geo-filter | P0 |
| F1.6 | Output as JSON file (`jobs_matrix.json`) importable by both backend and frontend | P0 |
| F1.7 | Include related roles per entry (from `TITLE_SYNONYMS` values) for internal linking | P1 |
| F1.8 | Include related locations (nearest 3 cities by geography) per entry for internal linking | P1 |
| F1.9 | Script is idempotent — re-running produces identical output unless source tables change | P0 |

#### Acceptance Criteria

- [ ] Running `python generate_jobs_matrix.py` produces `jobs_matrix.json` with 2,400+ entries
- [ ] Every entry has: `role_slug`, `role_display`, `location_slug`, `location_display`, `related_roles[]`, `related_locations[]`
- [ ] No duplicate slug combinations
- [ ] All slugs are URL-safe (regex: `^[a-z0-9]+(-[a-z0-9]+)*$`)
- [ ] "remote" location entries have `location_slug: "remote"` and `location_display: "Remote"`
- [ ] JSON is valid and parseable by both Python and JS

---

### FEATURE 2: Server-Side Rendered pSEO Pages

**What:** Flask serves fully-rendered HTML for `/jobs/{role-slug}/{location-slug}` routes on first load and to bots, with React hydration for interactivity.

**Why:** The current SPA is invisible to Google. Server-rendered HTML with structured data is essential for indexing.

#### URL Structure

```
/jobs                                  → Main jobs hub page (existing, enhanced)
/jobs/software-engineer                → Role hub (all locations)
/jobs/software-engineer/london         → Role + Location landing page (primary pSEO target)
/jobs/remote/python-developer          → Remote variant
```

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F2.1 | Flask `serve()` handler detects `/jobs/{role}/{location}` routes and serves pre-rendered HTML | P0 |
| F2.2 | Pre-rendered HTML contains: H1, meta description, OG tags, canonical URL, structured data, first 15-20 job listings, intro copy, internal links, ad placeholders | P0 |
| F2.3 | HTML is generated at build time (static file per page) OR on first request with caching (TTL: 4-6 hours) | P0 |
| F2.4 | Bot detection (`Googlebot`, `bingbot`, etc.) always gets the static HTML, never a blank SPA shell | P0 |
| F2.5 | Human users get the same HTML shell, with React hydrating on top for interactivity (search, filters, pagination) | P0 |
| F2.6 | Return HTTP 200 for valid matrix combinations, 404 for invalid slugs | P0 |
| F2.7 | Each page loads in < 3 seconds on 3G (LCP target) | P1 |
| F2.8 | Pages work without JavaScript (job listings visible, links clickable) | P1 |
| F2.9 | Flask caches rendered HTML on filesystem (`/app/cache/jobs/`) with a background refresh mechanism | P1 |
| F2.10 | Cache invalidation: triggered by re-deployment OR manual endpoint `POST /api/admin/clear-jobs-cache` | P1 |

#### Page Content Specification

Each `/jobs/{role}/{location}` page MUST contain:

```
┌──────────────────────────────────────────────┐
│  <head>                                       │
│    <title>                                    │
│      DYNAMIC — see Title Strategy below       │
│    </title>                                   │
│    <meta name="description" content="...">    │
│    <link rel="canonical" href="...">          │
│    <link rel="prev/next" ...>  (if paginated) │
│    <script type="application/ld+json">        │
│      WebPage + JobPosting[] structured data    │
│    </script>                                  │
│    Open Graph + Twitter Card tags             │
│  </head>                                      │
├──────────────────────────────────────────────┤
│  [Breadcrumb: Home > Jobs > {Role} > {Loc}]  │
│  (rendered as <ol> with <li> + <a> links,    │
│   NOT visual-only text)                       │
├──────────────────────────────────────────────┤
│  <h1>{Role} Jobs in {Location}</h1>           │
│                                               │
│  <p>2-3 sentence intro (templated + unique    │
│  per role category, NOT identical across      │
│  all pages)</p>                                │
│                                               │
│  <p>Salary insight: "Average {Role} salary    │
│  in {Location}: £X–£Y based on N listings"</p>│
├──────────────────────────────────────────────┤
│  [AdSense ad unit — horizontal/leaderboard]   │
├──────────────────────────────────────────────┤
│  <h2>Latest {Role} Jobs</h2>                  │
│                                               │
│  [Job Card 1 — server-rendered]               │
│  [Job Card 2]                                 │
│  ...                                          │
│  [Job Card 15-20]                             │
│                                               │
│  [In-feed AdSense unit after every 5th card]  │
│                                               │
│  [Load More / Pagination — requires JS]       │
├──────────────────────────────────────────────┤
│  <h2>Key Skills for {Role}</h2>               │
│  <p>Paragraph listing common skills from      │
│  job descriptions (aggregated server-side)</p> │
├──────────────────────────────────────────────┤
│  <h2>Related Roles</h2>                       │
│  [Internal links to related role pages]       │
│                                               │
│  <h2>{Role} Jobs in Other Cities</h2>         │
│  [Internal links to same role, other locs]    │
├──────────────────────────────────────────────┤
│  [AdSense ad unit — bottom]                   │
├──────────────────────────────────────────────┤
│  <h2>FAQ</h2>                                 │
│  [3-4 FAQ items with FAQPage structured data] │
│  - "How many {role} jobs are in {location}?"  │
│  - "What is the average {role} salary in      │
│    {location}?"                                │
│  - "What skills do I need for {role}?"        │
│  - "How to write a {role} resume?"            │
│    (links to /templates)                      │
├──────────────────────────────────────────────┤
│  [Footer with site-wide links]                │
└──────────────────────────────────────────────┘
```

#### Title Strategy (Doorway Page Risk Mitigation)

Static `{Role} Jobs in {Location}` titles look templated to Google. Titles MUST include dynamic data to prove the page has real, unique content.

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.11 | `<title>` includes live job count: e.g., `15+ Python Developer Jobs in London` | P0 |
| F2.12 | `<title>` includes current month/year: e.g., `(Feb 2026)` | P0 |
| F2.13 | `<title>` includes a value hook when salary data exists: `| Salary & Market Data` | P1 |
| F2.14 | Title is re-generated on every cache refresh so count stays current | P0 |

**Title format:**
```
{count}+ {Role} Jobs in {Location} ({Mon YYYY}) | Salary & Market Data — EasyFreeResume
```

**Example:**
```
15+ Python Developer Jobs in London (Feb 2026) | Salary & Market Data — EasyFreeResume
```

**Fallback (low count):**
```
Python Developer Jobs in London (Feb 2026) — EasyFreeResume
```
(Omit count if < 3 to avoid "1+ jobs" looking thin.)

#### Zero-Result Page Handling

This is the single biggest technical SEO risk for pSEO job boards. An empty page with just template text = doorway page penalty.

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.15 | When primary query returns 0 exact results, apply fallback cascade (see below) | P0 |
| F2.16 | If ALL fallbacks return 0 results, inject `<meta name="robots" content="noindex, follow">` | P0 |
| F2.17 | noindex pages still render internal links (Google follows them to valid pages) | P0 |
| F2.18 | noindex pages show user-friendly message: "No {role} jobs in {location} right now. Here are related opportunities:" | P0 |

**Zero-result fallback cascade:**
```
Step 1: Search "{role}" in {location}              → 0 results
Step 2: Search "{role}" in {region} (broader geo)  → 0 results
Step 3: Search "{role}" nationwide + remote         → 0 results
Step 4: Search "{broad_category_role}" in {location} → 0 results
Step 5: All failed → render noindex page with internal links only
```

**Example:** "Rust Developer in Newcastle" → 0 results
```
Fallback 1: "Rust Developer" in North East     → found 3 → show these
Fallback 2: "Rust Developer" remote/nationwide  → (skipped, F1 found results)
Fallback 3: "Backend Developer" in Newcastle    → (skipped)
```

The page clearly labels fallback results: "Showing Rust Developer jobs in the North East" — no deception.

#### Pagination & Canonical Strategy

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.19 | Page 1 canonical points to self: `/jobs/python/london` (no `?page=1`) | P0 |
| F2.20 | Page 2+ canonical points to self: `/jobs/python/london?page=2` | P0 |
| F2.21 | Do NOT canonicalise page 2 back to page 1 (Google will ignore page 2 content) | P0 |
| F2.22 | Add `<link rel="prev">` and `<link rel="next">` in `<head>` for paginated series | P0 |
| F2.23 | Page 1 has `<link rel="next" href="/jobs/python/london?page=2">` only (no prev) | P0 |
| F2.24 | Last page has `<link rel="prev" ...>` only (no next) | P0 |

**Example `<head>` for page 2:**
```html
<link rel="canonical" href="https://easyfreeresume.com/jobs/python/london?page=2">
<link rel="prev" href="https://easyfreeresume.com/jobs/python/london">
<link rel="next" href="https://easyfreeresume.com/jobs/python/london?page=3">
```

#### SSR Request Lifecycle

```
Request: GET /jobs/python/london
         │
         ▼
  ┌─────────────────┐
  │  Flask serve()   │
  │  Match route     │
  │  Validate slugs  │
  └────────┬────────┘
           │
    ┌──────▼──────┐
    │ Cache check  │──── HIT ──→ Serve HTML (< 20ms)
    │ (filesystem) │
    └──────┬──────┘
           │ MISS
           ▼
  ┌─────────────────┐
  │  job_engine.py   │
  │  Fetch Adzuna    │
  │  + salary stats  │
  │  + skill aggr.   │
  └────────┬────────┘
           │
    ┌──────▼──────┐
    │  Jinja2      │
    │  Render HTML │
    │  + JSON-LD   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Write cache │
    │  (TTL: 6h)   │
    └──────┬──────┘
           │
           ▼
    Serve HTML to user
           │
           ▼
    React hydrates
    (interactive elements only,
     no re-fetch of job list)
```

#### Acceptance Criteria

- [ ] `curl -s -o /dev/null -w "%{http_code}" https://easyfreeresume.com/jobs/software-engineer/london` returns `200`
- [ ] `curl https://easyfreeresume.com/jobs/software-engineer/london` returns HTML with visible job listings (not empty SPA shell)
- [ ] `curl https://easyfreeresume.com/jobs/invalid-role/london` returns `404`
- [ ] HTML `<title>` contains live job count AND current month: e.g., `15+ Software Engineer Jobs in London (Feb 2026)`
- [ ] HTML contains `<h1>Software Engineer Jobs in London</h1>` (not rendered via JS)
- [ ] HTML contains `<script type="application/ld+json">` with valid `JobPosting` schema
- [ ] HTML contains `<link rel="canonical" href="https://easyfreeresume.com/jobs/software-engineer/london">`
- [ ] Page 2 URL (`?page=2`) has `canonical` pointing to SELF, not back to page 1
- [ ] Page 2 has `<link rel="prev">` and `<link rel="next">` in `<head>`
- [ ] Page has unique `<meta name="description">` (not duplicated across pages)
- [ ] Breadcrumb is rendered as `<ol>` with `<li>` + `<a>` links (not visual-only text), with `BreadcrumbList` schema
- [ ] At least 10 job listings visible in raw HTML response
- [ ] Internal links to 3+ related roles and 3+ other locations present in HTML
- [ ] Each spoke page links UP to its role hub (`/jobs/software-engineer`)
- [ ] AdSense ad container divs present in HTML (populated client-side is fine)
- [ ] FAQ section present with `FAQPage` structured data
- [ ] Google Rich Results Test passes for `JobPosting`, `FAQPage`, and `BreadcrumbList` schemas
- [ ] Lighthouse Performance score ≥ 70 on mobile
- [ ] **Zero-result test:** Page for a niche role with 0 Adzuna results → shows fallback jobs from broader geo/role
- [ ] **Zero-result test:** Page where ALL fallbacks return 0 → has `<meta name="robots" content="noindex, follow">` AND internal links still rendered
- [ ] **Cache refresh test:** Title job count updates after cache refresh (not stale from initial render)

---

### FEATURE 3: Structured Data (Schema.org)

**What:** JSON-LD structured data on every pSEO page for rich results in Google.

**Why:** `JobPosting` schema enables rich job snippets in search. `FAQPage` schema can trigger FAQ rich results. Both increase CTR significantly.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F3.1 | Each job listing includes `JobPosting` structured data | P0 |
| F3.2 | Page-level `WebPage` schema with `BreadcrumbList` | P0 |
| F3.3 | FAQ section uses `FAQPage` schema | P0 |
| F3.4 | All schema validates against Google Rich Results Test | P0 |
| F3.5 | `JobPosting` includes: title, description (truncated), datePosted, hiringOrganization, jobLocation, baseSalary (when available), employmentType, directApply URL | P0 |
| F3.6 | `baseSalary` only included when salary data is real (not predicted) | P1 |
| F3.7 | **`validThrough`** set to 30 days after `datePosted`, or Adzuna expiration date if available | P0 |
| F3.8 | When a job's `validThrough` has passed, remove its `JobPosting` schema from the JSON-LD (HTML card can remain as "Expired" but schema must not be present) | P0 |
| F3.9 | On cache refresh, expired job schemas are automatically pruned | P0 |

#### JobPosting Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Python Developer",
  "description": "First 200 chars of description...",
  "datePosted": "2026-02-05",
  "validThrough": "2026-03-07",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme Corp"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "GBP",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 55000,
      "maxValue": 75000,
      "unitText": "YEAR"
    }
  },
  "employmentType": "FULL_TIME",
  "url": "https://www.adzuna.co.uk/jobs/details/..."
}
```

#### Acceptance Criteria

- [ ] Every job card in server-rendered HTML has a corresponding `JobPosting` entry in JSON-LD
- [ ] Google Rich Results Test: 0 errors for any sample pSEO page
- [ ] `datePosted` matches Adzuna `created` field (ISO 8601 date only, no time)
- [ ] **`validThrough` is present on every `JobPosting`** and set to `datePosted + 30 days`
- [ ] **Job older than `validThrough`** → its `JobPosting` schema removed from JSON-LD on next cache refresh
- [ ] `baseSalary` only present when `salary_is_predicted == false`
- [ ] `url` points to the actual Adzuna job URL (affiliate link)
- [ ] FAQPage schema validates with 3-4 Q&A pairs

---

### FEATURE 4: Dynamic Sitemap Generation

**What:** Auto-generated `sitemap-jobs.xml` covering all pSEO pages, referenced from the main `sitemap.xml` index.

**Why:** Google discovers pages via sitemaps. 2,400 pages need to be in the sitemap to ensure crawling.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F4.1 | Generate `sitemap-jobs.xml` from `jobs_matrix.json` | P0 |
| F4.2 | Each entry includes `<loc>`, `<lastmod>`, `<changefreq>weekly` | P0 |
| F4.3 | **Dynamic `<priority>` based on job inventory** (not static 0.7 for all) | P0 |
| F4.4 | Main `sitemap.xml` (or sitemap index) references `sitemap-jobs.xml` | P0 |
| F4.5 | Sitemap served by Flask at `/sitemap-jobs.xml` | P0 |
| F4.6 | `<lastmod>` reflects the cache generation date (when jobs were last fetched) | P1 |
| F4.7 | Sitemap regenerated automatically when `jobs_matrix.json` changes | P1 |
| F4.8 | If total URLs exceed 50,000, split into multiple sitemap files with sitemap index | P2 |
| F4.9 | Pages with `<meta name="robots" content="noindex">` (zero-result pages) are excluded from sitemap | P0 |

#### Dynamic Priority Rules

| Job Inventory | Priority | Rationale |
|---------------|----------|-----------|
| 50+ jobs | `0.9` | High-value pages, direct Googlebot here first |
| 10–49 jobs | `0.7` | Solid pages worth crawling |
| 1–9 jobs | `0.5` | Low but still valid |
| 0 jobs (noindex) | EXCLUDED | Don't waste crawl budget |

Priority is recalculated on every sitemap regeneration using cached job counts.

#### Acceptance Criteria

- [ ] `GET /sitemap-jobs.xml` returns valid XML sitemap
- [ ] Sitemap contains URLs for all matrix combinations that have ≥1 job
- [ ] Zero-result (noindex) pages are NOT in the sitemap
- [ ] Pages with 50+ jobs have `<priority>0.9`
- [ ] Pages with 10-49 jobs have `<priority>0.7`
- [ ] Pages with 1-9 jobs have `<priority>0.5`
- [ ] Every URL in sitemap returns HTTP 200
- [ ] Main sitemap index at `/sitemap.xml` includes `<sitemap><loc>.../sitemap-jobs.xml</loc></sitemap>`
- [ ] Google Search Console accepts sitemap with 0 errors
- [ ] Sitemap XML validates against [sitemaps.org schema](https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd)
- [ ] Priority values update on sitemap regeneration (not hardcoded)

---

### FEATURE 5: Intro Copy & FAQ Content Generation

**What:** Unique, templated content per page category to avoid thin/duplicate content penalties.

**Why:** 2,400 pages with identical copy = duplicate content. Google will de-index them. Each page needs sufficiently unique content.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F5.1 | Define 8-12 role categories (e.g. "engineering", "data", "design", "finance", "marketing", "devops", "management", "support", "qa", "security") | P0 |
| F5.2 | Each category has 3-5 intro copy templates with variable slots (`{role}`, `{location}`, `{avg_salary}`, `{num_jobs}`, `{top_skills}`) | P0 |
| F5.3 | Template selection is deterministic per page (hash-based, not random) | P0 |
| F5.4 | FAQ answers are category-aware (engineering FAQs differ from marketing FAQs) | P0 |
| F5.5 | Salary insight line dynamically computed from Adzuna results on the page — **THIS IS A SURVIVAL REQUIREMENT** (not optional). Without real data, pages are thin doorway pages. | P0 |
| F5.6 | "Key Skills" section aggregated from actual job descriptions in the listing — **THIS IS A SURVIVAL REQUIREMENT**. This is what makes each page unique and data-driven. | P0 |
| F5.7 | No two adjacent pages in sitemap should have identical intro copy | P1 |

#### Content Template Example

**Category: Engineering**
**Template 1:**
> Looking for {role} opportunities in {location}? Browse {num_jobs} live vacancies from top employers. The average {role} salary in {location} is {avg_salary}, with roles requiring skills like {top_skills}.

**Template 2:**
> {location} has a thriving tech scene with strong demand for {role} professionals. We've found {num_jobs} current openings, with salaries typically ranging from {salary_low} to {salary_high}. Build your resume with EasyFreeResume to stand out.

#### Acceptance Criteria

- [ ] Every pSEO page has a non-empty intro paragraph (minimum 30 words)
- [ ] Intro copy contains at least 2 dynamic values (not just role + location in a static sentence)
- [ ] Spot-check 20 random pages: no two have byte-identical intro paragraphs
- [ ] FAQ answers reference the specific role category (not generic across all pages)
- [ ] Salary line shows actual range when data available, graceful fallback when not ("salary data not yet available for this role")

---

### FEATURE 6: Internal Linking Strategy

**What:** Every pSEO page links to related roles and locations, creating a dense internal link graph.

**Why:** Internal links distribute PageRank and help Google discover and rank all pages. Dense interlinking is critical for pSEO at scale.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F6.1 | "Related Roles" section: 5-8 links to related role pages (from `TITLE_SYNONYMS` + same category) in same location | P0 |
| F6.2 | "Other Locations" section: 5-8 links to same role in other cities (prioritise nearest by geography) — these are **lateral links** between spokes | P0 |
| F6.3 | Breadcrumb: `Home > Jobs > {Role} > {Location}` — each segment is a clickable `<a>` link in an `<ol>` / `<li>` structure (NOT visual-only text or CSS-styled spans) | P0 |
| F6.4 | **Hub uplink:** Every spoke page (`/jobs/python/london`) links back UP to its role hub (`/jobs/python`) — this establishes the semantic hierarchy for Google | P0 |
| F6.5 | "Build your resume" CTA linking to `/templates` (cross-sell) | P0 |
| F6.6 | Role hub pages (`/jobs/software-engineer`) link to all locations for that role | P1 |
| F6.7 | Main `/jobs` hub page links to top 20-30 most popular role+location combos | P1 |
| F6.8 | Blog posts about career topics link to relevant job pages | P2 |
| F6.9 | Footer or sidebar includes "Popular Searches" with 10-15 high-volume combos | P2 |

#### Hub & Spoke Linking Diagram

```
              ┌───────────────┐
              │     /jobs      │  ← Top-level hub
              │  "Find a Job"  │
              └───────┬───────┘
                      │ links to all role hubs
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │/jobs/     │ │/jobs/     │ │/jobs/     │  ← Role hubs
   │python     │ │react      │ │devops     │
   └─────┬────┘ └─────┬────┘ └─────┬────┘
         │             │             │  links to all locations
    ┌────┼────┐   ┌────┼────┐   ┌────┼────┐
    ▼    ▼    ▼   ▼    ▼    ▼   ▼    ▼    ▼
  /lon /man /bri /lon /man /bri /lon /man /bri  ← Spokes
    ↑────↔────↑   ↑────↔────↑   ↑────↔────↑
    lateral links   lateral links   lateral links
    
  Each spoke links:
    ↑ UP to its role hub  (F6.4)
    ↔ LATERAL to same role in other cities  (F6.2)
    → ACROSS to related roles in same city  (F6.1)
```

#### Acceptance Criteria

- [ ] Every pSEO spoke page has ≥5 internal links to other pSEO pages
- [ ] Every spoke page links UP to its role hub (e.g., `/jobs/python/london` → `/jobs/python`)
- [ ] "Related Roles" links are contextually relevant (not random)
- [ ] "Other Locations" links are geographically sensible (London page links to nearby cities, not only Aberdeen)
- [ ] Breadcrumb is an `<ol>` with `<li>` children, each containing an `<a href>` (verified by inspecting raw HTML)
- [ ] Breadcrumb links all resolve to valid pages (200 status)
- [ ] No orphan pages: every page in the matrix is linked from at least 2 other pages
- [ ] CTA to `/templates` present on every pSEO page
- [ ] Role hub `/jobs/python` links to all 21 location spokes

---

### FEATURE 7: AdSense Integration on pSEO Pages

**What:** Strategic ad placement on job pages to maximise revenue without hurting UX or CWV.

**Why:** Job search pages have high commercial intent = high AdSense RPM potential. But poor ad placement will fail CWV and tank rankings.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F7.1 | Horizontal leaderboard ad after intro copy, above job listings | P0 |
| F7.2 | In-feed ad unit after every 5th job card | P0 |
| F7.3 | Bottom ad unit after FAQ section | P0 |
| F7.4 | Ad containers must have explicit width/height to prevent CLS (layout shift) | P0 |
| F7.5 | Ads load after main content (defer/lazy-load) to not impact LCP | P0 |
| F7.6 | Mobile: maximum 1 ad visible per viewport (no ad stacking) | P1 |
| F7.7 | Use existing `AdContainer.tsx` component with unfilled-collapse behaviour | P0 |
| F7.8 | Side rail ads on desktop if content width allows (reuse existing `SideRailLayout`) | P1 |

#### Acceptance Criteria

- [ ] CLS score < 0.1 on mobile for all pSEO pages (with ads loaded)
- [ ] LCP < 2.5s on mobile (ads do not block main content render)
- [ ] Ad containers have `min-height` set in CSS (not relying on JS sizing)
- [ ] In-feed ads use `adFormat="horizontal"` (matching existing carousel fix from v3.12.1)
- [ ] No ads above the fold on mobile before any content is visible
- [ ] AdSense policy compliance: ads clearly distinguishable from job listings

---

### FEATURE 8: Job Search Engine Improvements

**What:** Improvements to the existing 3-tier search engine based on the architecture review.

**Why:** Better search = more relevant results = higher Adzuna CTR = more affiliate revenue.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F8.1 | Change Tier 1→2 threshold from "< 5 results" to "< 5 results OR < 3 results scoring above 60" | P1 |
| F8.2 | Extend AI fallback cache from 15 minutes to 24 hours | P0 |
| F8.3 | Add deduplication by URL across all 3 tiers (currently only Tier 1↔2) | P0 |
| F8.4 | Add pagination support: `page` and `per_page` params to POST `/api/jobs/search` | P0 |
| F8.5 | Return `total_available` count alongside paginated results | P1 |
| F8.6 | Add a server-side endpoint for pSEO page data: `GET /api/jobs/page/{role_slug}/{location_slug}` that returns pre-scored, cached results | P0 |
| F8.7 | Aggregate salary stats (min, max, median) across results for the salary insight line | P1 |
| F8.8 | Aggregate top skills from job descriptions (top 5-8 most mentioned) for the "Key Skills" section | P1 |
| F8.9 | Log search queries and result counts for analytics (what are people searching for?) | P2 |

#### pSEO Data Endpoint Spec

```
GET /api/jobs/page/software-engineer/london
```

Response:
```json
{
  "success": true,
  "data": {
    "role_slug": "software-engineer",
    "role_display": "Software Engineer",
    "location_slug": "london",
    "location_display": "London",
    "total_count": 342,
    "salary_stats": {
      "min": 45000,
      "max": 120000,
      "median": 72000,
      "sample_size": 89,
      "currency": "GBP"
    },
    "top_skills": ["python", "javascript", "aws", "docker", "sql"],
    "jobs": [ /* first 20, pre-scored */ ],
    "related_roles": [
      {"slug": "software-developer", "display": "Software Developer"},
      {"slug": "backend-developer", "display": "Backend Developer"}
    ],
    "related_locations": [
      {"slug": "manchester", "display": "Manchester"},
      {"slug": "bristol", "display": "Bristol"}
    ],
    "cached_at": "2026-02-07T10:00:00Z",
    "cache_ttl_hours": 6
  }
}
```

#### Acceptance Criteria

- [ ] AI cache TTL is 24 hours (verified in code)
- [ ] Tier 3 results are deduplicated against Tier 1+2 by URL
- [ ] `POST /api/jobs/search` accepts `page` (default 1) and `per_page` (default 20, max 50)
- [ ] `GET /api/jobs/page/{role}/{location}` returns data within 500ms on cache hit
- [ ] `GET /api/jobs/page/{role}/{location}` returns data within 10s on cache miss (cold fetch)
- [ ] `salary_stats` correctly aggregates only non-predicted salaries
- [ ] `top_skills` derived from actual job descriptions, not from synonym tables
- [ ] Invalid role/location slugs return 404 with `{"success": false, "error": "not_found"}`
- [ ] All existing 61 tests in `test_job_engine.py` still pass after changes
- [ ] New tests added for pagination, dedup across tiers, and pSEO endpoint

---

### FEATURE 9: Role Hub Pages

**What:** Intermediate pages at `/jobs/{role-slug}` showing all locations for a given role.

**Why:** Creates a hierarchy (hub → spoke) that strengthens topical authority. Also captures searches like "software engineer jobs UK" that don't specify a city.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F9.1 | `/jobs/{role-slug}` shows all available locations for that role | P1 |
| F9.2 | Page lists location cards with: city name, number of live jobs, salary range, link to pSEO page | P1 |
| F9.3 | H1: "{Role} Jobs in the UK" | P1 |
| F9.4 | Includes `WebPage` + `BreadcrumbList` structured data | P1 |
| F9.5 | Included in `sitemap-jobs.xml` | P1 |
| F9.6 | Server-rendered like pSEO pages | P1 |

#### Acceptance Criteria

- [ ] `/jobs/software-engineer` returns 200 with server-rendered HTML
- [ ] Page lists all 21 locations (20 cities + remote) with links
- [ ] Each location link goes to valid `/jobs/software-engineer/{location}` page
- [ ] Included in sitemap (120+ additional URLs for role hubs)

---

### FEATURE 10: Jobs Hub Page Enhancement

**What:** Upgrade the main `/jobs` page from a pure client-side search page to an SEO-friendly hub.

**Why:** `/jobs` is the top-level entry point. It should link to the most popular pSEO pages and rank for "jobs" broadly.

#### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F10.1 | Server-rendered hero section with H1: "Find Your Next Job" | P1 |
| F10.2 | "Popular Searches" grid: top 20-30 role+location combos (links to pSEO pages) | P1 |
| F10.3 | "Browse by Role" section: links to all role hub pages grouped by category | P1 |
| F10.4 | "Browse by Location" section: links to top cities | P1 |
| F10.5 | Existing interactive search still works (React hydration) | P0 |
| F10.6 | AdSense units integrated | P1 |

#### Acceptance Criteria

- [ ] `/jobs` returns server-rendered HTML with visible links (not JS-dependent)
- [ ] At least 20 internal links to pSEO pages present in raw HTML
- [ ] Interactive search still works after React hydration
- [ ] Page passes CWV on mobile

---

## 5. Technical Implementation Notes

### Pre-rendering Strategy (SSR Architecture)

Given your Flask + React/Vite stack (not Next.js), the recommended approach:

1. **On-demand generation with caching:** When a request matches `/jobs/{role}/{location}`, check filesystem cache. If cached HTML exists and TTL hasn't expired, serve immediately (< 20ms). Otherwise, generate on-the-fly via Jinja2, cache to filesystem, and serve.

2. **Background warm-up (optional):** A cron job or startup script pre-warms the cache for the top 200 highest-priority pages (50+ jobs). Remaining 2,200 pages are generated on first request (lazy).

3. **Cache refresh:** Scheduled task regenerates all cached pages every 6 hours. Stale-while-revalidate: always serve existing cache immediately, queue regeneration in background.

4. **React hydration:** The static HTML includes a `<div id="jobs-root" data-ssr="true">` with server-rendered content. React mounts on top, enabling search, filters, and pagination without a full page reload. React does NOT re-fetch the initial job list — it reads from the existing DOM or a `<script>` tag containing pre-serialised JSON.

### Handling 2,400 Pages in Flask

- Don't register 2,400 routes. Use a single catch-all pattern: `/jobs/<role_slug>/<location_slug>`
- Validate slugs against `jobs_matrix.json` (loaded in memory at startup)
- Return 404 for invalid combos

### AdSense CLS Prevention

```html
<!-- Fixed-height container prevents layout shift -->
<div class="ad-container" style="min-height: 90px; width: 100%;">
  <!-- AdSense code injected here by React -->
</div>
```

### Adzuna Affiliate Link Tracking

- Ensure all outbound job links use your Adzuna affiliate partner ID
- Add UTM parameters for internal tracking: `?utm_source=efr&utm_medium=pseo&utm_campaign={role_slug}`

---

## 6. SEO Execution Checklist

This section consolidates all SEO-critical requirements that MUST be verified before launch. Failure on any P0 item = Google penalty risk.

### 6.1 Doorway Page Risk Mitigation

Google penalises pSEO sites that look like templates with swapped keywords. The data must BE the content.

| Check | Requirement | Feature |
|-------|------------|---------|
| ✅ | Dynamic `<title>` with live job count + current month | F2.11-F2.14 |
| ✅ | Salary data computed from real Adzuna listings (not static) | F5.5 (now P0) |
| ✅ | Skills section aggregated from actual job descriptions | F5.6 (now P0) |
| ✅ | Intro copy varies by role category (8-12 categories × 3-5 templates) | F5.1-F5.3 |
| ✅ | FAQ answers are category-specific | F5.4 |
| ✅ | Zero-result pages are noindexed | F2.16 |
| ✅ | Noindex pages excluded from sitemap | F4.9 |

### 6.2 Structured Data Compliance

| Check | Requirement | Feature |
|-------|------------|---------|
| ✅ | `JobPosting` with `validThrough` on every listing | F3.7 |
| ✅ | Expired jobs have schema removed (even if HTML card remains) | F3.8 |
| ✅ | `baseSalary` only when salary is real (not predicted) | F3.6 |
| ✅ | `BreadcrumbList` on every page | F3.2 |
| ✅ | `FAQPage` on every page | F3.3 |
| ✅ | Google Rich Results Test: 0 errors | F3.4 |

### 6.3 Pagination SEO

| Check | Requirement | Feature |
|-------|------------|---------|
| ✅ | Page 2+ canonical → self (NOT back to page 1) | F2.20-F2.21 |
| ✅ | `<link rel="prev">` / `<link rel="next">` in `<head>` | F2.22-F2.24 |
| ✅ | Page 1 URL has no `?page=1` param | F2.19 |

### 6.4 Internal Linking Hierarchy

| Check | Requirement | Feature |
|-------|------------|---------|
| ✅ | Hub → Spoke: role hubs link to all location pages | F6.6 |
| ✅ | Spoke → Hub: every location page links up to role hub | F6.4 |
| ✅ | Spoke ↔ Spoke: lateral links to same role in other cities | F6.2 |
| ✅ | Spoke → Related: cross-links to related roles in same city | F6.1 |
| ✅ | Breadcrumb is real `<ol>/<li>/<a>` HTML (not visual-only) | F6.3 |

### 6.5 Crawl Budget Optimisation

| Check | Requirement | Feature |
|-------|------------|---------|
| ✅ | Sitemap priority based on job inventory (0.9/0.7/0.5) | F4.3 |
| ✅ | Zero-result pages excluded from sitemap | F4.9 |
| ✅ | `<meta name="robots" content="noindex, follow">` on empty pages | F2.16 |
| ✅ | Cache serves HTML in < 20ms (no server-side delays for Googlebot) | F2.9 |

---

## 7. Rollout Plan

| Phase | Scope | Timeline |
|-------|-------|----------|
| **Phase 1** | F1 (Matrix) + F4 (Sitemap) + F8.2-F8.4 (Engine fixes) | Week 1 |
| **Phase 2** | F2 (SSR pages) + F3 (Structured data) + F5 (Content) | Week 2-3 |
| **Phase 3** | F6 (Internal links) + F7 (Ads) + F8.6-F8.8 (pSEO endpoint) | Week 3-4 |
| **Phase 4** | F9 (Role hubs) + F10 (Jobs hub) + F8.9 (Analytics) | Week 5 |
| **Phase 5** | Monitor GSC indexing, tune content, expand matrix | Ongoing |

---

## 8. Testing Requirements

| Area | Tests |
|------|-------|
| Matrix generation | Slug uniqueness, URL safety, completeness |
| pSEO endpoint | Cache hit/miss, 404 for invalid slugs, data correctness |
| SSR HTML | Bot detection, correct status codes, structured data validity |
| **Zero-result handling** | Fallback cascade, noindex injection, internal links still present |
| **Dynamic titles** | Job count in title, month/year in title, count updates on cache refresh |
| **Pagination SEO** | Canonical self-ref on page 2+, prev/next links, no `?page=1` on page 1 |
| **validThrough** | Schema pruned for expired jobs, validThrough = datePosted + 30d |
| Sitemap | Valid XML, dynamic priority (0.9/0.7/0.5), noindex pages excluded |
| **Internal linking** | Spoke→Hub uplinks, lateral links, breadcrumb is real `<ol>/<li>/<a>` |
| Scoring changes | Regression tests for existing 61 tests + new pagination/dedup tests |
| CWV | Lighthouse CI on 5 sample pSEO pages (mobile + desktop) |
| Ads | CLS < 0.1 with ads loaded, no stacking on mobile |

---

## Appendix A: Location List

| City | Slug | Region |
|------|------|--------|
| London | `london` | South East |
| Manchester | `manchester` | North West |
| Birmingham | `birmingham` | West Midlands |
| Leeds | `leeds` | Yorkshire |
| Bristol | `bristol` | South West |
| Edinburgh | `edinburgh` | Scotland |
| Glasgow | `glasgow` | Scotland |
| Liverpool | `liverpool` | North West |
| Newcastle | `newcastle` | North East |
| Sheffield | `sheffield` | Yorkshire |
| Nottingham | `nottingham` | East Midlands |
| Cambridge | `cambridge` | East |
| Oxford | `oxford` | South East |
| Cardiff | `cardiff` | Wales |
| Belfast | `belfast` | Northern Ireland |
| Reading | `reading` | South East |
| Brighton | `brighton` | South East |
| Southampton | `southampton` | South East |
| Coventry | `coventry` | West Midlands |
| Leicester | `leicester` | East Midlands |
| Remote | `remote` | N/A |

---

## Appendix B: Role Category Mapping (Sample)

| Category | Example Roles |
|----------|---------------|
| Engineering | Software Engineer, Backend Developer, Frontend Developer, Full Stack Developer, Mobile Developer |
| Data | Data Scientist, Data Analyst, Data Engineer, Machine Learning Engineer, BI Analyst |
| DevOps/Infra | DevOps Engineer, SRE, Cloud Engineer, Platform Engineer, Infrastructure Engineer |
| Design | UX Designer, UI Designer, Product Designer, Graphic Designer |
| Management | Engineering Manager, Product Manager, Project Manager, Scrum Master |
| Security | Security Engineer, Cybersecurity Analyst, Penetration Tester |
| QA | QA Engineer, Test Engineer, SDET, Automation Engineer |
| Support | Technical Support, IT Support, Help Desk, System Administrator |
| Marketing | Digital Marketing, SEO Specialist, Content Manager, Growth Manager |
| Finance | Financial Analyst, Quantitative Analyst, Risk Analyst, Compliance Officer |

*Full mapping to be derived from `TITLE_SYNONYMS` table during F1 implementation.*