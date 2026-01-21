/**
 * YAML Loader Utility
 * Loads and parses job example YAML files from the samples/examples directory
 */

import yaml from 'js-yaml';
import type { JobExampleData } from '../data/jobExamples/types';

/**
 * Cache for loaded YAML files to avoid repeated fetches
 */
const yamlCache = new Map<string, JobExampleData>();

/**
 * Load a job example YAML file by slug
 * @param slug - The job example slug (e.g., "customer-service-representative")
 * @returns The parsed job example data
 */
export async function loadJobExample(slug: string): Promise<JobExampleData | null> {
  // Check cache first
  if (yamlCache.has(slug)) {
    return yamlCache.get(slug)!;
  }

  try {
    // Fetch the YAML file from the public directory
    const response = await fetch(`/examples/${slug}.yml`);

    if (!response.ok) {
      console.error(`Failed to load job example: ${slug}`, response.status);
      return null;
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText) as JobExampleData;

    // Validate required fields
    if (!data?.meta?.slug || !data?.resume) {
      console.error(`Invalid job example data for: ${slug}`);
      return null;
    }

    // Cache the result
    yamlCache.set(slug, data);

    return data;
  } catch (error) {
    console.error(`Error loading job example: ${slug}`, error);
    return null;
  }
}

/**
 * Preload multiple job examples (useful for related jobs)
 * @param slugs - Array of job slugs to preload
 */
export async function preloadJobExamples(slugs: string[]): Promise<void> {
  await Promise.all(slugs.map(slug => loadJobExample(slug)));
}

/**
 * Clear the YAML cache (useful for development)
 */
export function clearYamlCache(): void {
  yamlCache.clear();
}

/**
 * Check if a job example exists in the cache
 */
export function isJobExampleCached(slug: string): boolean {
  return yamlCache.has(slug);
}

/**
 * Convert resume content from YAML format to the format expected by the editor
 * This allows "Edit This Template" functionality to load the resume into the builder
 */
export function convertToEditorFormat(yamlResume: JobExampleData['resume']): object {
  return {
    template: yamlResume.template,
    contact: yamlResume.contact,
    sections: [
      {
        id: 'summary',
        type: 'text',
        title: 'Professional Summary',
        content: yamlResume.summary,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Work Experience',
        content: yamlResume.experience.map((exp, index) => ({
          id: `exp-${index}`,
          company: exp.company,
          title: exp.title,
          dates: exp.dates,
          location: exp.location || '',
          description: exp.bullets.map(bullet => `- ${bullet}`).join('\n'),
        })),
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education',
        content: yamlResume.education.map((edu, index) => ({
          id: `edu-${index}`,
          school: edu.school,
          degree: edu.degree,
          year: edu.year,
          gpa: edu.gpa || '',
          honors: edu.honors || '',
        })),
      },
      {
        id: 'skills',
        type: 'dynamic-column-list',
        title: 'Skills',
        content: yamlResume.skills,
      },
      ...(yamlResume.certifications && yamlResume.certifications.length > 0
        ? [{
            id: 'certifications',
            type: 'bulleted-list',
            title: 'Certifications',
            content: yamlResume.certifications,
          }]
        : []),
    ],
  };
}
