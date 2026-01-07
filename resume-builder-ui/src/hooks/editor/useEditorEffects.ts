// src/hooks/editor/useEditorEffects.ts
// Consolidates side effects for the Editor component

import { useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { ContactInfo } from '../../types';
import { generateThumbnail } from '../../services/templates';

interface UseEditorEffectsProps {
  // Advanced menu
  showAdvancedMenu: boolean;
  closeAdvancedMenu: () => void;

  // Keyboard shortcuts
  handleOpenPreview: () => Promise<void>;

  // Save lifecycle
  isAnonymous: boolean;
  contactInfo: ContactInfo | null;
  templateId: string | null;
  saveStatus: 'saved' | 'saving' | 'error';
  saveNow: () => Promise<string | null>;
  savedResumeId: string | null;
  cloudResumeId: string | null;
  session: Session | null;

  // Auth flow state - skip beforeunload during OAuth redirects
  authInProgress: boolean;
}

/**
 * Hook that consolidates side effects for the Editor component:
 * - Advanced menu click outside handler
 * - Keyboard shortcuts (Ctrl+Shift+P for preview)
 * - beforeunload warning for unsaved changes
 * - Save on component unmount with thumbnail generation
 */
export const useEditorEffects = ({
  showAdvancedMenu,
  closeAdvancedMenu,
  handleOpenPreview,
  isAnonymous,
  contactInfo,
  templateId,
  saveStatus,
  saveNow,
  savedResumeId,
  cloudResumeId,
  session,
  authInProgress,
}: UseEditorEffectsProps): void => {
  // ===== Close advanced menu on click outside =====
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAdvancedMenu) {
        const target = event.target as Element;
        if (!target.closest('.advanced-menu-container')) {
          closeAdvancedMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdvancedMenu, closeAdvancedMenu]);

  // ===== Keyboard shortcuts for preview =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        handleOpenPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenPreview]);

  // ===== Warn user if closing browser/tab with unsaved changes =====
  useEffect(() => {
    // Skip beforeunload during OAuth redirects to prevent "unsaved work" dialog
    if (authInProgress || isAnonymous || !contactInfo || !templateId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || saveStatus === 'error') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [authInProgress, isAnonymous, contactInfo, templateId, saveStatus]);

  // ===== Save on component unmount =====
  const saveOnUnmountRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    saveOnUnmountRef.current = async () => {
      if (!isAnonymous && contactInfo && templateId && saveStatus !== 'saving') {
        try {
          await saveNow();
          console.log('Saved on unmount');

          const resumeId = savedResumeId || cloudResumeId;
          if (resumeId) {
            console.log('Triggering thumbnail generation for resume:', resumeId);
            generateThumbnail(resumeId, session);
          }
        } catch (error) {
          console.error('Failed to save on unmount:', error);
        }
      }
    };
  }, [isAnonymous, contactInfo, templateId, saveStatus, saveNow, savedResumeId, cloudResumeId, session]);

  useEffect(() => {
    return () => {
      if (saveOnUnmountRef.current) {
        saveOnUnmountRef.current();
      }
    };
  }, []);
};
