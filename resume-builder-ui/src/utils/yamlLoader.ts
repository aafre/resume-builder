/**
 * YAML Loader Utility
 * Loads and parses job example YAML files from the samples/examples directory
 */

import yaml from 'js-yaml';
import type { JobExampleData } from '../data/jobExamples/types';

/**
 * Cache entry with timestamp for TTL support
 */
interface CacheEntry {
  data: JobExampleData;
  timestamp: number;
}

/**
 * Cache for loaded YAML files to avoid repeated fetches
 * Entries expire after CACHE_TTL_MS to ensure content freshness
 */
const yamlCache = new Map<string, CacheEntry>();

/**
 * Cache TTL in milliseconds (30 minutes)
 * Static YAML content rarely changes, but this ensures eventual consistency
 */
const CACHE_TTL_MS = 30 * 60 * 1000;

/**
 * Load a job example YAML file by slug
 * @param slug - The job example slug (e.g., "customer-service-representative")
 * @returns The parsed job example data
 */
export async function loadJobExample(slug: string): Promise<JobExampleData | null> {
  // Check cache first (with TTL validation)
  const cached = yamlCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
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

    // Cache the result with timestamp
    yamlCache.set(slug, { data, timestamp: Date.now() });

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
 * Check if a job example exists in the cache (and is not expired)
 */
export function isJobExampleCached(slug: string): boolean {
  const cached = yamlCache.get(slug);
  return !!cached && Date.now() - cached.timestamp < CACHE_TTL_MS;
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
        name: 'Professional Summary',
        content: yamlResume.summary,
      },
      {
        id: 'experience',
        type: 'experience',
        name: 'Work Experience',
        content: yamlResume.experience.map((exp, index) => ({
          id: `exp-${index}`,
          company: exp.company,
          title: exp.title,
          dates: exp.dates,
          location: exp.location || '',
          description: exp.bullets,
        })),
      },
      {
        id: 'education',
        type: 'education',
        name: 'Education',
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
        name: 'Skills',
        content: yamlResume.skills,
      },
      ...(yamlResume.certifications && yamlResume.certifications.length > 0
        ? [{
            id: 'certifications',
            type: 'bulleted-list',
            name: 'Certifications',
            content: yamlResume.certifications,
          }]
        : []),
      ...(yamlResume.projects && yamlResume.projects.length > 0
        ? [{
            id: 'projects',
            type: 'experience',
            name: 'Projects',
            content: yamlResume.projects.map((proj, index) => ({
              id: `proj-${index}`,
              company: '',
              title: proj.name,
              dates: '',
              location: '',
              description: [proj.description],
            })),
          }]
        : []),
    ],
  };
}
