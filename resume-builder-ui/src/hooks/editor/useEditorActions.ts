// src/hooks/editor/useEditorActions.ts
// Hook for handling top-level editor actions (download, preview, start fresh)

import { useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { toastDownloaded, toastFailure } from '../../utils/toasts';
import yaml from 'js-yaml';
import { Section, ContactInfo } from '../../types';
import { MissingIconsNotice, UseEditorActionsReturn } from '../../types/editor';
import { generateResume } from '../../services/templates';
import { getSessionId } from '../../utils/session';
import { extractReferencedIconFilenames } from '../../utils/iconExtractor';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import { validateLinkedInUrl } from '../../services/validationService';
import { trackPdfDownloaded, trackPdfDownloadFailed, categorizeError } from '../../lib/analytics';

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
  saveBeforeAction: (actionName: string, options?: { blocking?: boolean }) => Promise<boolean>;
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
  // What the build is actually doing right now. Set only at real boundaries in
  // handleGenerateResume — never on a timer — so the label is always true.
  const [downloadPhase, setDownloadPhase] = useState<string | null>(null);
  const [isOpeningPreview, setIsOpeningPreview] = useState(false);
  const [loadingStartFresh, setLoadingStartFresh] = useState(false);
  const [missingIconsNotice, setMissingIconsNotice] = useState<MissingIconsNotice | null>(null);

  // Download deduplication ref
  const downloadPromiseRef = useRef<Promise<void> | null>(null);

  /**
   * Missing icons block the PDF, and fixing them means visiting entries, so the
   * detail lives in a persistent inline notice (EditorContent), not a toast
   * that vanishes mid-fix. The toast only says what happened and where to look.
   */
  const showMissingIconsDialog = useCallback(
    (missingIcons: string[], isFromCloudLoad: boolean = false) => {
      const icons = missingIcons.map((file) => {
        const usedIn: string[] = [];
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
              if (typeof item === 'object' && item !== null && 'icon' in item && item.icon === file) {
                usedIn.push(`${section.name} → ${entryLabel} ${index + 1}`);
              }
            });
          }
        });
        return { file, usedIn };
      });

      setMissingIconsNotice({ fromCloud: isFromCloudLoad, icons });
      const n = icons.length;
      toast.error(
        `${n} icon${n === 1 ? ' is' : 's are'} missing, so the PDF wasn't made. The list is at the top of the editor.`,
        { id: 'missing-icons' }
      );
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
        // Save first to ensure PDF has latest changes. The button goes into its
        // working state here, not after validation — the save is a real wait and
        // used to happen behind an idle-looking button.
        setIsDownloading(true);
        setDownloadPhase('Saving your latest edits');
        const canProceed = await saveBeforeAction('downloading your PDF', { blocking: false });
        if (!canProceed) return;

        // Validate LinkedIn URL only if provided (block invalid, allow empty)
        if (contactInfo?.linkedin && !validateLinkedInUrl(contactInfo.linkedin)) {
          toast.error("That LinkedIn URL doesn't look right. Use linkedin.com/in/your-name, or leave it empty.");
          return;
        }

        // Validate icon availability for icon-supporting templates
        if (supportsIcons) {
          const { valid, missingIcons } = validateIcons();
          if (!valid) {
            showMissingIconsDialog(missingIcons, isLoadingFromUrl);
            return;
          }
          setMissingIconsNotice(null);
        }

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

        // Server-side render: Jinja lays the sections into the template, then
        // pdfkit prints them. We can't observe the split, so it's one honest
        // phase named after what the user handed over, not a fake percentage.
        setDownloadPhase(
          `Typesetting ${processedSections.length} ${
            processedSections.length === 1 ? 'section' : 'sections'
          }`
        );
        const { pdfBlob, fileName } = await generateResume(formData);

        setDownloadPhase('Your PDF is ready');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName; // Use dynamic filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);

        trackPdfDownloaded({ template_id: templateId || 'unknown', source: 'editor' });

        // First download: the celebration modal is the peak, so no toast under
        // it. Every later download gets the downloaded toast.
        if (hasShownDownloadToast) {
          toastDownloaded(fileName);
        } else {
          markDownloadToastShown();

          setTimeout(() => {
            openDownloadCelebration();
          }, 500);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toastFailure('make your PDF', error);
        trackPdfDownloadFailed({
          template_id: templateId || 'unknown',
          source: 'editor',
          error_type: categorizeError(errorMessage),
        });
      } finally {
        setIsDownloading(false);
        setDownloadPhase(null);
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
      const canProceed = await saveBeforeAction('previewing', { blocking: false });
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
      setMissingIconsNotice(null);

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
    const canProceed = await saveBeforeAction('refreshing the preview', { blocking: false });
    if (!canProceed) return;

    // Validate icons using memoized function from hook
    const { valid, missingIcons } = validateIcons();
    if (!valid) {
      showMissingIconsDialog(missingIcons, isLoadingFromUrl);
      return;
    }
    setMissingIconsNotice(null);

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
      const canProceed = await saveBeforeAction('starting fresh');
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

    } catch (error) {
      toastFailure('clear your resume', error);
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

  const dismissMissingIconsNotice = useCallback(() => setMissingIconsNotice(null), []);

  // Return stable object with useMemo
  return useMemo(
    () => ({
      // Download
      isDownloading,
      downloadPhase,
      handleGenerateResume,

      // Preview
      isOpeningPreview,
      handleOpenPreview,
      handleRefreshPreview,

      // Start fresh
      loadingStartFresh,
      handleStartFresh,
      confirmStartFresh,

      // Missing icons
      missingIconsNotice,
      dismissMissingIconsNotice,
    }),
    [
      isDownloading,
      downloadPhase,
      handleGenerateResume,
      isOpeningPreview,
      handleOpenPreview,
      handleRefreshPreview,
      loadingStartFresh,
      handleStartFresh,
      confirmStartFresh,
      missingIconsNotice,
      dismissMissingIconsNotice,
    ]
  );
};
