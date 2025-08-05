/**
 * Utility functions for extracting icon references from resume sections
 */

import { IconReference } from '../types/iconTypes';

interface Section {
  name: string;
  type?: string;
  content: any;
}

/**
 * Extract all unique icon filenames referenced in sections
 * @param sections - Array of resume sections
 * @returns Array of unique icon filenames that are actually used
 */
export const extractReferencedIconFilenames = (sections: Section[]): string[] => {
  const referencedIcons = new Set<string>();

  sections.forEach((section) => {
    // Handle Experience and Education sections
    if (['Experience', 'Education'].includes(section.name) && Array.isArray(section.content)) {
      section.content.forEach((item: any) => {
        if (item.icon && typeof item.icon === 'string' && item.icon.trim() !== '') {
          referencedIcons.add(item.icon);
        }
      });
    }

    // Handle icon-list sections (Certifications, Awards, etc.)
    if (section.type === 'icon-list' && Array.isArray(section.content)) {
      section.content.forEach((item: any) => {
        if (item.icon && typeof item.icon === 'string' && item.icon.trim() !== '') {
          referencedIcons.add(item.icon);
        }
      });
    }
  });

  return Array.from(referencedIcons);
};

/**
 * Extract detailed icon references with metadata (useful for debugging)
 * @param sections - Array of resume sections
 * @returns Array of icon references with location metadata
 */
export const extractDetailedIconReferences = (sections: Section[]): IconReference[] => {
  const references: IconReference[] = [];

  sections.forEach((section, _) => {
    // Handle Experience and Education sections
    if (['Experience', 'Education'].includes(section.name) && Array.isArray(section.content)) {
      section.content.forEach((item: any, itemIndex: number) => {
        if (item.icon && typeof item.icon === 'string' && item.icon.trim() !== '') {
          references.push({
            filename: item.icon,
            sectionName: section.name,
            sectionType: section.type || 'standard',
            itemIndex,
          });
        }
      });
    }

    // Handle icon-list sections (Certifications, Awards, etc.)
    if (section.type === 'icon-list' && Array.isArray(section.content)) {
      section.content.forEach((item: any, itemIndex: number) => {
        if (item.icon && typeof item.icon === 'string' && item.icon.trim() !== '') {
          references.push({
            filename: item.icon,
            sectionName: section.name,
            sectionType: section.type || 'unknown',
            itemIndex,
          });
        }
      });
    }
  });

  return references;
};

/**
 * Validate that all referenced icons are available in the registry
 * @param sections - Array of resume sections
 * @param availableIcons - Array of available icon filenames in registry
 * @returns Object with validation results
 */
export const validateIconReferences = (
  sections: Section[], 
  availableIcons: string[]
): { valid: string[]; missing: string[]; unused: string[] } => {
  const referencedIcons = extractReferencedIconFilenames(sections);
  const availableSet = new Set(availableIcons);
  const referencedSet = new Set(referencedIcons);

  const valid = referencedIcons.filter(icon => availableSet.has(icon));
  const missing = referencedIcons.filter(icon => !availableSet.has(icon));
  const unused = availableIcons.filter(icon => !referencedSet.has(icon));

  return { valid, missing, unused };
};