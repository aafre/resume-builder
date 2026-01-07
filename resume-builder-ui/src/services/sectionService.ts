// src/services/sectionService.ts
// Pure functions for section operations (no React dependencies)

import {
  Section,
  TextSection,
  BulletedListSection,
  InlineListSection,
  DynamicColumnListSection,
  IconListSection,
  ExperienceSection,
  EducationSection,
} from '../types';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Valid section type values that can be created
 * Derived from the Section union type discriminants
 */
export type SectionType =
  | 'text'
  | 'bulleted-list'
  | 'inline-list'
  | 'dynamic-column-list'
  | 'icon-list'
  | 'experience'
  | 'education';

/**
 * Type name mapping for section types
 */
const TYPE_NAME_MAP: Record<SectionType, string> = {
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
  type: SectionType,
  existingSections: Section[]
): string => {
  const baseName = TYPE_NAME_MAP[type];
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
 * Returns a fully typed Section object without type assertions by returning
 * complete objects from each switch case.
 *
 * @param type - Section type (must be a valid SectionType)
 * @param existingSections - Existing sections for unique name generation
 * @returns New Section object with default content
 *
 * @example
 * createDefaultSection('experience', [])
 * // Returns: { name: "New Experience Section", type: "experience", content: [{ company: "", title: "", dates: "", description: [""] }] }
 */
export const createDefaultSection = (
  type: SectionType,
  existingSections: Section[]
): Section => {
  const defaultName = getUniqueDefaultName(type, existingSections);

  // Return complete typed objects from each case to ensure proper type inference
  switch (type) {
    case "experience": {
      const section: ExperienceSection = {
        name: defaultName,
        type: "experience",
        content: [
          {
            company: "",
            title: "",
            dates: "",
            description: [""],
          },
        ],
      };
      return section;
    }
    case "education": {
      const section: EducationSection = {
        name: defaultName,
        type: "education",
        content: [
          {
            degree: "",
            school: "",
            year: "",
            field_of_study: "",
          },
        ],
      };
      return section;
    }
    case "text": {
      const section: TextSection = {
        name: defaultName,
        type: "text",
        content: "",
      };
      return section;
    }
    case "bulleted-list": {
      const section: BulletedListSection = {
        name: defaultName,
        type: "bulleted-list",
        content: [],
      };
      return section;
    }
    case "inline-list": {
      const section: InlineListSection = {
        name: defaultName,
        type: "inline-list",
        content: [],
      };
      return section;
    }
    case "dynamic-column-list": {
      const section: DynamicColumnListSection = {
        name: defaultName,
        type: "dynamic-column-list",
        content: [],
      };
      return section;
    }
    case "icon-list": {
      const section: IconListSection = {
        name: defaultName,
        type: "icon-list",
        content: [],
      };
      return section;
    }
  }
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

  // Type assertion needed because TypeScript can't track that the filtered content
  // maintains the same type as the original discriminated union member
  return {
    ...section,
    content: updatedContent,
  } as Section;
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
  // Type assertion needed because arrayMove can't infer type from discriminated union content
  const reorderedContent = arrayMove(section.content as unknown[], oldIndex, newIndex);

  return {
    ...section,
    content: reorderedContent,
  } as Section;
};
