// src/hooks/editor/useEditorActions.ts
// Hook for handling top-level editor actions (download, preview, start fresh)

import { useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import yaml from 'js-yaml';
import { Section, ContactInfo } from '../../types';
import { UseEditorActionsReturn } from '../../types/editor';
import { generateResume } from '../../services/templates';
import { getSessionId } from '../../utils/session';
import { extractReferencedIconFilenames } from '../../utils/iconExtractor';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import { validateLinkedInUrl } from '../../services/validationService';

/**
 * Icon validation result from usePreview
 */
export interface IconValidationResult {
  valid: boolean;
  missingIcons: string[];
}

/**
 * Icon registry interface (subset of useIconRegistry)
 */
export interface IconRegistryForActions {
  getIconFile: (filename: string) => File | null;
  clearRegistry: () => void;
}

/**
 * Props for useEditorActions hook
 */
export interface UseEditorActionsProps {
  /** Current contact info */
  contactInfo: ContactInfo | null;
  /** Function to update contact info */
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo | null>>;
  /** Current sections array */
  sections: Section[];
  /** Function to update sections */
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  /** Current template ID */
  templateId: string | null;
  /** Whether current template supports icons */
  supportsIcons: boolean;
  /** Icon registry for file operations */
  iconRegistry: IconRegistryForActions;
  /** Function to process sections for export */
  processSections: (sections: Section[]) => Section[];
  /** Save before action helper (returns false if save failed/cancelled) */
  saveBeforeAction: (actionName: string) => Promise<boolean>;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Whether download celebration toast has been shown */
  hasShownDownloadToast: boolean;
  /** Function to mark download toast as shown */
  markDownloadToastShown: () => void;
  /** Original template data for start fresh */
  originalTemplateData: { contactInfo: ContactInfo; sections: Section[] } | null;
  /** Whether resume is loading from URL (for missing icons dialog) */
  isLoadingFromUrl: boolean;
  /** Preview hook: validate icons function */
  validateIcons: () => IconValidationResult;
  /** Preview hook: whether preview is stale */
  previewIsStale: boolean;
  /** Preview hook: clear preview */
  clearPreview: () => void;
  /** Preview hook: generate preview */
  generatePreview: () => Promise<void>;
  /** Preview hook: check and refresh if stale */
  checkAndRefreshIfStale: () => Promise<void>;
  /** Function to open preview modal */
  openPreviewModal: () => void;
  /** Function to open start fresh confirmation */
  openStartFreshConfirm: () => void;
  /** Function to close start fresh confirmation */
  closeStartFreshConfirm: () => void;
  /** Function to open download celebration modal */
  openDownloadCelebration: () => void;
}

/**
 * Hook for handling top-level editor actions.
 *
 * Extracted from Editor.tsx to improve component organization and testability.
 * Handles:
 * - PDF download with deduplication
 * - Preview modal open/refresh
 * - Start fresh with confirmation
 * - Missing icons dialog
 *
 * @param props - Configuration including state and dependencies
 * @returns Object with action handlers and loading states
 */
export const useEditorActions = ({
  contactInfo,
  setContactInfo,
  sections,
  setSections,
  templateId,
  supportsIcons,
  iconRegistry,
  processSections,
  saveBeforeAction,
  isAnonymous,
  hasShownDownloadToast,
  markDownloadToastShown,
  originalTemplateData,
  isLoadingFromUrl,
  validateIcons,
  previewIsStale,
  clearPreview,
  generatePreview,
  checkAndRefreshIfStale,
  openPreviewModal,
  openStartFreshConfirm,
  closeStartFreshConfirm,
  openDownloadCelebration,
}: UseEditorActionsProps): UseEditorActionsReturn => {
  // Loading states
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpeningPreview, setIsOpeningPreview] = useState(false);
  const [loadingStartFresh, setLoadingStartFresh] = useState(false);

  // Download deduplication ref
  const downloadPromiseRef = useRef<Promise<void> | null>(null);

  /**
   * Shows detailed information about missing icons to help user locate them.
   */
  const showMissingIconsDialog = useCallback(
    (missingIcons: string[], isFromCloudLoad: boolean = false) => {
      if (isFromCloudLoad) {
        // Special message for cloud load failures
        toast.error(
          `⚠️ Unable to load ${missingIcons.length} icon(s) from cloud storage

This can happen if:
• Icons failed to upload when resume was last saved
• Temporary storage connectivity issue

To fix:
1. Re-upload the missing icons using the icon picker
2. Save your resume
3. Icons will then be available on next edit

Missing icons:
${missingIcons.map((icon) => `• ${icon}`).join('\n')}`,
          {
            duration: 15000,
            style: { whiteSpace: 'pre-line', maxWidth: '600px' },
          }
        );
      } else {
        // Original detailed error for regular missing icons
        const iconLocations = missingIcons
          .map((icon) => {
            // Find where this icon is referenced
            const locations: string[] = [];
            sections.forEach((section) => {
              const content = section.content;
              if (!Array.isArray(content)) {
                return;
              }

              // Use type guards for consistent section type checking
              let entryLabel = '';
              if (isExperienceSection(section) || isEducationSection(section)) {
                entryLabel = 'Entry';
              } else if (section.type === 'icon-list') {
                entryLabel = 'Item';
              }

              if (entryLabel) {
                content.forEach((item, index) => {
                  if (typeof item === 'object' && item !== null && 'icon' in item && item.icon === icon) {
                    locations.push(`${section.name} → ${entryLabel} ${index + 1}`);
                  }
                });
              }
            });

            return `• ${icon}${locations.length > 0 ? ' (used in: ' + locations.join(', ') + ')' : ''}`;
          })
          .join('\n');

        toast.error(
          `Missing Icons (${missingIcons.length}):\n${iconLocations}\n\nPlease upload these icons or remove them from your sections.`,
          { duration: 12000, style: { whiteSpace: 'pre-line' } }
        );
      }
    },
    [sections]
  );

  /**
   * Generate and download PDF resume.
   * Includes deduplication to prevent multiple simultaneous downloads.
   */
  const handleGenerateResume = useCallback(async (): Promise<void> => {
    // Deduplicate requests - return existing promise if download in progress
    if (downloadPromiseRef.current) {
      return downloadPromiseRef.current;
    }

    const promise = (async () => {
      try {
        // Save first to ensure PDF has latest changes
        const canProceed = await saveBeforeAction('download PDF');
        if (!canProceed) return;

        // Validate LinkedIn URL only if provided (block invalid, allow empty)
        if (contactInfo?.linkedin && !validateLinkedInUrl(contactInfo.linkedin)) {
          toast.error('Please enter a valid LinkedIn URL or leave it empty');
          return;
        }

        // Validate icon availability for icon-supporting templates
        if (supportsIcons) {
          const { valid, missingIcons } = validateIcons();
          if (!valid) {
            showMissingIconsDialog(missingIcons, isLoadingFromUrl);
            return;
          }
        }

        setIsDownloading(true);
        const processedSections = processSections(sections);

        const yamlData = yaml.dump({
          contact_info: contactInfo,
          sections: processedSections,
        });

        const formData = new FormData();
        const yamlBlob = new Blob([yamlData], { type: 'application/x-yaml' });
        formData.append('yaml_file', yamlBlob, 'resume.yaml');
        formData.append('template', templateId || 'modern-no-icons');

        // Add session ID for session-based icon isolation
        const sessionId = getSessionId();
        formData.append('session_id', sessionId);

        // Only add icons if template supports them (validation already confirmed all icons exist)
        if (supportsIcons) {
          const referencedIcons = extractReferencedIconFilenames(sections);
          for (const iconFilename of referencedIcons) {
            const iconFile = iconRegistry.getIconFile(iconFilename);
            if (iconFile) {
              formData.append('icons', iconFile, iconFilename);
            }
            // No need for else - validation already caught missing icons
          }
        }

        const { pdfBlob, fileName } = await generateResume(formData);

        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName; // Use dynamic filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);

        toast.success('Resume downloaded successfully!');

        // Show celebration modal for anonymous users (first time only)
        if (isAnonymous && !hasShownDownloadToast) {
          markDownloadToastShown();

          setTimeout(() => {
            openDownloadCelebration();
          }, 500);
        }
      } catch (error) {
        console.error('Error generating resume:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Resume generation failed: ${errorMessage}`);
      } finally {
        setIsDownloading(false);
        downloadPromiseRef.current = null;
      }
    })();

    downloadPromiseRef.current = promise;
    return promise;
  }, [
    saveBeforeAction,
    contactInfo,
    supportsIcons,
    validateIcons,
    showMissingIconsDialog,
    isLoadingFromUrl,
    processSections,
    sections,
    templateId,
    iconRegistry,
    isAnonymous,
    hasShownDownloadToast,
    markDownloadToastShown,
    openDownloadCelebration,
  ]);

  /**
   * Open preview modal.
   * Clears stale preview and auto-refreshes if needed.
   */
  const handleOpenPreview = useCallback(async (): Promise<void> => {
    // Show loading state on button immediately
    setIsOpeningPreview(true);

    try {
      // Save first to ensure database has latest changes
      const canProceed = await saveBeforeAction('preview');
      if (!canProceed) {
        setIsOpeningPreview(false);
        return;
      }

      // Validate icons using memoized function from hook
      const { valid, missingIcons } = validateIcons();
      if (!valid) {
        showMissingIconsDialog(missingIcons, isLoadingFromUrl);
        setIsOpeningPreview(false);
        return;
      }

      // Clear stale preview to show loader instead of old content
      if (previewIsStale) {
        clearPreview();
      }

      // Open modal first, then auto-refresh if stale
      openPreviewModal();
      await checkAndRefreshIfStale();
    } finally {
      // Clear button loading state (modal is now open with its own loading)
      setIsOpeningPreview(false);
    }
  }, [
    saveBeforeAction,
    validateIcons,
    showMissingIconsDialog,
    isLoadingFromUrl,
    previewIsStale,
    clearPreview,
    openPreviewModal,
    checkAndRefreshIfStale,
  ]);

  /**
   * Refresh preview in the modal.
   */
  const handleRefreshPreview = useCallback(async (): Promise<void> => {
    // Save first to ensure database has latest changes
    const canProceed = await saveBeforeAction('refresh preview');
    if (!canProceed) return;

    // Validate icons using memoized function from hook
    const { valid, missingIcons } = validateIcons();
    if (!valid) {
      showMissingIconsDialog(missingIcons, isLoadingFromUrl);
      return;
    }

    await generatePreview();
  }, [saveBeforeAction, validateIcons, showMissingIconsDialog, isLoadingFromUrl, generatePreview]);

  /**
   * Open start fresh confirmation dialog.
   */
  const handleStartFresh = useCallback(() => {
    openStartFreshConfirm();
  }, [openStartFreshConfirm]);

  /**
   * Confirm and execute start fresh.
   * Resets contact info and sections to empty template state.
   */
  const confirmStartFresh = useCallback(async (): Promise<void> => {
    if (!originalTemplateData) return;

    // Save current work before clearing (if authenticated and has content)
    if (!isAnonymous && contactInfo && sections.length > 0) {
      const canProceed = await saveBeforeAction('start fresh');
      if (!canProceed) {
        closeStartFreshConfirm();
        return;
      }
    }

    closeStartFreshConfirm();
    setLoadingStartFresh(true);

    try {
      // Reset contact info
      setContactInfo({
        name: '',
        location: '',
        email: '',
        phone: '',
        linkedin: '',
        linkedin_display: '',
        social_links: [],
      });

      // Reset sections by preserving structure but emptying content
      const emptySections = originalTemplateData.sections.map((section) => ({
        ...section,
        content: Array.isArray(section.content) ? [] : '',
      }));

      setSections(emptySections);
      iconRegistry.clearRegistry();

      toast.success('Template cleared successfully!');
    } catch (error) {
      console.error('Error clearing template:', error);
      toast.error('Failed to clear template');
    } finally {
      setLoadingStartFresh(false);
    }
  }, [
    originalTemplateData,
    isAnonymous,
    contactInfo,
    sections,
    saveBeforeAction,
    closeStartFreshConfirm,
    setContactInfo,
    setSections,
    iconRegistry,
  ]);

  // Return stable object with useMemo
  return useMemo(
    () => ({
      // Download
      isDownloading,
      handleGenerateResume,

      // Preview
      isOpeningPreview,
      handleOpenPreview,
      handleRefreshPreview,

      // Start fresh
      loadingStartFresh,
      handleStartFresh,
      confirmStartFresh,
    }),
    [
      isDownloading,
      handleGenerateResume,
      isOpeningPreview,
      handleOpenPreview,
      handleRefreshPreview,
      loadingStartFresh,
      handleStartFresh,
      confirmStartFresh,
    ]
  );
};
