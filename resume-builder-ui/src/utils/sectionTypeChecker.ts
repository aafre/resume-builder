// src/utils/sectionTypeChecker.ts

import { Section, ExperienceSection, EducationSection } from "../types";

/**
 * Checks if a section is an Experience section.
 * Supports both new format (with type property) and legacy format (name-based).
 *
 * @param section - The section to check
 * @returns True if the section is an Experience section, false otherwise
 *
 * @example
 * // New format
 * isExperienceSection({ name: "Work Experience", type: "experience", content: [] }) // true
 *
 * // Legacy format
 * isExperienceSection({ name: "Experience", content: [] }) // true
 *
 * // Not an experience section
 * isExperienceSection({ name: "Skills", type: "bulleted-list", content: [] }) // false
 */
export const isExperienceSection = (section: Section): section is ExperienceSection => {
  return (
    section.type === "experience" ||
    (!section.type && section.name === "Experience")
  );
};

/**
 * Checks if a section is an Education section.
 * Supports both new format (with type property) and legacy format (name-based).
 *
 * @param section - The section to check
 * @returns True if the section is an Education section, false otherwise
 *
 * @example
 * // New format
 * isEducationSection({ name: "Academic Background", type: "education", content: [] }) // true
 *
 * // Legacy format
 * isEducationSection({ name: "Education", content: [] }) // true
 *
 * // Not an education section
 * isEducationSection({ name: "Certifications", type: "icon-list", content: [] }) // false
 */
export const isEducationSection = (section: Section): section is EducationSection => {
  return (
    section.type === "education" ||
    (!section.type && section.name === "Education")
  );
};

/**
 * Checks if a section has icon support.
 * Currently, only Experience and Education sections support icons.
 *
 * @param section - The section to check
 * @returns True if the section supports icons, false otherwise
 */
export const supportsIcons = (section: Section): boolean => {
  return isExperienceSection(section) || isEducationSection(section);
};

/**
 * Gets the section type name for display purposes.
 *
 * @param section - The section to get the type name for
 * @returns A human-readable type name
 *
 * @example
 * getSectionTypeName({ name: "Skills", type: "bulleted-list", content: [] }) // "Bulleted List"
 * getSectionTypeName({ name: "Experience", type: "experience", content: [] }) // "Experience"
 */
export const getSectionTypeName = (section: Section): string => {
  if (isExperienceSection(section)) return "Experience";
  if (isEducationSection(section)) return "Education";

  switch (section.type) {
    case "text":
      return "Text";
    case "bulleted-list":
      return "Bulleted List";
    case "inline-list":
      return "Inline List";
    case "dynamic-column-list":
      return "Dynamic Column List";
    case "icon-list":
      return "Icon List";
    default:
      return "Generic";
  }
};

/**
 * Type guard to check if a section is one of the structured types
 * (Experience, Education, or Icon List) that have complex content.
 *
 * @param section - The section to check
 * @returns True if the section is a structured type, false otherwise
 */
export const isStructuredSection = (section: Section): boolean => {
  return (
    isExperienceSection(section) ||
    isEducationSection(section) ||
    section.type === "icon-list"
  );
};

/**
 * Checks if a section type supports multiple items/entries.
 *
 * @param section - The section to check
 * @returns True if the section supports multiple items, false otherwise
 */
export const supportsMultipleItems = (section: Section): boolean => {
  return (
    isExperienceSection(section) ||
    isEducationSection(section) ||
    section.type === "bulleted-list" ||
    section.type === "inline-list" ||
    section.type === "dynamic-column-list" ||
    section.type === "icon-list"
  );
};
