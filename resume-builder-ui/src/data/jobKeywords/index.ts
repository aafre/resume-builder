/**
 * Job Keywords Data - Helper Functions
 * Provides utility functions for accessing programmatic SEO job data
 */

export { JOBS_DATABASE } from './jobsData';
export type { JobKeywordsData, ToolCategory } from './types';

import { JOBS_DATABASE } from './jobsData';
import type { JobKeywordsData } from './types';

/**
 * Get job data by URL slug
 * @param slug - URL slug (e.g., "software-engineer")
 * @returns JobKeywordsData object or undefined if not found
 */
export function getJobBySlug(slug: string): JobKeywordsData | undefined {
  return JOBS_DATABASE.find((job) => job.slug === slug);
}

/**
 * Get all job slugs for routing/sitemap generation
 * @returns Array of all job URL slugs
 */
export function getAllJobSlugs(): string[] {
  return JOBS_DATABASE.map((job) => job.slug);
}

/**
 * Get all jobs by category
 * @param category - Job category to filter by
 * @returns Array of JobKeywordsData objects matching the category
 */
export function getJobsByCategory(
  category: 'technology' | 'healthcare' | 'business' | 'creative' | 'trades'
): JobKeywordsData[] {
  return JOBS_DATABASE.filter((job) => job.category === category);
}

/**
 * Get total count of jobs in database
 * @returns Total number of job entries
 */
export function getTotalJobCount(): number {
  return JOBS_DATABASE.length;
}

/**
 * Search jobs by title (case-insensitive partial match)
 * @param query - Search query string
 * @returns Array of matching JobKeywordsData objects
 */
export function searchJobsByTitle(query: string): JobKeywordsData[] {
  const lowerQuery = query.toLowerCase();
  return JOBS_DATABASE.filter((job) =>
    job.title.toLowerCase().includes(lowerQuery)
  );
}
