// src/utils/resumeDataExtractor.ts

import { ContactInfo, Section, ExperienceItem } from '../types';
import { isExperienceSection } from './sectionTypeChecker';
import { detectCountryCode, sanitizeLocationForSearch } from './countryDetector';
import { normalizeJobTitle } from './jobTitleNormalizer';

export interface JobSearchParams {
  query: string;           // Normalized title for API
  displayTitle: string;    // Original title for UI display
  location: string;        // From contactInfo.location
  country: string;         // Detected Adzuna country code
  category: string | null; // Adzuna category tag
  skills: string[];        // Extracted from skills sections for what_or
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
  const rawTitle = items[0].title?.trim();
  if (!rawTitle) return null;

  const { query, category } = normalizeJobTitle(rawTitle);
  if (!query) return null;

  const country = detectCountryCode(location);
  const searchLocation = sanitizeLocationForSearch(location);

  const skills = extractSkills(sections);

  return { query, displayTitle: rawTitle, location: searchLocation, country, category, skills };
}

const SKILL_SECTION_TYPES = new Set(['inline-list', 'dynamic-column-list']);
const MAX_SKILLS = 10;

/**
 * Extracts skill keywords from inline-list and dynamic-column-list sections.
 * Returns up to MAX_SKILLS non-empty string items.
 */
export function extractSkills(sections: Section[]): string[] {
  const skills: string[] = [];

  for (const section of sections) {
    if (!SKILL_SECTION_TYPES.has(section.type ?? '')) continue;

    const items = section.content;
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      if (typeof item === 'string' && item.trim()) {
        skills.push(item.trim());
        if (skills.length >= MAX_SKILLS) return skills;
      }
    }
  }

  return skills;
}
