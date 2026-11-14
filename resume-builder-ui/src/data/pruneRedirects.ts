/**
 * Recovery prune 2026-12 (seo-tracking/prune-2026-12.md, baseline branch).
 * Mirrors PRUNE_REDIRECTS / NOINDEX_ROUTES in app.py — the server 301 is primary,
 * these drive the client <Navigate> fallbacks and the sitemap guard test.
 * tests/test_seo_prune.py fails if the two drift.
 */
export const PRUNE_REDIRECTS: Record<string, string> = {
  '/actual-free-resume-builder': '/free-resume-builder-no-payment',
  '/free-resume-builder-download': '/free-resume-builder-no-sign-up',
  '/free-resume-builder-for-nurses': '/free-resume-builder-no-sign-up',
  '/free-resume-builder-for-it-professionals': '/free-resume-builder-no-sign-up',
  '/free-resume-builder-for-veterans': '/free-resume-builder-no-sign-up',
  '/ai-resume-builder-free': '/',
  '/zety-free-alternative': '/easyfreeresume-vs-zety',
  '/blog/gemini-resume-prompts': '/blog/ai-resume-prompts-hub',
  '/blog/ats-formatting-rules': '/blog/ats-resume-optimization',
  '/blog/free-ats-resume-check': '/resume-keyword-scanner',
  '/blog/resume-after-career-break': '/blog/resume-employment-gaps',
  '/blog/job-interview-guide': '/blog/behavioral-interview-questions',
  '/blog/introducing-prepai-ai-interview-coach': '/blog/behavioral-interview-questions',
  '/blog/customer-service-resume-keywords-guide': '/resume-keywords',
  '/blog/how-to-use-resume-keywords': '/resume-keywords',
  '/blog/resume-keywords-guide': '/resume-keywords',
  '/blog/ai-job-description-analyzer': '/resume-keyword-scanner',
  '/blog/humanize-ai-resume': '/blog/ai-resume-writing-guide',
  '/blog/ai-resume-review': '/blog/ai-resume-writing-guide',
  '/blog/ai-resume-builder': '/',
  '/blog/resume-length-guide': '/blog/how-to-write-a-resume-guide',
  '/blog/how-to-list-skills': '/blog/how-to-write-a-resume-guide',
  '/blog/resume-mistakes-to-avoid': '/blog/how-to-write-a-resume-guide',
  '/blog/career-change-resume-guide': '/blog/how-to-write-a-resume-guide',
  '/blog/quantify-resume-accomplishments': '/blog/resume-action-verbs',
  '/blog/first-job-resume-teenager': '/blog/resume-no-experience',
  '/blog/resume-builder-hidden-costs': '/blog/how-why-easyfreeresume-completely-free',
};

/** Live but noindexed; kept out of the sitemap and blog index. */
export const PRUNE_NOINDEX: string[] = [
  '/blog/cover-letter-guide',
  '/blog/remote-work-resume',
  '/blog/tech-resume-guide',
];

/** Role pages stay live (hubs link to them) but out of the index; the hubs stay indexable. */
export const PRUNE_NOINDEX_PREFIXES = ['/examples/', '/resume-keywords/'];
