# Job SEO pages sit behind their own flag and stay unindexed until each page carries original content

Job listings go live in Release 1 (post-download suggestions and a `noindex` `/jobs` search page), but the programmatic role × city job pages (`jobs_pseo.py`, `/sitemap-jobs-roles.xml`) are gated by a separate `JOBS_PSEO_ENABLED` flag, off by default, instead of switching on whenever Adzuna credentials are present. The site was already hit by Google's March 2026 "scaled content abuse" update for 5 near-identical pages (`seo-tracking/changelog.md`); ~2,400 templated pages built from Adzuna description snippets is the same pattern at ~500×, and the penalty lands domain-wide. On top of that, Adzuna's terms need written consent for aggregated data (salary averages, vacancy counts), its default 250 calls/day cannot keep the matrix fresh, and Google says not to put `JobPosting` markup on list pages.

## Consequences

The flag turns on only after three conditions are met: each page carries original content (hiring guidance, resume tips, at the `/examples` role-page bar), the data rights are covered (Adzuna written consent, or Jooble), and the API quota fits the refresh schedule. Pages then roll out in batches of about 50 in the strongest roles, not the full matrix.
