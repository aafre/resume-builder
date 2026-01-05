// src/services/yamlService.ts
// Pure functions for YAML export/import operations (no React dependencies)

import yaml from 'js-yaml';
import { Section, ContactInfo } from '../types';
import { PortableYAMLData, IconExportData } from '../types/iconTypes';
import { migrateLegacySections } from '../utils/sectionMigration';
import { extractReferencedIconFilenames } from '../utils/iconExtractor';
import { isExperienceSection, isEducationSection } from '../utils/sectionTypeChecker';
import { validateYAMLStructure } from './validationService';

/**
 * Icon registry interface for YAML service operations
 * Matches the subset of useIconRegistry methods needed for export/import
 */
export interface IconRegistryForYAML {
  exportIconsForYAML: (filenames?: string[]) => Promise<IconExportData>;
  importIconsFromYAML: (iconData: IconExportData) => Promise<void>;
}

/**
 * Temporary fields added to items during editing (removed during export)
 */
interface TempIconFields {
  iconFile?: File;
  iconBase64?: string;
}

/**
 * Base item with icon support and temporary fields
 * Used for icon-list, experience, and education items during processing
 */
interface ItemWithIcon extends TempIconFields {
  icon?: string | null;
  [key: string]: any; // Allow flexible properties for different item types
}

/**
 * Processes sections for export by cleaning icon paths and removing temporary fields
 * Removes iconFile and iconBase64 fields, cleans "/icons/" prefix from icon paths
 *
 * @param sections - Array of resume sections to process
 * @returns Processed sections with cleaned icon references
 *
 * @example
 * const sections = [
 *   {
 *     name: "Experience",
 *     type: "experience",
 *     content: [{ company: "ACME", icon: "/icons/logo.png", iconFile: fileObj, iconBase64: "data:..." }]
 *   }
 * ];
 * const cleaned = processSectionsForExport(sections);
 * // Result: icon becomes "logo.png", iconFile and iconBase64 are removed
 */
export const processSectionsForExport = (sections: Section[]): Section[] => {
  return sections.map((section) => {
    // Handle icon-list sections (Certifications, Awards, etc.)
    if (section.type === "icon-list") {
      const updatedContent = section.content.map((item: ItemWithIcon) => {
        // Remove iconFile and iconBase64 for export, keep only clean icon filename
        const { iconFile, iconBase64, ...cleanItem } = item;
        return {
          ...cleanItem,
          icon: cleanItem.icon
            ? cleanItem.icon.startsWith("/icons/")
              ? cleanItem.icon.replace("/icons/", "")
              : cleanItem.icon
            : null,
        };
      });
      return {
        ...section,
        content: updatedContent,
      };
    }

    // Handle Experience and Education sections
    if (isExperienceSection(section) || isEducationSection(section)) {
      const updatedContent = Array.isArray(section.content)
        ? section.content.map((item: ItemWithIcon) => {
            // Remove iconFile and iconBase64 for export, keep only clean icon filename
            const { iconFile, iconBase64, ...rest } = item;
            return {
              ...rest,
              icon: rest.icon
                ? rest.icon.startsWith("/icons/")
                  ? rest.icon.replace("/icons/", "")
                  : rest.icon
                : null,
            };
          })
        : section.content;

      return {
        ...section,
        content: updatedContent,
      };
    }

    // Return section unchanged if it doesn't have icons
    return section;
  });
};

/**
 * Export result from exportResumeAsYAML
 */
export interface YAMLExportResult {
  /** YAML blob ready for download */
  blob: Blob;
  /** Number of icons embedded in the export */
  iconCount: number;
}

/**
 * Exports resume data as YAML with optional embedded icons
 * Creates a portable YAML file with base64-encoded icons when present
 *
 * @param contactInfo - Contact information object
 * @param sections - Array of resume sections
 * @param iconRegistry - Icon registry for exporting icons
 * @returns Export result with blob and icon count
 *
 * @example
 * const result = await exportResumeAsYAML(contactInfo, sections, iconRegistry);
 * // result.blob - YAML file blob
 * // result.iconCount - 3 (if 3 icons were embedded)
 */
export const exportResumeAsYAML = async (
  contactInfo: ContactInfo | null,
  sections: Section[],
  iconRegistry: IconRegistryForYAML
): Promise<YAMLExportResult> => {
  // Process sections to clean icon paths
  const processedSections = processSectionsForExport(sections);

  // Extract all referenced icon filenames from the sections
  const referencedIcons = extractReferencedIconFilenames(processedSections);

  // Get icon data for only the referenced icons (efficient export)
  const iconData =
    referencedIcons.length > 0
      ? await iconRegistry.exportIconsForYAML(referencedIcons)
      : {};

  // Create portable YAML with embedded icons
  const portableData: PortableYAMLData = {
    contact_info: contactInfo,
    sections: processedSections,
  };

  // Only include __icons__ section if there are icons to embed
  if (Object.keys(iconData).length > 0) {
    portableData.__icons__ = iconData;
  }

  const yamlData = yaml.dump(portableData);
  const blob = new Blob([yamlData], { type: "application/x-yaml" });

  return {
    blob,
    iconCount: Object.keys(iconData).length,
  };
};

/**
 * Import result from importResumeFromYAML
 */
export interface YAMLImportResult {
  /** Parsed and migrated contact information */
  contactInfo: ContactInfo | null;
  /** Parsed and migrated sections */
  sections: Section[];
  /** Number of icons imported from the YAML */
  iconCount: number;
}

/**
 * Imports resume data from YAML string with optional embedded icons
 * Parses YAML, imports icons into registry, and migrates legacy sections
 *
 * @param yamlString - YAML content as string
 * @param iconRegistry - Icon registry for importing icons
 * @returns Import result with contact info, sections, and icon count
 * @throws Error if YAML parsing fails
 *
 * @example
 * const result = await importResumeFromYAML(yamlContent, iconRegistry);
 * // result.contactInfo - { name: "John", email: "..." }
 * // result.sections - [{ name: "Experience", ... }]
 * // result.iconCount - 3 (if 3 icons were imported)
 */
export const importResumeFromYAML = async (
  yamlString: string,
  iconRegistry: IconRegistryForYAML
): Promise<YAMLImportResult> => {
  // Parse YAML content
  const parsedData = yaml.load(yamlString);

  // Validate structure before type assertion
  const validation = validateYAMLStructure(parsedData);
  if (!validation.valid) {
    throw new Error(`Invalid YAML structure: ${validation.error}`);
  }

  // Safe to assert type after validation
  const parsedYaml = parsedData as PortableYAMLData;

  // Import icons first if they exist in the YAML
  let iconCount = 0;
  if (parsedYaml.__icons__ && Object.keys(parsedYaml.__icons__).length > 0) {
    await iconRegistry.importIconsFromYAML(parsedYaml.__icons__);
    iconCount = Object.keys(parsedYaml.__icons__).length;
  }

  // Migrate legacy sections (auto-add type property for backwards compatibility)
  const migratedSections = migrateLegacySections(parsedYaml.sections);

  return {
    contactInfo: parsedYaml.contact_info,
    sections: migratedSections,
    iconCount,
  };
};
