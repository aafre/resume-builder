// src/services/validationService.ts
// Pure validation functions (no React dependencies)

import { validatePlatformUrl as platformUrlValidator } from '../constants/socialPlatforms';

/**
 * Validates LinkedIn profile URL format
 * Handles various LinkedIn URL formats with country codes, subdomains, and profile paths
 *
 * @param url - LinkedIn profile URL to validate
 * @returns true if valid or empty, false if invalid
 *
 * @example
 * validateLinkedInUrl('linkedin.com/in/johndoe') // true
 * validateLinkedInUrl('uk.linkedin.com/in/johndoe') // true
 * validateLinkedInUrl('linkedin.com/pub/johndoe') // true
 * validateLinkedInUrl('') // true (empty is valid)
 * validateLinkedInUrl('invalid-url') // false
 */
export const validateLinkedInUrl = (url: string): boolean => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return true; // Empty is valid (optional field)
  }

  const urlLower = trimmedUrl.toLowerCase();

  // Optimized LinkedIn URL regex that handles:
  // - Any subdomain (country codes, www, mobile, etc.)
  // - Personal profiles (/in/, /pub/, /public-profile/in/, /public-profile/pub/)
  // - Username length validation (3-100 characters)
  // - Optional trailing slash
  const linkedinProfilePattern = /^(https?:\/\/)?([a-z0-9-]+\.)?linkedin\.com\/(?:public-profile\/)?(in|pub)\/[a-z0-9-]{3,100}\/?$/;

  return linkedinProfilePattern.test(urlLower);
};

/**
 * Validates social media platform URL
 * Re-exported from socialPlatforms.ts for centralized validation access
 *
 * @param platform - Platform ID (e.g., 'github', 'twitter', 'linkedin')
 * @param url - Profile URL to validate
 * @returns Validation result with valid boolean and optional error message
 *
 * @example
 * validatePlatformUrl('github', 'github.com/user') // { valid: true }
 * validatePlatformUrl('github', 'invalid') // { valid: false, error: '...' }
 * validatePlatformUrl('github', '') // { valid: true } (empty is valid)
 */
export const validatePlatformUrl = platformUrlValidator;

/**
 * Validation result for icon file size
 */
export interface IconSizeValidationResult {
  valid: boolean;
  error?: string;
  sizeKB?: number;
}

/**
 * Validates icon file size (max 500KB)
 *
 * @param file - File object to validate
 * @returns Validation result with file size in KB
 *
 * @example
 * validateIconSize(smallFile) // { valid: true, sizeKB: 45 }
 * validateIconSize(largeFile) // { valid: false, error: 'File size...', sizeKB: 650 }
 */
export const validateIconSize = (file: File): IconSizeValidationResult => {
  const MAX_SIZE_KB = 500;
  const sizeKB = Math.round(file.size / 1024);

  if (sizeKB > MAX_SIZE_KB) {
    return {
      valid: false,
      error: `File size (${sizeKB}KB) exceeds maximum allowed size of ${MAX_SIZE_KB}KB`,
      sizeKB
    };
  }

  return {
    valid: true,
    sizeKB
  };
};

/**
 * Validation result for YAML structure
 */
export interface YAMLValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates YAML resume data structure
 * Ensures required fields (contact_info, sections) exist and are properly typed
 *
 * @param data - Parsed YAML data object
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateYAMLStructure({ contact_info: {...}, sections: [...] }) // { valid: true }
 * validateYAMLStructure({}) // { valid: false, error: 'Missing required field: contact_info' }
 * validateYAMLStructure({ contact_info: {...} }) // { valid: false, error: 'Missing required field: sections' }
 * validateYAMLStructure({ contact_info: {...}, sections: 'not-array' }) // { valid: false, error: 'Field "sections" must be an array' }
 */
export const validateYAMLStructure = (data: any): YAMLValidationResult => {
  // Check if data exists
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'Invalid YAML data: expected an object'
    };
  }

  // Check required fields exist
  if (!data.hasOwnProperty('contact_info')) {
    return {
      valid: false,
      error: 'Missing required field: contact_info'
    };
  }

  // Validate contact_info is an object (not null, not array, not primitive)
  if (typeof data.contact_info !== 'object' ||
      data.contact_info === null ||
      Array.isArray(data.contact_info)) {
    return {
      valid: false,
      error: 'Field "contact_info" must be an object'
    };
  }

  if (!data.hasOwnProperty('sections')) {
    return {
      valid: false,
      error: 'Missing required field: sections'
    };
  }

  // Validate sections is an array
  if (!Array.isArray(data.sections)) {
    return {
      valid: false,
      error: 'Field "sections" must be an array'
    };
  }

  return {
    valid: true
  };
};
