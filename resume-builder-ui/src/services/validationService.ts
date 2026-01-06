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
 * Uses the improved `validateLinkedInUrl` for LinkedIn and falls back to the
 * validator from `socialPlatforms.ts` for others.
 *
 * @param platform - Platform ID (e.g., 'github', 'twitter', 'linkedin')
 * @param url - Profile URL to validate
 * @returns Validation result with valid boolean and optional error message
 *
 * @example
 * validatePlatformUrl('github', 'github.com/user') // { valid: true }
 * validatePlatformUrl('linkedin', 'linkedin.com/in/johndoe') // { valid: true }
 * validatePlatformUrl('github', 'invalid') // { valid: false, error: '...' }
 */
export const validatePlatformUrl = (
  platform: string,
  url: string
): { valid: boolean; error?: string } => {
  if (platform === 'linkedin') {
    return validateLinkedInUrl(url)
      ? { valid: true }
      : { valid: false, error: 'Please enter a valid LinkedIn profile URL' };
  }
  return platformUrlValidator(platform, url);
};

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
 * @param data - Parsed YAML data object (unknown type for safety)
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateYAMLStructure({ contact_info: {...}, sections: [...] }) // { valid: true }
 * validateYAMLStructure({}) // { valid: false, error: 'Missing required field: contact_info' }
 * validateYAMLStructure({ contact_info: {...} }) // { valid: false, error: 'Missing required field: sections' }
 * validateYAMLStructure({ contact_info: {...}, sections: 'not-array' }) // { valid: false, error: 'Field "sections" must be an array' }
 */
export const validateYAMLStructure = (data: unknown): YAMLValidationResult => {
  // Check if data is a non-null object
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'Invalid YAML data: expected an object'
    };
  }

  // Check required fields exist
  if (!('contact_info' in data)) {
    return {
      valid: false,
      error: 'Missing required field: contact_info'
    };
  }

  const { contact_info } = data as { contact_info: unknown };
  // Validate contact_info is an object (not null, not array, not primitive)
  if (
    typeof contact_info !== 'object' ||
    contact_info === null ||
    Array.isArray(contact_info)
  ) {
    return {
      valid: false,
      error: 'Field "contact_info" must be an object'
    };
  }

  if (!('sections' in data)) {
    return {
      valid: false,
      error: 'Missing required field: sections'
    };
  }

  const { sections } = data as { sections: unknown };
  // Validate sections is an array
  if (!Array.isArray(sections)) {
    return {
      valid: false,
      error: 'Field "sections" must be an array'
    };
  }

  return {
    valid: true
  };
};

/**
 * Validation result for API resume data
 */
export interface ResumeValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates resume data structure from API response
 * Ensures required fields exist and are properly typed before using the data
 *
 * @param data - Resume data from API (unknown type for safety)
 * @returns Validation result with error message if invalid
 *
 * @example
 * validateResumeStructure({ id: '...', contact_info: {...}, sections: [...], template_id: 'modern' })
 * // { valid: true }
 * validateResumeStructure({}) // { valid: false, error: 'Missing required field: id' }
 * validateResumeStructure({ id: '...', contact_info: {...} })
 * // { valid: false, error: 'Missing required field: sections' }
 */
export const validateResumeStructure = (data: unknown): ResumeValidationResult => {
  // Check if data is a non-null object
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'Invalid resume data: expected an object'
    };
  }

  // Check required fields exist
  const requiredFields = ['id', 'contact_info', 'sections', 'template_id'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      return {
        valid: false,
        error: `Missing required field: ${field}`
      };
    }
  }

  const typedData = data as Record<string, unknown>;

  // Validate id is a string
  if (typeof typedData.id !== 'string' || !typedData.id) {
    return {
      valid: false,
      error: 'Field "id" must be a non-empty string'
    };
  }

  // Validate contact_info is an object
  if (
    typeof typedData.contact_info !== 'object' ||
    typedData.contact_info === null ||
    Array.isArray(typedData.contact_info)
  ) {
    return {
      valid: false,
      error: 'Field "contact_info" must be an object'
    };
  }

  // Validate sections is an array
  if (!Array.isArray(typedData.sections)) {
    return {
      valid: false,
      error: 'Field "sections" must be an array'
    };
  }

  // Validate template_id is a string
  if (typeof typedData.template_id !== 'string' || !typedData.template_id) {
    return {
      valid: false,
      error: 'Field "template_id" must be a non-empty string'
    };
  }

  // Validate optional icons field if present
  if ('icons' in typedData) {
    if (!Array.isArray(typedData.icons)) {
      return {
        valid: false,
        error: 'Field "icons" must be an array'
      };
    }

    // Validate each icon has required properties
    for (let i = 0; i < typedData.icons.length; i++) {
      const icon = typedData.icons[i];
      if (!icon || typeof icon !== 'object') {
        return {
          valid: false,
          error: `Icon at index ${i} must be an object`
        };
      }

      const iconObj = icon as Record<string, unknown>;
      if (typeof iconObj.filename !== 'string' || !iconObj.filename) {
        return {
          valid: false,
          error: `Icon at index ${i} missing required field: filename`
        };
      }

      if (typeof iconObj.storage_url !== 'string' || !iconObj.storage_url) {
        return {
          valid: false,
          error: `Icon at index ${i} missing required field: storage_url`
        };
      }
    }
  }

  // Validate optional AI fields if present
  if ('ai_import_warnings' in typedData) {
    if (!Array.isArray(typedData.ai_import_warnings)) {
      return {
        valid: false,
        error: 'Field "ai_import_warnings" must be an array'
      };
    }
  }

  if ('ai_import_confidence' in typedData) {
    if (typeof typedData.ai_import_confidence !== 'number') {
      return {
        valid: false,
        error: 'Field "ai_import_confidence" must be a number'
      };
    }
  }

  return {
    valid: true
  };
};
