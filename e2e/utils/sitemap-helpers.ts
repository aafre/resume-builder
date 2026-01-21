/**
 * Sitemap URL Extraction Utility
 * Extracts all URLs from the sitemap sources for validation testing
 *
 * Uses the same data sources as generateSitemap.ts to ensure consistency
 */

import { JOBS_DATABASE } from '../../resume-builder-ui/src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../../resume-builder-ui/src/data/jobExamples/index';
import { getStaticUrlPaths } from '../../resume-builder-ui/src/data/sitemapUrls';

/**
 * Get only static URLs (useful for faster subset testing)
 */
export function getStaticUrls(): string[] {
  return getStaticUrlPaths();
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
 * Get all URLs that should be in the sitemap
 * Combines static URLs with dynamically generated URLs from the databases
 *
 * @returns Array of all URL paths (without domain)
 */
export function getAllSitemapUrls(): string[] {
  return [...getStaticUrls(), ...getJobKeywordUrls(), ...getJobExampleUrls()];
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
  const staticCount = getStaticUrls().length;
  const jobKeywordsCount = getJobKeywordUrls().length;
  const jobExamplesCount = getJobExampleUrls().length;

  return {
    static: staticCount,
    jobKeywords: jobKeywordsCount,
    jobExamples: jobExamplesCount,
    total: staticCount + jobKeywordsCount + jobExamplesCount,
  };
}
