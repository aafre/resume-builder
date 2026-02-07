// src/utils/resumeDataExtractor.ts

import { ContactInfo, Section, ExperienceItem } from '../types';
import { isExperienceSection } from './sectionTypeChecker';
import { detectCountryCode, sanitizeLocationForSearch } from './countryDetector';
import { normalizeJobTitle } from './jobTitleNormalizer';

export type SeniorityLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export interface JobSearchParams {
  query: string;           // Normalized title for API
  displayTitle: string;    // Original title for UI display
  location: string;        // From contactInfo.location
  country: string;         // Detected Adzuna country code
  category: string | null; // Adzuna category tag
  skills: string[];        // Extracted from skills sections for what_or
  seniorityLevel: SeniorityLevel; // Detected from titles
  yearsExperience: number; // Estimated from date ranges
}

const SENIORITY_MAP: Record<string, SeniorityLevel> = {
  junior: 'entry',
  associate: 'entry',
  senior: 'senior',
  lead: 'lead',
  principal: 'lead',
  staff: 'senior',
  director: 'executive',
  vp: 'executive',
  chief: 'executive',
  head: 'executive',
};

/**
 * Detects seniority level from a list of job titles (most recent first).
 * Checks the most recent title first; falls back to "mid" if unrecognized.
 */
export function detectSeniority(titles: string[]): SeniorityLevel {
  for (const title of titles) {
    const { seniority } = normalizeJobTitle(title);
    if (seniority) {
      const level = SENIORITY_MAP[seniority.toLowerCase()];
      if (level) return level;
    }
  }
  return 'mid';
}

/**
 * Estimates total years of experience by parsing date ranges from experience items.
 * Finds the earliest start date and latest end date across all items.
 * Returns 0 if no dates can be parsed.
 */
export function estimateYearsExperience(items: ExperienceItem[]): number {
  let earliest = Infinity;
  let latest = -Infinity;

  for (const item of items) {
    const dates = item.dates?.trim();
    if (!dates) continue;

    // Match year patterns: "2018 - 2022", "2018 - Present", "Jan 2020 - Dec 2023", etc.
    const years = dates.match(/\b(20\d{2}|19\d{2})\b/g);
    if (!years) continue;

    for (const y of years) {
      const num = parseInt(y, 10);
      if (num < earliest) earliest = num;
      if (num > latest) latest = num;
    }

    // "Present" or "Current" → use current year
    if (/\b(present|current|now)\b/i.test(dates)) {
      const currentYear = new Date().getFullYear();
      if (currentYear > latest) latest = currentYear;
    }
  }

  if (earliest === Infinity || latest === -Infinity) return 0;
  return Math.max(0, latest - earliest);
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

  // Extract all titles for seniority detection
  const allTitles = items.map((item) => item.title?.trim()).filter(Boolean) as string[];
  const seniorityLevel = detectSeniority(allTitles);
  const yearsExperience = estimateYearsExperience(items);

  return { query, displayTitle: rawTitle, location: searchLocation, country, category, skills, seniorityLevel, yearsExperience };
}

const SKILL_SECTION_TYPES = new Set(['inline-list', 'dynamic-column-list']);
const MAX_SKILLS = 5;

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
