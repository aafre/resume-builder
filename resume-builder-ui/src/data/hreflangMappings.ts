/**
 * Hreflang Mappings
 * Defines CV (UK/EU/AU/NZ) and Resume (US) page pairs for international SEO
 * Used by sitemap generator to add xhtml:link alternate tags
 */

export interface HreflangPair {
  /** US/default resume page path */
  resume: string;
  /** UK/AU/NZ CV page path */
  cv: string;
}

/**
 * CV (UK/EU/AU/NZ) ↔ Resume (US) page pairs
 * Each pair represents semantically equivalent pages for different regional terminology
 */
export const HREFLANG_PAIRS: HreflangPair[] = [
  {
    resume: '/templates',
    cv: '/cv-templates',
  },
  {
    resume: '/templates/ats-friendly',
    cv: '/cv-templates/ats-friendly',
  },
  {
    resume: '/free-resume-builder-no-sign-up',
    cv: '/free-cv-builder-no-sign-up',
  },
];

/**
 * Regions that use CV terminology (UK market + Commonwealth)
 * en-GB: United Kingdom
 * en-AU: Australia
 * en-NZ: New Zealand
 */
export const CV_REGIONS = ['en-GB', 'en-AU', 'en-NZ'] as const;

/** US region for resume pages */
export const RESUME_REGION = 'en-US' as const;

/** Default/fallback region (points to resume version) */
export const DEFAULT_REGION = 'x-default' as const;

export type CvRegion = (typeof CV_REGIONS)[number];
export type HreflangRegion = CvRegion | typeof RESUME_REGION | typeof DEFAULT_REGION;

/**
 * Get all hreflang regions
 */
export function getAllHreflangRegions(): HreflangRegion[] {
  return [...CV_REGIONS, RESUME_REGION, DEFAULT_REGION];
}

/**
 * Find the hreflang pair for a given URL path
 * @param path - URL path to check
 * @returns HreflangPair if path is part of a pair, undefined otherwise
 */
export function findHreflangPair(path: string): HreflangPair | undefined {
  return HREFLANG_PAIRS.find(pair => pair.resume === path || pair.cv === path);
}

/**
 * Check if a path is a CV page (vs resume page)
 * @param path - URL path to check
 */
export function isCvPage(path: string): boolean {
  return HREFLANG_PAIRS.some(pair => pair.cv === path);
}

/**
 * Check if a path is a resume page (vs CV page)
 * @param path - URL path to check
 */
export function isResumePage(path: string): boolean {
  return HREFLANG_PAIRS.some(pair => pair.resume === path);
}

/**
 * Get all CV page paths
 */
export function getAllCvPaths(): string[] {
  return HREFLANG_PAIRS.map(pair => pair.cv);
}

/**
 * Get all resume page paths that have CV equivalents
 */
export function getAllResumePathsWithCvPairs(): string[] {
  return HREFLANG_PAIRS.map(pair => pair.resume);
}
