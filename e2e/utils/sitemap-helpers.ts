/**
 * Sitemap URL Extraction Utility
 * Extracts all URLs from the sitemap sources for validation testing
 *
 * Uses the same data sources as generateSitemap.ts to ensure consistency
 */

import { JOBS_DATABASE } from '../../resume-builder-ui/src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../../resume-builder-ui/src/data/jobExamples/index';
import { getStaticUrlPaths } from '../../resume-builder-ui/src/data/sitemapUrls';

// Pre-compute URL lists at module load time since the data is static
const staticUrls = getStaticUrlPaths();
const jobKeywordUrls = JOBS_DATABASE.map((job) => `/resume-keywords/${job.slug}`);
const jobExampleUrls = JOB_EXAMPLES_DATABASE.map((job) => `/examples/${job.slug}`);
const allUrls = [...staticUrls, ...jobKeywordUrls, ...jobExampleUrls];

/**
 * Get only static URLs (useful for faster subset testing)
 */
export function getStaticUrls(): string[] {
  return staticUrls;
}

/**
 * Get only dynamic job keyword URLs
 */
export function getJobKeywordUrls(): string[] {
  return jobKeywordUrls;
}

/**
 * Get only dynamic job example URLs
 */
export function getJobExampleUrls(): string[] {
  return jobExampleUrls;
}

/**
 * Get all URLs that should be in the sitemap
 * Combines static URLs with dynamically generated URLs from the databases
 *
 * @returns Array of all URL paths (without domain)
 */
export function getAllSitemapUrls(): string[] {
  return allUrls;
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
    static: staticUrls.length,
    jobKeywords: jobKeywordUrls.length,
    jobExamples: jobExampleUrls.length,
    total: allUrls.length,
  };
}
