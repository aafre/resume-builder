// src/hooks/editor/useFileOperations.ts
// Hook for handling YAML import/export operations

import { useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Section, ContactInfo } from '../../types';
import { UseFileOperationsReturn } from '../../types/editor';
import {
  exportResumeAsYAML,
  importResumeFromYAML,
  processSectionsForExport,
  IconRegistryForYAML,
} from '../../services/yamlService';
import { extractReferencedIconFilenames } from '../../utils/iconExtractor';

/**
 * Props for useFileOperations hook
 */
export interface UseFileOperationsProps {
  /** Current contact info */
  contactInfo: ContactInfo | null;
  /** Function to update contact info */
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo | null>>;
  /** Current sections array */
  sections: Section[];
  /** Function to update sections */
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  /** Icon registry for import/export */
  iconRegistry: IconRegistryForYAML;
  /** Save before action helper (returns false if save failed/cancelled) */
  saveBeforeAction: (actionName: string) => Promise<boolean>;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Whether current template supports icons */
  supportsIcons: boolean;
  /** Function to update original template data (for change detection) */
  setOriginalTemplateData: React.Dispatch<React.SetStateAction<{ contactInfo: ContactInfo; sections: Section[] } | null>>;
  /** Function to enable/disable auto-save after loading */
  setIsLoadingFromUrl: React.Dispatch<React.SetStateAction<boolean>>;
  /** Pending import file from modal manager */
  pendingImportFile: File | null;
  /** Function to open import confirmation dialog */
  openImportConfirm: (file: File) => void;
  /** Function to close import confirmation modal only (keeps file for processing) */
  closeImportConfirmModal: () => void;
  /** Function to clear the pending import file */
  clearPendingImportFile: () => void;
}

/**
 * Hook for handling YAML file import and export operations.
 *
 * Extracted from Editor.tsx to improve component organization and testability.
 * Uses yamlService for the actual YAML parsing/serialization.
 *
 * @param props - Configuration including state setters and dependencies
 * @returns Object with file operation handlers and loading states
 *
 * @example
 * const {
 *   handleExportYAML,
 *   handleFileInputChange,
 *   confirmImportYAML,
 *   loadingSave,
 *   loadingLoad,
 *   fileInputRef,
 * } = useFileOperations({
 *   contactInfo,
 *   sections,
 *   iconRegistry,
 *   // ... other props
 * });
 */
export const useFileOperations = ({
  contactInfo,
  setContactInfo,
  sections,
  setSections,
  iconRegistry,
  saveBeforeAction,
  isAnonymous,
  supportsIcons,
  setOriginalTemplateData,
  setIsLoadingFromUrl,
  pendingImportFile,
  openImportConfirm,
  closeImportConfirmModal,
  clearPendingImportFile,
}: UseFileOperationsProps): UseFileOperationsReturn => {
  // Loading states
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(false);

  // File input ref for triggering file picker
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Export resume as YAML file with embedded icons.
   * Saves current work first if user is authenticated.
   */
  const handleExportYAML = useCallback(async () => {
    // Save first to ensure export has latest changes
    const canProceed = await saveBeforeAction('export YAML');
    if (!canProceed) return;

    try {
      setLoadingSave(true);
      // Longer delay for noticeable feedback on file operations
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use yamlService to create the export
      const result = await exportResumeAsYAML(contactInfo, sections, iconRegistry);

      // Trigger download
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.yaml';
      link.click();
      URL.revokeObjectURL(url);

      // Show success message with icon count if applicable
      const message =
        result.iconCount > 0
          ? `Resume saved successfully with ${result.iconCount} embedded icon${
              result.iconCount === 1 ? '' : 's'
            }!`
          : 'Resume saved successfully!';
      toast.success(message);
    } catch (error) {
      console.error('Error exporting YAML:', error);
      toast.error('Save failed. Check browser settings and try again.');
    } finally {
      setLoadingSave(false);
    }
  }, [contactInfo, sections, iconRegistry, saveBeforeAction]);

  /**
   * Handle file input change - stores file and shows confirmation dialog.
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Store file and show confirmation dialog
      openImportConfirm(file);

      // Reset file input so the same file can be selected again
      event.target.value = '';
    },
    [openImportConfirm]
  );

  /**
   * Confirm and execute YAML import.
   * Saves current work first if user is authenticated and has content.
   */
  const confirmImportYAML = useCallback(async () => {
    if (!pendingImportFile) return;

    // Close modal but keep file for processing
    closeImportConfirmModal();

    // Save current work before importing (if authenticated and has content)
    if (!isAnonymous && contactInfo && sections.length > 0) {
      const canProceed = await saveBeforeAction('import YAML');
      if (!canProceed) {
        clearPendingImportFile();
        return;
      }
    }

    setLoadingLoad(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Longer delay for noticeable feedback on file operations
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const yamlContent = e.target?.result;
        if (typeof yamlContent !== 'string') {
          throw new Error('File content could not be read as text.');
        }
        const result = await importResumeFromYAML(yamlContent, iconRegistry);

        // Update state with imported data
        setContactInfo(result.contactInfo);

        // Process sections to clean up icon paths
        const processedSections = processSectionsForExport(result.sections);

        // Validate imported icons against template compatibility
        if (!supportsIcons) {
          const referencedIcons = extractReferencedIconFilenames(processedSections);
          if (referencedIcons.length > 0) {
            toast(
              `This template doesn't support icons. ${referencedIcons.length} icon(s) ` +
                `were found in the imported file and will be ignored.`,
              { duration: 8000, icon: '⚠️' }
            );
          }
        }

        setSections(processedSections);

        // Update originalTemplateData to reflect the imported YAML
        // This ensures hasDataChanged() returns false for the imported baseline
        if (result.contactInfo) {
          setOriginalTemplateData({
            contactInfo: result.contactInfo,
            sections: processedSections,
          });
        }

        // Enable auto-save after YAML import completes
        setIsLoadingFromUrl(false);

        // Show success message with icon count if applicable
        const message =
          result.iconCount > 0
            ? `Resume loaded successfully with ${result.iconCount} icon${
                result.iconCount === 1 ? '' : 's'
              }!`
            : 'Resume loaded successfully!';
        toast.success(message);
      } catch (error) {
        console.error('Error parsing YAML file:', error);
        toast.error('Invalid file format. Please upload a valid resume file.');
      } finally {
        setLoadingLoad(false);
        clearPendingImportFile();
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      toast.error('Failed to read file. Please try again.');
      setLoadingLoad(false);
      clearPendingImportFile();
    };

    reader.readAsText(pendingImportFile);
  }, [
    pendingImportFile,
    closeImportConfirmModal,
    isAnonymous,
    contactInfo,
    sections.length,
    saveBeforeAction,
    clearPendingImportFile,
    iconRegistry,
    setContactInfo,
    supportsIcons,
    setSections,
    setOriginalTemplateData,
    setIsLoadingFromUrl,
  ]);

  // Return stable object with useMemo
  return useMemo(
    () => ({
      // Export operations
      handleExportYAML,
      loadingSave,

      // Import operations
      handleFileInputChange,
      confirmImportYAML,
      loadingLoad,

      // File input ref
      fileInputRef,
    }),
    [
      handleExportYAML,
      loadingSave,
      handleFileInputChange,
      confirmImportYAML,
      loadingLoad,
    ]
  );
};
