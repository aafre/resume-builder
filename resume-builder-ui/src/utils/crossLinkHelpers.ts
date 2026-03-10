/**
 * Cross-linking helpers for programmatic SEO pages
 * Maps between /examples/ slugs and /resume-keywords/ slugs
 * to enable internal linking between the two page types
 */

import { JOB_EXAMPLES_DATABASE } from '../data/jobExamples';
import { JOBS_DATABASE } from '../data/jobKeywords';

/**
 * Manual overrides for slug pairs that don't match exactly.
 * Key = keywords slug, Value = examples slug
 */
const KEYWORD_TO_EXAMPLE_OVERRIDES: Record<string, string> = {
  'frontend-developer': 'front-end-developer',
  'nursing': 'registered-nurse',
  'sales': 'retail-sales-associate',
  'marketing': 'marketing-coordinator',
};

const EXAMPLE_TO_KEYWORD_OVERRIDES: Record<string, string> = Object.fromEntries(
  Object.entries(KEYWORD_TO_EXAMPLE_OVERRIDES).map(([k, v]) => [v, k])
);

/**
 * Given a keywords page slug, find the matching examples page slug (if any)
 */
export function getMatchingExampleSlug(keywordSlug: string): string | null {
  // Check manual overrides first
  const override = KEYWORD_TO_EXAMPLE_OVERRIDES[keywordSlug];
  if (override) {
    const exists = JOB_EXAMPLES_DATABASE.some((j) => j.slug === override);
    return exists ? override : null;
  }

  // Try direct slug match
  const directMatch = JOB_EXAMPLES_DATABASE.find((j) => j.slug === keywordSlug);
  return directMatch ? directMatch.slug : null;
}

/**
 * Given an examples page slug, find the matching keywords page slug (if any)
 */
export function getMatchingKeywordSlug(exampleSlug: string): string | null {
  // Check manual overrides first
  const override = EXAMPLE_TO_KEYWORD_OVERRIDES[exampleSlug];
  if (override) {
    const exists = JOBS_DATABASE.some((j) => j.slug === override);
    return exists ? override : null;
  }

  // Try direct slug match
  const directMatch = JOBS_DATABASE.find((j) => j.slug === exampleSlug);
  return directMatch ? directMatch.slug : null;
}

/**
 * Get the job title for a keywords page slug
 */
export function getKeywordJobTitle(slug: string): string | null {
  const job = JOBS_DATABASE.find((j) => j.slug === slug);
  return job ? job.title : null;
}

/**
 * Get the job title for an examples page slug
 */
export function getExampleJobTitle(slug: string): string | null {
  const job = JOB_EXAMPLES_DATABASE.find((j) => j.slug === slug);
  return job ? job.title : null;
}
