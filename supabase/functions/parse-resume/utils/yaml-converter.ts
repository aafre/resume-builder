/**
 * YAML conversion utility
 * Converts validated Resume JSON to YAML format for import
 */

import { stringify } from 'npm:yaml@2.3.4';
import type { ResumeTemplate } from '../types.ts';

/**
 * Convert Resume JSON to YAML string
 * @param resume - Validated ResumeTemplate object
 * @returns YAML string ready for import into editor
 */
export function convertToYAML(resume: ResumeTemplate): string {
  // Remove metadata fields that shouldn't be in output
  const cleanResume = { ...resume };
  delete (cleanResume as any).confidence;
  delete (cleanResume as any).warnings;

  // Convert to YAML with proper formatting
  const yaml = stringify(cleanResume, {
    indent: 2, // 2-space indentation
    lineWidth: 0, // No line wrapping
    defaultFlowStyle: null, // Use block style (not inline)
  });

  return yaml;
}
