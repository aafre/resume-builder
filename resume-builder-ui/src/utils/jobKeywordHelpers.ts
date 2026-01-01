/**
 * Job Keywords Helper Utilities
 * Generates FAQs and other content for programmatic SEO job pages
 */

import type { FAQConfig } from '../types/seo';
import type { JobKeywordsData } from '../data/jobKeywords/types';

/**
 * Formats an array of strings into a human-readable list.
 * Examples:
 * - ['a'] => "a"
 * - ['a', 'b'] => "a and b"
 * - ['a', 'b', 'c'] => "a, b, and c"
 * @param items - Array of strings to format
 * @param limit - Maximum number of items to include in the list
 * @returns Formatted string or empty string if no items
 */
function formatList(items: readonly string[] | undefined, limit: number): string {
  if (!items || items.length === 0) {
    return '';
  }
  const sliced = items.slice(0, limit);
  if (sliced.length === 0) return '';
  if (sliced.length === 1) return sliced[0];
  if (sliced.length === 2) return sliced.join(' and ');
  const last = sliced.pop()!;
  return `${sliced.join(', ')}, and ${last}`;
}

/**
 * Generate auto-populated FAQs for a job title
 * Creates 6 common questions answered using job data
 * @param job - JobKeywordsData object
 * @returns Array of FAQ objects
 */
export function generateJobFAQs(job: JobKeywordsData): FAQConfig[] {
  const topCoreSkills = formatList(job.keywords.core, 4);
  const topTechnicalSkills = formatList(job.keywords.technical, 5);
  const topProcesses = job.keywords.processes?.slice(0, 2).join(' and ') || 'Agile methodologies';
  const certCount = job.keywords.certifications?.length || 0;
  const topCerts = formatList(job.keywords.certifications, 3);

  return [
    {
      question: `What are the most important ${job.title} resume keywords?`,
      answer: `The most critical keywords for ${job.title} resumes include core skills like ${topCoreSkills}, and technical proficiencies such as ${topTechnicalSkills}. ATS systems scan for these specific terms to match candidates with job requirements.`,
    },
    {
      question: `Which technical skills should I highlight on my ${job.title} resume?`,
      answer: `Top technical skills include ${topTechnicalSkills}. These tools and technologies are frequently required in ${job.title} job postings and help your resume pass ATS filters.`,
    },
    {
      question: `How do I optimize my ${job.title} resume for ATS?`,
      answer: `Use exact keyword matches from job descriptions, include both the acronym and full term (e.g., "API" and "Application Programming Interface"), and incorporate keywords naturally throughout your experience bullets. Focus on specific technologies like ${topTechnicalSkills} and methodologies like ${topProcesses}.`,
    },
    {
      question: `What soft skills matter for ${job.title} roles?`,
      answer: `Essential soft skills include ${topCoreSkills}. Demonstrate these through specific examples in your work experience, showing how you applied these skills to achieve measurable results.`,
    },
    {
      question: `Should I include certifications on my ${job.title} resume?`,
      answer: certCount > 0
        ? `Yes, certifications significantly strengthen your resume. Valuable certifications include ${topCerts}. List certifications prominently in a dedicated section with completion dates.`
        : `While not always required, relevant certifications can strengthen your ${job.title} resume. Research industry-standard certifications in your field and include them prominently if you hold any. Certifications demonstrate commitment to professional development.`,
    },
    {
      question: `How many keywords should I include in my ${job.title} resume?`,
      answer: `Include 15-25 relevant keywords naturally distributed across your resume. Don't stuff keywords artificially—use them in context within your work experience, skills section, and summary. Prioritize keywords from the specific job description you're applying to, matching terms like ${topTechnicalSkills}.`,
    },
  ];
}

/**
 * Count total keywords for a job
 * @param job - JobKeywordsData object
 * @returns Total keyword count across all categories
 */
export function getTotalKeywordCount(job: JobKeywordsData): number {
  return (
    job.keywords.core.length +
    job.keywords.technical.length +
    (job.keywords.certifications?.length || 0) +
    (job.keywords.metrics?.length || 0) +
    (job.keywords.processes?.length || 0)
  );
}

/**
 * Get category-specific keyword count
 * @param job - JobKeywordsData object
 * @param category - Keyword category name
 * @returns Count of keywords in that category
 */
export function getCategoryKeywordCount(
  job: JobKeywordsData,
  category: 'core' | 'technical' | 'certifications' | 'metrics' | 'processes'
): number {
  return job.keywords[category]?.length || 0;
}
