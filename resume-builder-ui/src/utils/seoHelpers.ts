import type { JobKeywordsData } from '../data/jobKeywords/types';
import { getTotalKeywordCount } from './jobKeywordHelpers';

/**
 * Generate standardized SEO title for job keywords pages
 * Formula: "{Job Title} Resume Keywords That Pass ATS Filters ({current_year})"
 */
export function generateJobPageTitle(job: JobKeywordsData): string {
  const year = new Date().getFullYear();
  return `${job.title} Resume Keywords That Pass ATS Filters (${year})`;
}

/**
 * Generate dynamic meta description including top 3 technical skills
 * Formula: "{count}+ proven {job} resume keywords including {skill1}, {skill2}, {skill3}. Copy-paste ready skills organized by category to beat ATS screening. Updated {year}."
 */
export function generateJobPageDescription(job: JobKeywordsData): string {
  const year = new Date().getFullYear();
  const topSkills = job.keywords.technical.slice(0, 3);
  const totalCount = getTotalKeywordCount(job);

  return `${totalCount}+ proven ${job.title.toLowerCase()} resume keywords${topSkills.length > 0 ? ` including ${topSkills.join(', ')}` : ''}. Copy-paste ready skills organized by category to beat ATS screening. Updated ${year}.`;
}
