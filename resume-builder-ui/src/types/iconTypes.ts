/**
 * Type definitions for icon export/import system
 */

// Individual icon data for export/import
export interface IconExportItem {
  // Base64 data URL (e.g., "data:image/png;base64,iVBORw0KGgo...")
  data: string;
  // MIME type (e.g., "image/png", "image/jpeg")
  type: string;
  // File size in bytes
  size: number;
  // Upload timestamp for metadata
  uploadedAt: string;
}

// Collection of icons for export/import
export interface IconExportData {
  [filename: string]: IconExportItem;
}

// Enhanced YAML structure with embedded icons
export interface PortableYAMLData {
  contact_info: any;
  sections: any[];
  // Special section containing all referenced icons
  __icons__?: IconExportData;
}

// Storage format for localStorage persistence
export interface IconStorageData {
  // Icon registry data
  icons: IconExportData;
  // Metadata
  version: string;
  timestamp: string;
}

// Utility type for extracting icon references from sections
export interface IconReference {
  filename: string;
  sectionName: string;
  sectionType: string;
  itemIndex: number;
}