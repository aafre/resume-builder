// src/hooks/editor/useSaveIntegration.ts
// Consolidates cloud save integration for the Editor component

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { toastWarning } from '../../utils/toasts';
import { ContactInfo, Section, SaveStatus } from '../../types';
import { useCloudSave } from '../useCloudSave';

interface IconRegistry {
  getRegisteredFilenames: () => string[];
  getIconFile: (filename: string) => File | null;
}

interface UseSaveIntegrationProps {
  contactInfo: ContactInfo | null;
  sections: Section[];
  templateId: string | null;
  iconRegistry: IconRegistry;
  cloudResumeId: string | null;
  setCloudResumeId: (id: string | null) => void;
  isLoadingFromUrl: boolean;
  authLoading: boolean;
  session: Session | null;
  isAnonymous: boolean;
  openStorageLimitModal: () => void;
}

interface UseSaveIntegrationReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  saveNow: () => Promise<string | null>;
  savedResumeId: string | null;
  saveBeforeAction: (actionName: string, options?: { blocking?: boolean }) => Promise<boolean>;
}

/**
 * Hook that consolidates cloud save integration:
 * - Converts icon registry to plain object for cloud save
 * - Manages useCloudSave hook
 * - Syncs saved resume ID back to resume loader
 * - Provides saveBeforeAction utility for critical actions
 */
export const useSaveIntegration = ({
  contactInfo,
  sections,
  templateId,
  iconRegistry,
  cloudResumeId,
  setCloudResumeId,
  isLoadingFromUrl,
  authLoading,
  session,
  isAnonymous,
  openStorageLimitModal,
}: UseSaveIntegrationProps): UseSaveIntegrationReturn => {
  // Convert iconRegistry to plain object for cloud save
  // Dependency uses joined filenames string to detect when icons are added/removed
  const iconsForCloudSave = useMemo(() => {
    const filenames = iconRegistry.getRegisteredFilenames();
    const iconsObj: { [filename: string]: File } = {};
    filenames.forEach((filename) => {
      const file = iconRegistry.getIconFile(filename);
      if (file) {
        iconsObj[filename] = file;
      }
    });
    return iconsObj;
  }, [iconRegistry.getRegisteredFilenames().join(',')]);

  const {
    saveStatus,
    lastSaved,
    saveNow,
    resumeId: savedResumeId,
  } = useCloudSave({
    resumeId: cloudResumeId,
    resumeData:
      contactInfo && templateId
        ? {
            contact_info: contactInfo,
            sections: sections,
            template_id: templateId,
          }
        : { contact_info: { name: '', location: '', email: '', phone: '' }, sections: [], template_id: '' },
    icons: iconsForCloudSave,
    enabled: !!templateId && !!contactInfo && !isLoadingFromUrl && !authLoading,
    session: session,
  });

  // Ref to track latest saveStatus for use in async callbacks (avoids stale closures)
  const saveStatusRef = useRef(saveStatus);
  useEffect(() => {
    saveStatusRef.current = saveStatus;
  }, [saveStatus]);

  // Update cloud resume ID when it's set from cloud save
  useEffect(() => {
    if (savedResumeId && savedResumeId !== cloudResumeId) {
      setCloudResumeId(savedResumeId);
    }
  }, [savedResumeId, cloudResumeId, setCloudResumeId]);

  /**
   * Saves pending changes before an action. Returns whether the action may run.
   *
   * `blocking: false` is for actions that only read what's on the page
   * (download, preview, export): a failed cloud save must never hold them
   * hostage, so the user is told the sync failed and the action still runs.
   * `blocking: true` (default) is for actions that replace the page (start
   * fresh, import): if the cloud copy is stale, stopping is what keeps the
   * edits safe.
   *
   * `actionName` is a gerund phrase for the copy: "starting fresh".
   */
  const saveBeforeAction = useCallback(
    async (actionName: string, { blocking = true }: { blocking?: boolean } = {}): Promise<boolean> => {
      // Skip save for anonymous users or if no data exists
      if (isAnonymous || !contactInfo || !templateId) {
        return true;
      }

      const onFailure = (limitReached = false): boolean => {
        if (limitReached) {
          openStorageLimitModal();
        } else if (blocking) {
          toast.error(
            `Couldn't save your changes, so we stopped before ${actionName} to keep them safe. Check your connection and try again.`
          );
        } else {
          toastWarning("Couldn't sync to your account. Your edits are still here; check your connection.");
        }
        return !blocking;
      };

      // If already saving, wait for completion (use ref to avoid stale closure)
      if (saveStatusRef.current === 'saving') {
        console.log(`Waiting for in-progress save before ${actionName}...`);
        const timeout = 10000;
        const start = Date.now();
        while (saveStatusRef.current === 'saving' && Date.now() - start < timeout) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // After the loop, status could be 'saved' or 'error' (or still 'saving' if timed out)
        // Cast needed because TypeScript narrows based on the if-check above, but ref.current
        // can change asynchronously during the while loop
        const currentStatus = saveStatusRef.current as SaveStatus;
        return currentStatus === 'error' ? onFailure() : true;
      }

      // Always trigger save before action
      try {
        console.log(`Saving before ${actionName}...`);
        const result = await saveNow();

        if (result === null && saveStatusRef.current === 'error') {
          return onFailure();
        }

        return true;
      } catch (error) {
        console.error(`Save failed before ${actionName}:`, error);
        return onFailure(error instanceof Error && error.message === 'RESUME_LIMIT_REACHED');
      }
    },
    [isAnonymous, contactInfo, templateId, saveNow, openStorageLimitModal]
  );

  return {
    saveStatus,
    lastSaved,
    saveNow,
    savedResumeId,
    saveBeforeAction,
  };
};
