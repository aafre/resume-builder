// src/utils/sectionMigration.ts

import { Section } from "../types";

/**
 * Migrates a single legacy section to the new format.
 * Auto-detects Experience and Education sections based on name and adds the type property.
 *
 * @param section - The section to migrate
 * @returns The migrated section with type property if applicable
 *
 * @example
 * // Legacy format (no type)
 * { name: "Experience", content: [...] }
 * // Becomes
 * { name: "Experience", type: "experience", content: [...] }
 */
export const migrateLegacySection = (section: Section): Section => {
  // Auto-detect Experience sections without type
  if (!section.type && section.name === "Experience") {
    return { ...section, type: "experience" as const } as Section;
  }

  // Auto-detect Education sections without type
  if (!section.type && section.name === "Education") {
    return { ...section, type: "education" as const } as Section;
  }

  // Return section unchanged if it already has a type or doesn't need migration
  return section;
};

/**
 * Migrates an array of legacy sections to the new format.
 * Applies migration logic to each section individually.
 *
 * @param sections - Array of sections to migrate
 * @returns Array of migrated sections
 *
 * @example
 * const oldSections = [
 *   { name: "Experience", content: [...] },
 *   { name: "Education", content: [...] },
 *   { name: "Skills", type: "bulleted-list", content: [...] }
 * ];
 * const newSections = migrateLegacySections(oldSections);
 * // Result: All sections have appropriate type properties
 */
export const migrateLegacySections = (sections: Section[]): Section[] => {
  return sections.map(migrateLegacySection);
};

/**
 * Checks if a section needs migration.
 * A section needs migration if it's an Experience or Education section without a type property.
 *
 * @param section - The section to check
 * @returns True if the section needs migration, false otherwise
 */
export const needsMigration = (section: Section): boolean => {
  return (
    (!section.type && section.name === "Experience") ||
    (!section.type && section.name === "Education")
  );
};

/**
 * Validates that a migrated section has the correct structure.
 *
 * @param section - The section to validate
 * @returns True if the section is valid, false otherwise
 */
export const isValidMigratedSection = (section: Section): boolean => {
  // Check that Experience sections have the correct type
  if (section.name === "Experience" || section.type === "experience") {
    return section.type === "experience" && Array.isArray(section.content);
  }

  // Check that Education sections have the correct type
  if (section.name === "Education" || section.type === "education") {
    return section.type === "education" && Array.isArray(section.content);
  }

  // Other sections are valid as-is
  return true;
};
