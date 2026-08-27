// src/components/editor/EditorModals.tsx
// Aggregates all modals/dialogs used in the Editor

import { UseModalManagerReturn } from '../../hooks/editor/useModalManager';
import { UseTourFlowReturn } from '../../types/editor';
import { SectionType } from '../../services/sectionService';
import { ContactInfo, Section } from '../../types';
import AuthModal from '../AuthModal';
import DownloadCelebrationModal from '../DownloadCelebrationModal';
import TabbedHelpModal from '../TabbedHelpModal';
import SectionTypeModal, { InsertPosition } from '../SectionTypeModal';
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
  handleAddSection: (type: SectionType, position?: InsertPosition) => void;
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
  /** Current sections for position selection */
  sections: Section[];
  /** Contact info for job search in download modal */
  contactInfo: ContactInfo | null;
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
 *   sections={sections}
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
  sections,
  contactInfo,
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
        isAnonymous={isAnonymous}
        contactInfo={contactInfo}
        sections={sections}
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
          sections={sections}
        />
      )}

      {/* Delete Section confirmation.
          Entry deletes no longer come through here — they delete immediately
          with an undo toast, because a confirm dialog per certification is
          forty minutes of interruption on a workbench. Sections still ask,
          because the costs are not comparable: an entry loses one row, a
          section takes every role, bullet and date inside it, and a five-second
          toast is not a safety net for that on a surface where being
          interrupted mid-application is the normal case.

          The copy no longer claims the delete "cannot be undone" — it can, for
          a few seconds. Saying otherwise was about to become a lie. */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showDeleteConfirm}
        onClose={modalManager.closeDeleteConfirm}
        onConfirm={actions.confirmDelete}
        title="Delete Section?"
        message={`Deleting ${
          modalManager.deleteTarget?.sectionName
            ? `the "${modalManager.deleteTarget.sectionName}"`
            : 'this'
        } section removes everything inside it. You'll have a few seconds to undo.`}
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
