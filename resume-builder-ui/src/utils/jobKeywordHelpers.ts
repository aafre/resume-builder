/**
 * Job Keywords Helper Utilities
 * Generates FAQs and other content for programmatic SEO job pages
 */

import type { FAQConfig } from '../types/seo';
import type { JobKeywordsData } from '../data/jobKeywords/types';

/**
 * Generate auto-populated FAQs for a job title
 * Creates 6 common questions answered using job data
 * @param job - JobKeywordsData object
 * @returns Array of FAQ objects
 */
export function generateJobFAQs(job: JobKeywordsData): FAQConfig[] {
  const topCoreSkills = job.keywords.core.slice(0, 3).join(', ');
  const topTechnicalSkills = job.keywords.technical.slice(0, 3).join(', ');
  const topProcesses = job.keywords.processes?.slice(0, 2).join(' and ') || 'Agile methodologies';
  const certCount = job.keywords.certifications?.length || 0;
  const topCert = job.keywords.certifications?.[0] || 'relevant certifications';

  return [
    {
      question: `What are the most important ${job.title} resume keywords?`,
      answer: `The most critical keywords for ${job.title} resumes include core skills like ${topCoreSkills}, and technical proficiencies such as ${topTechnicalSkills}. ATS systems scan for these specific terms to match candidates with job requirements.`,
    },
    {
      question: `Which technical skills should I highlight on my ${job.title} resume?`,
      answer: `Top technical skills include ${topTechnicalSkills}${job.keywords.technical.length > 3 ? `, ${job.keywords.technical[3]}` : ''}${job.keywords.technical.length > 4 ? `, and ${job.keywords.technical[4]}` : ''}. These tools and technologies are frequently required in ${job.title} job postings and help your resume pass ATS filters.`,
    },
    {
      question: `How do I optimize my ${job.title} resume for ATS?`,
      answer: `Use exact keyword matches from job descriptions, include both the acronym and full term (e.g., "API" and "Application Programming Interface"), and incorporate keywords naturally throughout your experience bullets. Focus on specific technologies like ${topTechnicalSkills} and methodologies like ${topProcesses}.`,
    },
    {
      question: `What soft skills matter for ${job.title} roles?`,
      answer: `Essential soft skills include ${topCoreSkills}${job.keywords.core.length > 3 ? `, and ${job.keywords.core[3]}` : ''}. Demonstrate these through specific examples in your work experience, showing how you applied these skills to achieve measurable results.`,
    },
    {
      question: `Should I include certifications on my ${job.title} resume?`,
      answer: certCount > 0
        ? `Yes, certifications significantly strengthen your resume. Valuable certifications include ${topCert}${certCount > 1 ? `, ${job.keywords.certifications?.[1]}` : ''}${certCount > 2 ? `, and ${job.keywords.certifications?.[2]}` : ''}. List certifications prominently in a dedicated section with completion dates.`
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
