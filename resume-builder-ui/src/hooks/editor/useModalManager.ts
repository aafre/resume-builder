// src/hooks/editor/useModalManager.ts
// Modal state management hook for Editor component

import { useState, useCallback, useMemo } from 'react';
import { DeleteTarget } from '../../types/editor';

/**
 * Return type for useModalManager hook
 */
export interface UseModalManagerReturn {
  // Modal visibility states
  showStorageLimitModal: boolean;
  showPreviewModal: boolean;
  showModal: boolean; // SectionTypeModal
  showHelpModal: boolean;
  showAdvancedMenu: boolean;
  showWelcomeTour: boolean;
  showIdleTooltip: boolean;
  showDeleteConfirm: boolean;
  showStartFreshConfirm: boolean;
  showImportConfirm: boolean;
  showNavigationDrawer: boolean;
  showAIWarning: boolean;
  showAuthModalFromTour: boolean;
  showAuthModal: boolean;
  showDownloadCelebration: boolean;

  // Related state
  deleteTarget: DeleteTarget | null;
  pendingImportFile: File | null;

  // Storage Limit Modal
  openStorageLimitModal: () => void;
  closeStorageLimitModal: () => void;

  // Preview Modal
  openPreviewModal: () => void;
  closePreviewModal: () => void;

  // Section Type Modal
  openSectionTypeModal: () => void;
  closeSectionTypeModal: () => void;

  // Help Modal
  openHelpModal: () => void;
  closeHelpModal: () => void;

  // Advanced Menu
  openAdvancedMenu: () => void;
  closeAdvancedMenu: () => void;
  toggleAdvancedMenu: () => void;

  // Welcome Tour
  openWelcomeTour: () => void;
  closeWelcomeTour: () => void;

  // Idle Tooltip
  openIdleTooltip: () => void;
  closeIdleTooltip: () => void;

  // Delete Confirmation
  openDeleteConfirm: (target: DeleteTarget) => void;
  closeDeleteConfirm: () => void;

  // Start Fresh Confirmation
  openStartFreshConfirm: () => void;
  closeStartFreshConfirm: () => void;

  // Import Confirmation
  openImportConfirm: (file: File) => void;
  closeImportConfirm: () => void;

  // Navigation Drawer
  openNavigationDrawer: () => void;
  closeNavigationDrawer: () => void;
  toggleNavigationDrawer: () => void;

  // AI Warning
  openAIWarning: () => void;
  closeAIWarning: () => void;

  // Auth Modal (from tour)
  openAuthModalFromTour: () => void;
  closeAuthModalFromTour: () => void;

  // Auth Modal
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Download Celebration
  openDownloadCelebration: () => void;
  closeDownloadCelebration: () => void;
}

/**
 * Hook to manage all modal states and operations in the Editor
 * Provides memoized functions for opening/closing modals and stable return object
 *
 * @returns Object with modal states and control functions
 *
 * @example
 * const {
 *   showPreviewModal,
 *   openPreviewModal,
 *   closePreviewModal
 * } = useModalManager();
 */
export const useModalManager = (): UseModalManagerReturn => {
  // Modal visibility states
  const [showStorageLimitModal, setShowStorageLimitModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // SectionTypeModal
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showIdleTooltip, setShowIdleTooltip] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStartFreshConfirm, setShowStartFreshConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [showAIWarning, setShowAIWarning] = useState(false);
  const [showAuthModalFromTour, setShowAuthModalFromTour] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDownloadCelebration, setShowDownloadCelebration] = useState(false);

  // Related state
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  // Storage Limit Modal functions
  const openStorageLimitModal = useCallback(() => setShowStorageLimitModal(true), []);
  const closeStorageLimitModal = useCallback(() => setShowStorageLimitModal(false), []);

  // Preview Modal functions
  const openPreviewModal = useCallback(() => setShowPreviewModal(true), []);
  const closePreviewModal = useCallback(() => setShowPreviewModal(false), []);

  // Section Type Modal functions
  const openSectionTypeModal = useCallback(() => setShowModal(true), []);
  const closeSectionTypeModal = useCallback(() => setShowModal(false), []);

  // Help Modal functions
  const openHelpModal = useCallback(() => setShowHelpModal(true), []);
  const closeHelpModal = useCallback(() => setShowHelpModal(false), []);

  // Advanced Menu functions
  const openAdvancedMenu = useCallback(() => setShowAdvancedMenu(true), []);
  const closeAdvancedMenu = useCallback(() => setShowAdvancedMenu(false), []);
  const toggleAdvancedMenu = useCallback(() => setShowAdvancedMenu(prev => !prev), []);

  // Welcome Tour functions
  const openWelcomeTour = useCallback(() => setShowWelcomeTour(true), []);
  const closeWelcomeTour = useCallback(() => setShowWelcomeTour(false), []);

  // Idle Tooltip functions
  const openIdleTooltip = useCallback(() => setShowIdleTooltip(true), []);
  const closeIdleTooltip = useCallback(() => setShowIdleTooltip(false), []);

  // Delete Confirmation functions
  const openDeleteConfirm = useCallback((target: DeleteTarget) => {
    setDeleteTarget(target);
    setShowDeleteConfirm(true);
  }, []);
  const closeDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  }, []);

  // Start Fresh Confirmation functions
  const openStartFreshConfirm = useCallback(() => setShowStartFreshConfirm(true), []);
  const closeStartFreshConfirm = useCallback(() => setShowStartFreshConfirm(false), []);

  // Import Confirmation functions
  const openImportConfirm = useCallback((file: File) => {
    setPendingImportFile(file);
    setShowImportConfirm(true);
  }, []);
  const closeImportConfirm = useCallback(() => {
    setShowImportConfirm(false);
    setPendingImportFile(null);
  }, []);

  // Navigation Drawer functions
  const openNavigationDrawer = useCallback(() => setShowNavigationDrawer(true), []);
  const closeNavigationDrawer = useCallback(() => setShowNavigationDrawer(false), []);
  const toggleNavigationDrawer = useCallback(() => setShowNavigationDrawer(prev => !prev), []);

  // AI Warning functions
  const openAIWarning = useCallback(() => setShowAIWarning(true), []);
  const closeAIWarning = useCallback(() => setShowAIWarning(false), []);

  // Auth Modal (from tour) functions
  const openAuthModalFromTour = useCallback(() => setShowAuthModalFromTour(true), []);
  const closeAuthModalFromTour = useCallback(() => setShowAuthModalFromTour(false), []);

  // Auth Modal functions
  const openAuthModal = useCallback(() => setShowAuthModal(true), []);
  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  // Download Celebration functions
  const openDownloadCelebration = useCallback(() => setShowDownloadCelebration(true), []);
  const closeDownloadCelebration = useCallback(() => setShowDownloadCelebration(false), []);

  // Return stable object with useMemo
  return useMemo(
    () => ({
      // States
      showStorageLimitModal,
      showPreviewModal,
      showModal,
      showHelpModal,
      showAdvancedMenu,
      showWelcomeTour,
      showIdleTooltip,
      showDeleteConfirm,
      showStartFreshConfirm,
      showImportConfirm,
      showNavigationDrawer,
      showAIWarning,
      showAuthModalFromTour,
      showAuthModal,
      showDownloadCelebration,
      deleteTarget,
      pendingImportFile,

      // Functions
      openStorageLimitModal,
      closeStorageLimitModal,
      openPreviewModal,
      closePreviewModal,
      openSectionTypeModal,
      closeSectionTypeModal,
      openHelpModal,
      closeHelpModal,
      openAdvancedMenu,
      closeAdvancedMenu,
      toggleAdvancedMenu,
      openWelcomeTour,
      closeWelcomeTour,
      openIdleTooltip,
      closeIdleTooltip,
      openDeleteConfirm,
      closeDeleteConfirm,
      openStartFreshConfirm,
      closeStartFreshConfirm,
      openImportConfirm,
      closeImportConfirm,
      openNavigationDrawer,
      closeNavigationDrawer,
      toggleNavigationDrawer,
      openAIWarning,
      closeAIWarning,
      openAuthModalFromTour,
      closeAuthModalFromTour,
      openAuthModal,
      closeAuthModal,
      openDownloadCelebration,
      closeDownloadCelebration,
    }),
    [
      // States
      showStorageLimitModal,
      showPreviewModal,
      showModal,
      showHelpModal,
      showAdvancedMenu,
      showWelcomeTour,
      showIdleTooltip,
      showDeleteConfirm,
      showStartFreshConfirm,
      showImportConfirm,
      showNavigationDrawer,
      showAIWarning,
      showAuthModalFromTour,
      showAuthModal,
      showDownloadCelebration,
      deleteTarget,
      pendingImportFile,

      // Functions (already memoized with useCallback, so stable)
      openStorageLimitModal,
      closeStorageLimitModal,
      openPreviewModal,
      closePreviewModal,
      openSectionTypeModal,
      closeSectionTypeModal,
      openHelpModal,
      closeHelpModal,
      openAdvancedMenu,
      closeAdvancedMenu,
      toggleAdvancedMenu,
      openWelcomeTour,
      closeWelcomeTour,
      openIdleTooltip,
      closeIdleTooltip,
      openDeleteConfirm,
      closeDeleteConfirm,
      openStartFreshConfirm,
      closeStartFreshConfirm,
      openImportConfirm,
      closeImportConfirm,
      openNavigationDrawer,
      closeNavigationDrawer,
      toggleNavigationDrawer,
      openAIWarning,
      closeAIWarning,
      openAuthModalFromTour,
      closeAuthModalFromTour,
      openAuthModal,
      closeAuthModal,
      openDownloadCelebration,
      closeDownloadCelebration,
    ]
  );
};
