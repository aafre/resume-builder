/**
 * Static URLs for Sitemap
 * Single source of truth used by both sitemap generation and E2E tests
 */

export interface SitemapUrl {
  loc: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod: string;
}

/**
 * Static URLs (manually maintained pages)
 * Used by generateSitemap.ts and e2e sitemap validation tests
 */
export const STATIC_URLS: SitemapUrl[] = [
  // High Priority Landing Pages (1.0)
  { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: '2026-01-25' },

  // New SEO Landing Pages (0.9) - updated footer links today
  { loc: '/actual-free-resume-builder', priority: 0.9, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/free-resume-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-01' },
  { loc: '/best-free-resume-builder-reddit', priority: 0.9, changefreq: 'monthly', lastmod: '2026-02-02' },

  // UK CV Market Pages (0.9)
  { loc: '/free-cv-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-18' },
  { loc: '/cv-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/cv-templates/ats-friendly', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-18' },

  // Core App Pages (0.8)
  { loc: '/templates', priority: 0.8, changefreq: 'weekly', lastmod: '2026-02-02' },

  // Hub Pages (0.8)
  { loc: '/ats-resume-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/resume-keywords', priority: 0.8, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/examples', priority: 0.8, changefreq: 'weekly', lastmod: '2026-01-21' },

  // Template Pages (0.7)
  { loc: '/templates/ats-friendly', priority: 0.7, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/templates/modern-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/minimalist-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/resume-templates-for-students', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },

  // Manually-curated keyword page (0.7)
  { loc: '/resume-keywords/customer-service', priority: 0.85, changefreq: 'monthly', lastmod: '2026-02-02' },

  // Blog Hub (0.6)
  { loc: '/blog', priority: 0.6, changefreq: 'weekly', lastmod: '2026-01-25' },

  // Blog Posts (0.5) - being updated with content refreshes
  { loc: '/blog/resume-keywords-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/resume-no-experience', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/job-interview-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/ats-resume-optimization', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/resume-mistakes-to-avoid', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/professional-summary-examples', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/cover-letter-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/remote-work-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/resume-length-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/tech-resume-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/resume-vs-cv-difference', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/ai-resume-builder', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/behavioral-interview-questions', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/introducing-prepai-ai-interview-coach', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/how-to-write-a-resume-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/resume-action-verbs', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/how-to-use-resume-keywords', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
{ loc: '/blog/how-why-easyfreeresume-completely-free', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/zety-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-01' },
  { loc: '/blog/how-to-list-skills', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },
  { loc: '/blog/quantify-resume-accomplishments', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-25' },

  // New AI Blog Posts (0.5) - recently created
  { loc: '/blog/chatgpt-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-resume-writing-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/claude-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/gemini-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/grok-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-job-description-analyzer', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-resume-review', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },

  // Competitor Comparison Posts (0.5) - recently created
  { loc: '/blog/resume-io-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/resume-genius-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/novoresume-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/enhancv-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/canva-resume-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/flowcv-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },

  // Static Pages (0.3)
  { loc: '/about', priority: 0.3, changefreq: 'yearly', lastmod: '2026-02-02' },
  { loc: '/contact', priority: 0.3, changefreq: 'yearly', lastmod: '2026-02-02' },
  { loc: '/privacy-policy', priority: 0.3, changefreq: 'yearly', lastmod: '2026-01-01' },
  { loc: '/terms-of-service', priority: 0.3, changefreq: 'yearly', lastmod: '2026-01-01' },
];

/**
 * Get just the URL paths (without metadata)
 */
export function getStaticUrlPaths(): string[] {
  return STATIC_URLS.map((url) => url.loc);
}
