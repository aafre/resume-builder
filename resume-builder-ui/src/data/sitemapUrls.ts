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
  { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: '2026-02-10' },

  // New SEO Landing Pages (0.9) - updated footer links today
  { loc: '/actual-free-resume-builder', priority: 0.9, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/free-resume-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-02-17' },
  { loc: '/free-resume-builder-download', priority: 0.9, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/free-resume-builder-no-payment', priority: 0.9, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/ai-resume-builder-free', priority: 0.9, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/zety-free-alternative', priority: 0.9, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/best-free-resume-builder-reddit', priority: 0.9, changefreq: 'monthly', lastmod: '2026-02-17' },

  // ATS Keyword Scanner Tool (0.8)
  { loc: '/resume-keyword-scanner', priority: 0.8, changefreq: 'monthly', lastmod: '2026-03-22' },

  // Audience Landing Pages (0.8)
  { loc: '/free-resume-builder-for-students', priority: 0.8, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/free-resume-builder-for-veterans', priority: 0.8, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/free-resume-builder-for-it-professionals', priority: 0.8, changefreq: 'monthly', lastmod: '2026-03-22' },
  { loc: '/free-resume-builder-for-nurses', priority: 0.8, changefreq: 'monthly', lastmod: '2026-03-22' },

  // UK CV Market Pages (0.9)
  { loc: '/free-cv-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-18' },
  { loc: '/cv-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/cv-templates/ats-friendly', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-18' },

  // Core App Pages (0.8)
  { loc: '/templates', priority: 0.8, changefreq: 'weekly', lastmod: '2026-02-02' },

  // Hub Pages (0.8)
  { loc: '/ats-resume-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2026-02-17' },
  { loc: '/resume-keywords', priority: 0.8, changefreq: 'monthly', lastmod: '2026-02-04' },
  { loc: '/examples', priority: 0.8, changefreq: 'weekly', lastmod: '2026-01-21' },

  // Job Search — excluded until jobSearch feature flag is permanently enabled
  // { loc: '/jobs', priority: 0.7, changefreq: 'weekly', lastmod: '2026-02-08' },

  // Template Pages (0.7)
  { loc: '/templates/ats-friendly', priority: 0.7, changefreq: 'monthly', lastmod: '2026-02-02' },
  { loc: '/templates/modern-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/minimalist-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/resume-templates-for-students', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },

  // Manually-curated keyword page (0.7)
  { loc: '/resume-keywords/customer-service', priority: 0.85, changefreq: 'monthly', lastmod: '2026-02-10' },

  // Blog Hub (0.6)
  // NOTE: Individual blog posts are auto-generated from blogPosts.ts in generateSitemap.ts
  { loc: '/blog', priority: 0.6, changefreq: 'weekly', lastmod: '2026-01-25' },

  // Root-level comparison pages (not under /blog/)
  { loc: '/easyfreeresume-vs-zety', priority: 0.7, changefreq: 'monthly', lastmod: '2026-02-25' },
  { loc: '/easyfreeresume-vs-indeed-resume-builder', priority: 0.7, changefreq: 'monthly', lastmod: '2026-02-10' },

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
