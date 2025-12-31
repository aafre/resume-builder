/**
 * Schema validation utility
 * Validates AI-generated JSON against ResumeTemplate schema (Pydantic-style validation)
 */

import type { ResumeTemplate } from '../types.ts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_SECTION_TYPES = [
  'text',
  'bulleted-list',
  'inline-list',
  'dynamic-column-list',
  'icon-list',
  'experience',
  'education',
];

/**
 * Validate resume JSON against schema
 * @param data - AI-generated JSON data
 * @returns Validation result with errors if invalid
 */
export function validateResumeSchema(data: any): ValidationResult {
  const errors: string[] = [];

  // Check if data is object
  if (typeof data !== 'object' || data === null) {
    errors.push('Resume data must be an object');
    return { valid: false, errors };
  }

  // === Validate contact_info (REQUIRED) ===
  if (!data.contact_info) {
    errors.push('Missing required field: contact_info');
  } else {
    const ci = data.contact_info;

    // Required fields
    if (!ci.name || typeof ci.name !== 'string') {
      errors.push('contact_info.name is required and must be a string');
    }

    if (!ci.location || typeof ci.location !== 'string') {
      errors.push('contact_info.location is required and must be a string');
    }

    if (!ci.email || typeof ci.email !== 'string') {
      errors.push('contact_info.email is required and must be a string');
    } else if (!ci.email.includes('@')) {
      errors.push('contact_info.email does not appear to be valid (missing @)');
    }

    if (!ci.phone || typeof ci.phone !== 'string') {
      errors.push('contact_info.phone is required and must be a string');
    }

    // Optional: Validate social_links structure
    if (ci.social_links) {
      if (!Array.isArray(ci.social_links)) {
        errors.push('contact_info.social_links must be an array');
      } else {
        ci.social_links.forEach((link: any, idx: number) => {
          if (!link.platform || typeof link.platform !== 'string') {
            errors.push(`social_links[${idx}]: missing or invalid 'platform'`);
          }
          if (!link.url || typeof link.url !== 'string') {
            errors.push(`social_links[${idx}]: missing or invalid 'url'`);
          }
        });
      }
    }
  }

  // === Validate sections (REQUIRED) ===
  if (!data.sections) {
    errors.push('Missing required field: sections');
  } else if (!Array.isArray(data.sections)) {
    errors.push('sections must be an array');
  } else {
    // Validate each section
    data.sections.forEach((section: any, idx: number) => {
      // Required fields
      if (!section.name || typeof section.name !== 'string') {
        errors.push(`sections[${idx}]: missing or invalid 'name'`);
      }

      if (!section.type || typeof section.type !== 'string') {
        errors.push(`sections[${idx}]: missing or invalid 'type'`);
      } else if (!VALID_SECTION_TYPES.includes(section.type)) {
        errors.push(
          `sections[${idx}]: unknown type '${section.type}'. Valid types: ${VALID_SECTION_TYPES.join(', ')}`
        );
      }

      if (section.content === undefined) {
        errors.push(`sections[${idx}]: missing required field 'content'`);
      }

      // Type-specific validation
      if (section.type === 'text') {
        if (typeof section.content !== 'string') {
          errors.push(`sections[${idx}]: text section content must be a string`);
        }
      }

      if (
        section.type === 'bulleted-list' ||
        section.type === 'inline-list' ||
        section.type === 'dynamic-column-list'
      ) {
        if (!Array.isArray(section.content)) {
          errors.push(
            `sections[${idx}]: ${section.type} content must be an array of strings`
          );
        }
      }

      // Experience section validation
      if (section.type === 'experience') {
        if (!Array.isArray(section.content)) {
          errors.push(`sections[${idx}]: experience content must be an array`);
        } else {
          section.content.forEach((exp: any, expIdx: number) => {
            if (!exp.company || typeof exp.company !== 'string') {
              errors.push(
                `sections[${idx}].content[${expIdx}]: missing or invalid 'company'`
              );
            }
            if (!exp.title || typeof exp.title !== 'string') {
              errors.push(
                `sections[${idx}].content[${expIdx}]: missing or invalid 'title'`
              );
            }
            if (!exp.dates || typeof exp.dates !== 'string') {
              errors.push(
                `sections[${idx}].content[${expIdx}]: missing or invalid 'dates'`
              );
            }
            if (!Array.isArray(exp.description)) {
              errors.push(
                `sections[${idx}].content[${expIdx}]: description must be an array of strings`
              );
            }
          });
        }
      }

      // Education section validation
      if (section.type === 'education') {
        if (!Array.isArray(section.content)) {
          errors.push(`sections[${idx}]: education content must be an array`);
        } else {
          section.content.forEach((edu: any, eduIdx: number) => {
            if (!edu.degree || typeof edu.degree !== 'string') {
              errors.push(
                `sections[${idx}].content[${eduIdx}]: missing or invalid 'degree'`
              );
            }
            if (!edu.school || typeof edu.school !== 'string') {
              errors.push(
                `sections[${idx}].content[${eduIdx}]: missing or invalid 'school'`
              );
            }
            if (!edu.year || typeof edu.year !== 'string') {
              errors.push(
                `sections[${idx}].content[${eduIdx}]: missing or invalid 'year'`
              );
            }
          });
        }
      }

      // Icon-list section validation
      if (section.type === 'icon-list') {
        if (!Array.isArray(section.content)) {
          errors.push(`sections[${idx}]: icon-list content must be an array`);
        } else {
          section.content.forEach((item: any, itemIdx: number) => {
            if (!item.certification || typeof item.certification !== 'string') {
              errors.push(
                `sections[${idx}].content[${itemIdx}]: missing or invalid 'certification'`
              );
            }
            if (!item.issuer || typeof item.issuer !== 'string') {
              errors.push(
                `sections[${idx}].content[${itemIdx}]: missing or invalid 'issuer'`
              );
            }
            if (!item.date || typeof item.date !== 'string') {
              errors.push(
                `sections[${idx}].content[${itemIdx}]: missing or invalid 'date'`
              );
            }
          });
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
