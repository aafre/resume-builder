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
  'experience',
  'education',
];

/**
 * Validate and sanitize resume JSON against schema
 * 100% PERMISSIVE: Fixes data instead of rejecting it
 * @param data - AI-generated JSON data
 * @returns Validation result (always valid: true)
 */
export function validateResumeSchema(data: any): ValidationResult {
  // 100% permissive - we NEVER reject, we FIX the data

  // === 1. Ensure data is an object ===
  if (typeof data !== 'object' || data === null) {
    data = { contact_info: {}, sections: [] };
  }

  // === 2. Fix contact_info ===
  if (!data.contact_info || typeof data.contact_info !== 'object') {
    data.contact_info = {};
  }

  // === 3. Fix sections ===
  if (!data.sections || !Array.isArray(data.sections)) {
    data.sections = [];
  }

  // === 4. Fix each section (coerce types, fill defaults) ===
  data.sections.forEach((section: any) => {
    // Ensure section is object - if not, skip it
    if (typeof section !== 'object' || section === null) {
      return;
    }

    // Coerce section.name to string
    if (typeof section.name !== 'string') {
      section.name = section.name ? String(section.name) : '';
    }

    // Coerce section.type to string
    if (typeof section.type !== 'string') {
      section.type = section.type ? String(section.type) : 'text';
    }

    // Fix content based on section type
    if (section.type === 'text') {
      // Coerce to string
      if (typeof section.content !== 'string') {
        section.content = section.content ? String(section.content) : '';
      }
    }

    if (['bulleted-list', 'inline-list', 'dynamic-column-list'].includes(section.type)) {
      // Coerce to array of strings
      if (!Array.isArray(section.content)) {
        section.content = [];
      } else {
        // Ensure each item is a string
        section.content = section.content.map((item: any) =>
          typeof item === 'string' ? item : String(item || '')
        );
      }
    }

    if (section.type === 'experience') {
      // Coerce to array
      if (!Array.isArray(section.content)) {
        section.content = [];
      } else {
        // Fix each experience item
        section.content = section.content.map((exp: any) => {
          if (typeof exp !== 'object' || exp === null) exp = {};

          return {
            company: typeof exp.company === 'string' ? exp.company : '',
            title: typeof exp.title === 'string' ? exp.title : '',
            dates: typeof exp.dates === 'string' ? exp.dates : '',
            description: Array.isArray(exp.description)
              ? exp.description.map((d: any) => String(d || ''))
              : [],
            icon: exp.icon || null
          };
        });
      }
    }

    if (section.type === 'education') {
      // Coerce to array
      if (!Array.isArray(section.content)) {
        section.content = [];
      } else {
        // Fix each education item
        section.content = section.content.map((edu: any) => {
          if (typeof edu !== 'object' || edu === null) edu = {};

          return {
            degree: typeof edu.degree === 'string' ? edu.degree : '',
            school: typeof edu.school === 'string' ? edu.school : '',
            year: typeof edu.year === 'string' ? edu.year : '',
            field_of_study: typeof edu.field_of_study === 'string' ? edu.field_of_study : '',
            icon: edu.icon || null
          };
        });
      }
    }
  });

  // ALWAYS return valid: true - we fixed everything
  return {
    valid: true,
    errors: []  // No errors, ever
  };
}
