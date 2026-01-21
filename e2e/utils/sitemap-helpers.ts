/**
 * Sitemap URL Extraction Utility
 * Extracts all URLs from the sitemap sources for validation testing
 *
 * Uses the same data sources as generateSitemap.ts to ensure consistency
 */

import { JOBS_DATABASE } from '../../resume-builder-ui/src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../../resume-builder-ui/src/data/jobExamples/index';

/**
 * Static URLs copied from generateSitemap.ts
 * These are manually maintained pages in the application
 */
const STATIC_URLS = [
  // High Priority Landing Pages
  '/',

  // SEO Landing Pages
  '/actual-free-resume-builder',
  '/free-resume-builder-no-sign-up',
  '/best-free-resume-builder-reddit',

  // UK CV Market Pages
  '/free-cv-builder-no-sign-up',
  '/cv-templates',
  '/cv-templates/ats-friendly',

  // Core App Pages
  '/templates',

  // Hub Pages
  '/ats-resume-templates',
  '/resume-keywords',
  '/examples',

  // Template Pages
  '/templates/ats-friendly',
  '/templates/modern-resume-templates',
  '/templates/minimalist-resume-templates',
  '/templates/resume-templates-for-students',

  // Manually-curated keyword page
  '/resume-keywords/customer-service',

  // Blog Hub
  '/blog',

  // Blog Posts
  '/blog/resume-keywords-guide',
  '/blog/resume-no-experience',
  '/blog/job-interview-guide',
  '/blog/ats-resume-optimization',
  '/blog/resume-mistakes-to-avoid',
  '/blog/professional-summary-examples',
  '/blog/cover-letter-guide',
  '/blog/remote-work-resume',
  '/blog/resume-length-guide',
  '/blog/tech-resume-guide',
  '/blog/resume-vs-cv-difference',
  '/blog/ai-resume-builder',
  '/blog/behavioral-interview-questions',
  '/blog/introducing-prepai-ai-interview-coach',
  '/blog/how-to-write-a-resume-guide',
  '/blog/resume-action-verbs',
  '/blog/how-to-use-resume-keywords',
  '/blog/software-engineer-resume-keywords',
  '/blog/how-why-easyfreeresume-completely-free',
  '/blog/zety-vs-easy-free-resume',
  '/blog/how-to-list-skills',
  '/blog/quantify-resume-accomplishments',

  // AI Blog Posts
  '/blog/chatgpt-resume-prompts',
  '/blog/ai-resume-writing-guide',
  '/blog/claude-resume-prompts',
  '/blog/gemini-resume-prompts',
  '/blog/grok-resume-prompts',
  '/blog/ai-job-description-analyzer',
  '/blog/ai-resume-review',

  // Competitor Comparison Posts
  '/blog/resume-io-vs-easy-free-resume',
  '/blog/resume-genius-vs-easy-free-resume',
  '/blog/novoresume-vs-easy-free-resume',
  '/blog/enhancv-vs-easy-free-resume',
  '/blog/canva-resume-vs-easy-free-resume',
  '/blog/flowcv-vs-easy-free-resume',

  // Static Pages
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
];

/**
 * Get all URLs that should be in the sitemap
 * Combines static URLs with dynamically generated URLs from the databases
 *
 * @returns Array of all URL paths (without domain)
 */
export function getAllSitemapUrls(): string[] {
  const urls: string[] = [];

  // Add static URLs
  urls.push(...STATIC_URLS);

  // Add dynamic job keyword pages
  JOBS_DATABASE.forEach((job) => {
    urls.push(`/resume-keywords/${job.slug}`);
  });

  // Add dynamic job example pages
  JOB_EXAMPLES_DATABASE.forEach((job) => {
    urls.push(`/examples/${job.slug}`);
  });

  return urls;
}

/**
 * Get only static URLs (useful for faster subset testing)
 */
export function getStaticUrls(): string[] {
  return [...STATIC_URLS];
}

/**
 * Get only dynamic job keyword URLs
 */
export function getJobKeywordUrls(): string[] {
  return JOBS_DATABASE.map((job) => `/resume-keywords/${job.slug}`);
}

/**
 * Get only dynamic job example URLs
 */
export function getJobExampleUrls(): string[] {
  return JOB_EXAMPLES_DATABASE.map((job) => `/examples/${job.slug}`);
}

/**
 * Get URL count breakdown for logging
 */
export function getUrlCounts(): {
  static: number;
  jobKeywords: number;
  jobExamples: number;
  total: number;
} {
  return {
    static: STATIC_URLS.length,
    jobKeywords: JOBS_DATABASE.length,
    jobExamples: JOB_EXAMPLES_DATABASE.length,
    total: STATIC_URLS.length + JOBS_DATABASE.length + JOB_EXAMPLES_DATABASE.length,
  };
}
