# PRD: Jobs pSEO & Search Engine Improvements — EasyFreeResume.com

**Author:** Amit (VP Software Engineering)
**Date:** 7 February 2026
**Status:** Draft
**Stack:** Flask (Python) backend · React/Vite frontend · Docker · Supabase · Adzuna API (affiliate)

---

## 1. Executive Summary

Build programmatic SEO (pSEO) landing pages for job search across role x location combinations, improve the existing job search engine, and maximise AdSense + Adzuna affiliate revenue. The goal is to go from a single client-side `/jobs` route (invisible to Google) to **2,000+ indexable, server-rendered pages** targeting long-tail "{role} jobs in {city}" queries.

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (90 days post-launch) |
|------|--------|------------------------------|
| Organic traffic to job pages | Google Search Console clicks | 5,000+ clicks/month |
| Indexed job pages | GSC Coverage report | 80%+ of generated pages indexed |
| Adzuna affiliate revenue | Click-throughs to Adzuna | 3%+ CTR on job listings |

---

## 4. Feature Requirements

### FEATURE 1: Role x Location Matrix Generator
Generate canonical list of all pSEO page combinations from TITLE_SYNONYMS keys (~120 entries) x Top 20 UK cities + remote.

### FEATURE 2: Server-Side Rendered pSEO Pages
Flask serves fully-rendered HTML for `/jobs/{role-slug}/{location-slug}` routes.

### FEATURE 3: Structured Data (Schema.org)
JSON-LD structured data on every pSEO page for rich results in Google.

### FEATURE 4: Dynamic Sitemap Generation
Auto-generated `sitemap-jobs.xml` covering all pSEO pages.

### FEATURE 5: Intro Copy & FAQ Content Generation
Unique, templated content per page category to avoid thin/duplicate content penalties.

### FEATURE 6: Internal Linking Strategy
Every pSEO page links to related roles and locations.

### FEATURE 7: AdSense Integration on pSEO Pages
Strategic ad placement on job pages.

### FEATURE 8: Job Search Engine Improvements
- Tier threshold improvements
- AI cache TTL increase to 24h
- Pagination support
- Salary stats aggregation
- Top skills aggregation
- Search query logging

### FEATURE 9: Role Hub Pages
Intermediate pages at `/jobs/{role-slug}` showing all locations.

### FEATURE 10: Jobs Hub Page Enhancement
Upgrade `/jobs` from pure client-side search to SEO-friendly hub.

---

## Rollout Plan

| Phase | Scope | Timeline |
|-------|-------|----------|
| Phase 1 | F1 (Matrix) + F4 (Sitemap) + F8.2-F8.4 (Engine fixes) | Week 1 |
| Phase 2 | F2 (SSR pages) + F3 (Structured data) + F5 (Content) | Week 2-3 |
| Phase 3 | F6 (Internal links) + F7 (Ads) + F8.6-F8.8 (pSEO endpoint) | Week 3-4 |
| Phase 4 | F9 (Role hubs) + F10 (Jobs hub) + F8.9 (Analytics) | Week 5 |
| Phase 5 | Monitor GSC indexing, tune content, expand matrix | Ongoing |

---

## Appendix A: Location List

London, Manchester, Birmingham, Leeds, Bristol, Edinburgh, Glasgow, Liverpool, Newcastle, Sheffield, Nottingham, Cambridge, Oxford, Cardiff, Belfast, Reading, Brighton, Southampton, Coventry, Leicester, Remote

## Appendix B: Role Categories

Engineering, Data, DevOps/Infra, Design, Management, Security, QA, Support, Marketing, Finance

*Full PRD with detailed acceptance criteria available in conversation history.*
