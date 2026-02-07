// src/utils/resumeDataExtractor.ts

import { ContactInfo, Section, ExperienceItem } from '../types';
import { isExperienceSection } from './sectionTypeChecker';
import { detectCountryCode } from './countryDetector';

export interface JobSearchParams {
  query: string;      // Most recent job title
  location: string;   // From contactInfo.location
  country: string;    // Detected Adzuna country code
}

/**
 * Extracts job search parameters from resume data.
 * Returns null if no job title can be determined (no experience sections).
 */
export function extractJobSearchParams(
  contactInfo: ContactInfo | null,
  sections: Section[],
): JobSearchParams | null {
  const location = contactInfo?.location?.trim() || '';

  // Find first experience section
  const experienceSection = sections.find(isExperienceSection);
  if (!experienceSection) return null;

  const items = experienceSection.content as ExperienceItem[];
  if (!items || items.length === 0) return null;

  // First item is most recent job
  const query = items[0].title?.trim();
  if (!query) return null;

  const country = detectCountryCode(location);

  return { query, location, country };
}
