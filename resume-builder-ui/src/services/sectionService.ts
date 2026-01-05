// src/services/sectionService.ts
// Pure functions for section operations (no React dependencies)

import { Section } from '../types';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Type name mapping for section types
 */
const TYPE_NAME_MAP: { [key: string]: string } = {
  experience: "New Experience Section",
  education: "New Education Section",
  text: "New Text Section",
  "bulleted-list": "New Bulleted List Section",
  "inline-list": "New Inline List Section",
  "dynamic-column-list": "New Dynamic Column List Section",
  "icon-list": "New Icon List Section",
};

/**
 * Generates a unique section name based on type and existing sections
 * Case-insensitive comparison to avoid duplicates like "Experience" and "experience"
 *
 * @param type - Section type (e.g., "experience", "education")
 * @param existingSections - Array of existing sections to check against
 * @returns Unique section name (e.g., "New Experience Section", "New Experience Section 2")
 *
 * @example
 * getUniqueDefaultName('experience', []) // "New Experience Section"
 * getUniqueDefaultName('experience', [{ name: 'New Experience Section', ...}]) // "New Experience Section 2"
 */
export const getUniqueDefaultName = (
  type: string,
  existingSections: Section[]
): string => {
  const baseName = TYPE_NAME_MAP[type] || "New Section";
  // Use Set for O(1) lookup performance instead of Array.includes() O(n)
  const existingNames = new Set(existingSections.map((s) => s.name.toLowerCase()));

  // If base name doesn't exist, use it
  if (!existingNames.has(baseName.toLowerCase())) {
    return baseName;
  }

  // Otherwise, append a number starting from 2
  let counter = 2;
  let uniqueName = `${baseName} ${counter}`;
  while (existingNames.has(uniqueName.toLowerCase())) {
    counter++;
    uniqueName = `${baseName} ${counter}`;
  }
  return uniqueName;
};

/**
 * Creates a default section with appropriate empty content based on type
 *
 * @param type - Section type
 * @param existingSections - Existing sections for unique name generation
 * @returns New Section object with default content
 *
 * @example
 * createDefaultSection('experience', [])
 * // Returns: { name: "New Experience Section", type: "experience", content: [{ company: "", title: "", dates: "", description: [""], icon: null }] }
 */
export const createDefaultSection = (
  type: string,
  existingSections: Section[]
): Section => {
  const defaultName = getUniqueDefaultName(type, existingSections);

  let defaultContent;
  if (type === "experience") {
    // Default content for Experience sections
    defaultContent = [
      {
        company: "",
        title: "",
        dates: "",
        description: [""],
        icon: null,
      },
    ];
  } else if (type === "education") {
    // Default content for Education sections
    defaultContent = [
      {
        degree: "",
        school: "",
        year: "",
        field_of_study: "",
        icon: null,
      },
    ];
  } else if (
    [
      "bulleted-list",
      "inline-list",
      "dynamic-column-list",
      "icon-list",
    ].includes(type)
  ) {
    // List sections start with empty array
    defaultContent = [];
  } else {
    // Text sections start with empty string
    defaultContent = "";
  }

  return {
    name: defaultName,
    type: type,
    content: defaultContent,
  };
};

/**
 * Deletes an item from a section's content array
 * Returns a new section object (immutable operation)
 *
 * @param section - The section to delete from
 * @param itemIndex - Index of item to delete
 * @returns New section with item removed
 *
 * @example
 * deleteSectionItem(
 *   { name: "Experience", type: "experience", content: [item1, item2, item3] },
 *   1
 * )
 * // Returns: { name: "Experience", type: "experience", content: [item1, item3] }
 */
export const deleteSectionItem = (
  section: Section,
  itemIndex: number
): Section => {
  // Only process if content is an array
  if (!Array.isArray(section.content)) {
    return section;
  }

  const updatedContent = section.content.filter((_, i) => i !== itemIndex);

  return {
    ...section,
    content: updatedContent,
  };
};

/**
 * Reorders items within a section's content array
 * Used for drag-and-drop item reordering feature
 * Returns a new section object (immutable operation)
 *
 * @param section - The section to reorder items in
 * @param oldIndex - Current index of the item
 * @param newIndex - Target index for the item
 * @returns New section with items reordered
 *
 * @example
 * reorderSectionItems(
 *   { name: "Experience", type: "experience", content: [item1, item2, item3] },
 *   0,
 *   2
 * )
 * // Returns: { name: "Experience", type: "experience", content: [item2, item3, item1] }
 */
export const reorderSectionItems = (
  section: Section,
  oldIndex: number,
  newIndex: number
): Section => {
  // Only process if content is an array
  if (!Array.isArray(section.content)) {
    return section;
  }

  // No-op if empty array
  if (section.content.length === 0) {
    return section;
  }

  // No-op if indices are the same
  if (oldIndex === newIndex) {
    return section;
  }

  // Use @dnd-kit's arrayMove utility for consistent behavior with drag-drop
  const reorderedContent = arrayMove(section.content, oldIndex, newIndex);

  return {
    ...section,
    content: reorderedContent,
  };
};
