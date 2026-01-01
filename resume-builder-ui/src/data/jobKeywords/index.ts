/**
 * Job Keywords Data - Helper Functions
 * Provides utility functions for accessing programmatic SEO job data
 */

// Re-export types
export type { JobKeywordsData, ToolCategory } from './types';

// Import all job data from individual files
import { softwareEngineer } from './jobs/software-engineer';
import { dataScientist } from './jobs/data-scientist';
import { productManager } from './jobs/product-manager';
import { frontendDeveloper } from './jobs/frontend-developer';
import { backendDeveloper } from './jobs/backend-developer';
import { fullStackDeveloper } from './jobs/full-stack-developer';
import { devopsEngineer } from './jobs/devops-engineer';
import { dataAnalyst } from './jobs/data-analyst';
import { uxDesigner } from './jobs/ux-designer';
import { projectManager } from './jobs/project-manager';
import type { JobKeywordsData } from './types';

/**
 * Complete jobs database
 * Aggregates all individual job entries into a single array
 * Add new jobs by importing above and adding to this array
 */
export const JOBS_DATABASE: JobKeywordsData[] = [
  softwareEngineer,
  dataScientist,
  productManager,
  frontendDeveloper,
  backendDeveloper,
  fullStackDeveloper,
  devopsEngineer,
  dataAnalyst,
  uxDesigner,
  projectManager,
];

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
