import type { JobKeywordsData } from '../data/jobKeywords/types';
import { getTotalKeywordCount } from './jobKeywordHelpers';

/**
 * Generate standardized SEO title for job keywords pages
 * Formula: "Free {Job Title} Resume Keywords & Skills List (2025) - ATS Friendly"
 */
export function generateJobPageTitle(job: JobKeywordsData): string {
  const year = new Date().getFullYear();
  return `Free ${job.title} Resume Keywords & Skills List (${year}) - ATS Friendly`;
}

/**
 * Generate dynamic meta description including top 3 technical skills
 * Formula: "Free {job} resume keywords including {skill1}, {skill2}, {skill3}, and {count}+ more..."
 */
export function generateJobPageDescription(job: JobKeywordsData): string {
  const year = new Date().getFullYear();
  const topSkills = job.keywords.technical.slice(0, 3);
  const totalCount = getTotalKeywordCount(job);

  return `Free ${job.title.toLowerCase()} resume keywords including ${topSkills.join(', ')}, and ${totalCount}+ more ATS-optimized skills. Updated for ${year}.`;
}
