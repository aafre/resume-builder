// src/components/editor/EditorModals.tsx
// Aggregates all modals/dialogs used in the Editor

import { UseModalManagerReturn } from '../../hooks/editor/useModalManager';
import { UseTourFlowReturn } from '../../types/editor';
import AuthModal from '../AuthModal';
import DownloadCelebrationModal from '../DownloadCelebrationModal';
import TabbedHelpModal from '../TabbedHelpModal';
import SectionTypeModal from '../SectionTypeModal';
import ResponsiveConfirmDialog from '../ResponsiveConfirmDialog';
import PreviewModal from '../PreviewModal';
import { StorageLimitModal } from '../StorageLimitModal';
import ContextAwareTour from '../ContextAwareTour';

/**
 * Preview-related props for EditorModals
 */
export interface EditorModalsPreviewProps {
  previewUrl: string | null;
  isGenerating: boolean;
  isStale: boolean;
  error: string | null;
}

/**
 * Action callbacks for EditorModals
 */
export interface EditorModalsActions {
  // Section actions
  handleAddSection: (type: string) => void;
  confirmDelete: () => void;

  // File actions
  confirmImportYAML: () => Promise<void>;

  // Editor actions
  confirmStartFresh: () => Promise<void>;
  handleRefreshPreview: () => Promise<void>;
  handleGenerateResume: () => Promise<void>;
}

/**
 * Loading states for EditorModals
 */
export interface EditorModalsLoadingStates {
  loadingStartFresh: boolean;
  loadingLoad: boolean;
  isDownloading: boolean;
}

/**
 * Props for EditorModals component
 */
export interface EditorModalsProps {
  /** Modal manager hook return */
  modalManager: UseModalManagerReturn;
  /** Tour flow hook return */
  tourFlow: UseTourFlowReturn;
  /** Preview state */
  preview: EditorModalsPreviewProps;
  /** Action callbacks */
  actions: EditorModalsActions;
  /** Loading states */
  loading: EditorModalsLoadingStates;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether template supports icons */
  supportsIcons: boolean;
  /** Callback when auth completes successfully (from actions auth modal) */
  onAuthSuccess?: () => void;
}

/**
 * EditorModals Component
 *
 * Aggregates all modal and dialog components used in the Editor.
 * Includes:
 * - Context-aware tour
 * - Auth modals (from tour and actions)
 * - Download celebration modal
 * - Help modal (tabbed)
 * - Section type modal
 * - Delete confirmation dialog
 * - Start fresh confirmation dialog
 * - Import confirmation dialog
 * - Preview modal
 * - Storage limit modal
 *
 * @example
 * <EditorModals
 *   modalManager={modalManager}
 *   tourFlow={tourFlow}
 *   preview={{ previewUrl, isGenerating, isStale, error }}
 *   actions={{
 *     handleAddSection,
 *     confirmDelete,
 *     confirmImportYAML,
 *     confirmStartFresh,
 *     handleRefreshPreview,
 *     handleGenerateResume,
 *   }}
 *   loading={{ loadingStartFresh, loadingLoad, isDownloading }}
 *   isAnonymous={isAnonymous}
 *   isAuthenticated={isAuthenticated}
 *   supportsIcons={supportsIcons}
 * />
 */
export const EditorModals: React.FC<EditorModalsProps> = ({
  modalManager,
  tourFlow,
  preview,
  actions,
  loading,
  isAnonymous,
  isAuthenticated,
  supportsIcons,
  onAuthSuccess,
}) => {
  return (
    <>
      {/* Context-Aware Tour */}
      <ContextAwareTour
        isOpen={tourFlow.showWelcomeTour}
        onClose={tourFlow.handleTourComplete}
        isAnonymous={isAnonymous}
        isAuthenticated={isAuthenticated}
        onSignInClick={() => {
          tourFlow.handleSignInFromTour();
          modalManager.openAuthModalFromTour();
        }}
        onTourComplete={tourFlow.handleTourComplete}
      />

      {/* Auth Modal triggered from tour */}
      <AuthModal
        isOpen={modalManager.showAuthModalFromTour}
        onClose={modalManager.closeAuthModalFromTour}
        onSuccess={() => {
          modalManager.closeAuthModalFromTour();
          tourFlow.handleSignInSuccess();
        }}
      />

      {/* Auth Modal triggered from actions */}
      <AuthModal
        isOpen={modalManager.showAuthModal}
        onClose={modalManager.closeAuthModal}
        onSuccess={() => {
          modalManager.closeAuthModal();
          onAuthSuccess?.();
        }}
      />

      {/* Download Celebration Modal */}
      <DownloadCelebrationModal
        isOpen={modalManager.showDownloadCelebration}
        onClose={modalManager.closeDownloadCelebration}
        onSignUp={() => {
          modalManager.closeDownloadCelebration();
          modalManager.openAuthModal();
        }}
      />

      {/* Tabbed Help Modal */}
      <TabbedHelpModal
        isOpen={modalManager.showHelpModal}
        onClose={modalManager.closeHelpModal}
        isAnonymous={isAnonymous}
        onSignInClick={() => {
          modalManager.closeHelpModal();
          modalManager.openAuthModal();
        }}
      />

      {/* Section Type Modal */}
      {modalManager.showSectionTypeModal && (
        <SectionTypeModal
          onClose={modalManager.closeSectionTypeModal}
          onSelect={actions.handleAddSection}
          supportsIcons={supportsIcons}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showDeleteConfirm}
        onClose={modalManager.closeDeleteConfirm}
        onConfirm={actions.confirmDelete}
        title={
          modalManager.deleteTarget?.type === 'section'
            ? 'Delete Section?'
            : 'Delete Entry?'
        }
        message={
          modalManager.deleteTarget?.type === 'section'
            ? `Are you sure you want to delete ${modalManager.deleteTarget.sectionName ? `the "${modalManager.deleteTarget.sectionName}"` : 'this'} section? This will remove all content in this section and cannot be undone.`
            : 'Are you sure you want to delete this entry? This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Start Fresh Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showStartFreshConfirm}
        onClose={modalManager.closeStartFreshConfirm}
        onConfirm={actions.confirmStartFresh}
        title="Start Fresh?"
        message="Starting fresh will permanently delete all your current work. This action cannot be undone. Are you sure you want to continue?"
        confirmText="Start Fresh"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={loading.loadingStartFresh}
      />

      {/* Import YAML Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showImportConfirm}
        onClose={modalManager.closeImportConfirm}
        onConfirm={actions.confirmImportYAML}
        title="Confirm Import?"
        message="Importing this will override your existing content."
        confirmText="Confirm Import"
        cancelText="Cancel Import"
        isDestructive={true}
        isLoading={loading.loadingLoad}
      />

      {/* PDF Preview Modal */}
      <PreviewModal
        isOpen={modalManager.showPreviewModal}
        onClose={modalManager.closePreviewModal}
        previewUrl={preview.previewUrl}
        isGenerating={preview.isGenerating}
        isDownloading={loading.isDownloading}
        isStale={preview.isStale}
        error={preview.error}
        onRefresh={actions.handleRefreshPreview}
        onDownload={actions.handleGenerateResume}
      />

      {/* Storage Limit Modal */}
      <StorageLimitModal
        isOpen={modalManager.showStorageLimitModal}
        onClose={modalManager.closeStorageLimitModal}
      />
    </>
  );
};
