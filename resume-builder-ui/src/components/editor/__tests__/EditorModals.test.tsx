// src/components/editor/__tests__/EditorModals.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorModals, EditorModalsProps } from '../EditorModals';
import { UseModalManagerReturn } from '../../../hooks/editor/useModalManager';
import { UseTourFlowReturn } from '../../../types/editor';

// Mock all the modal components
vi.mock('../../AuthModal', () => ({
  default: ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void }) =>
    isOpen ? (
      <div data-testid="auth-modal">
        <button onClick={onClose}>Close Auth</button>
        {onSuccess && <button onClick={onSuccess}>Auth Success</button>}
      </div>
    ) : null,
}));

vi.mock('../../DownloadCelebrationModal', () => ({
  default: ({ isOpen, onClose, onSignUp }: { isOpen: boolean; onClose: () => void; onSignUp: () => void }) =>
    isOpen ? (
      <div data-testid="download-celebration-modal">
        <button onClick={onClose}>Close Celebration</button>
        <button onClick={onSignUp}>Sign Up</button>
      </div>
    ) : null,
}));

vi.mock('../../TabbedHelpModal', () => ({
  default: ({ isOpen, onClose, onSignInClick }: { isOpen: boolean; onClose: () => void; onSignInClick: () => void }) =>
    isOpen ? (
      <div data-testid="help-modal">
        <button onClick={onClose}>Close Help</button>
        <button onClick={onSignInClick}>Sign In</button>
      </div>
    ) : null,
}));

vi.mock('../../SectionTypeModal', () => ({
  default: ({ onClose, onSelect }: { onClose: () => void; onSelect: (type: string) => void }) => (
    <div data-testid="section-type-modal">
      <button onClick={onClose}>Close Section Type</button>
      <button onClick={() => onSelect('text')}>Select Text</button>
    </div>
  ),
}));

vi.mock('../../ResponsiveConfirmDialog', () => ({
  default: ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
  }) =>
    isOpen ? (
      <div data-testid={`confirm-dialog-${title.toLowerCase().replace(/[^a-z]/g, '-')}`}>
        <span>{title}</span>
        <p data-testid="confirm-dialog-message">{message}</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

vi.mock('../../PreviewModal', () => ({
  default: ({
    isOpen,
    onClose,
    onRefresh,
    onDownload,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    onDownload: () => void;
  }) =>
    isOpen ? (
      <div data-testid="preview-modal">
        <button onClick={onClose}>Close Preview</button>
        <button onClick={onRefresh}>Refresh</button>
        <button onClick={onDownload}>Download</button>
      </div>
    ) : null,
}));

vi.mock('../../StorageLimitModal', () => ({
  StorageLimitModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="storage-limit-modal">
        <button onClick={onClose}>Close Storage Limit</button>
      </div>
    ) : null,
}));

vi.mock('../../ContextAwareTour', () => ({
  default: ({
    isOpen,
    onClose,
    onSignInClick,
    onTourComplete,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSignInClick: () => void;
    onTourComplete: () => void;
  }) =>
    isOpen ? (
      <div data-testid="context-aware-tour">
        <button onClick={onClose}>Close Tour</button>
        <button onClick={onSignInClick}>Tour Sign In</button>
        <button onClick={onTourComplete}>Complete Tour</button>
      </div>
    ) : null,
}));

describe('EditorModals', () => {
  // Create mock modal manager
  const createMockModalManager = (
    overrides: Partial<UseModalManagerReturn> = {}
  ): UseModalManagerReturn => ({
    showStorageLimitModal: false,
    showPreviewModal: false,
    showSectionTypeModal: false,
    showHelpModal: false,
    showAdvancedMenu: false,
    showWelcomeTour: false,
    showIdleTooltip: false,
    showDeleteConfirm: false,
    showStartFreshConfirm: false,
    showImportConfirm: false,
    showNavigationDrawer: false,
    showAIWarning: false,
    showAuthModalFromTour: false,
    showAuthModal: false,
    showDownloadCelebration: false,
    deleteTarget: null,
    pendingImportFile: null,
    openStorageLimitModal: vi.fn(),
    closeStorageLimitModal: vi.fn(),
    openPreviewModal: vi.fn(),
    closePreviewModal: vi.fn(),
    openSectionTypeModal: vi.fn(),
    closeSectionTypeModal: vi.fn(),
    openHelpModal: vi.fn(),
    closeHelpModal: vi.fn(),
    openAdvancedMenu: vi.fn(),
    closeAdvancedMenu: vi.fn(),
    toggleAdvancedMenu: vi.fn(),
    openWelcomeTour: vi.fn(),
    closeWelcomeTour: vi.fn(),
    openIdleTooltip: vi.fn(),
    closeIdleTooltip: vi.fn(),
    openDeleteConfirm: vi.fn(),
    closeDeleteConfirm: vi.fn(),
    openStartFreshConfirm: vi.fn(),
    closeStartFreshConfirm: vi.fn(),
    openImportConfirm: vi.fn(),
    closeImportConfirm: vi.fn(),
    closeImportConfirmModal: vi.fn(),
    clearPendingImportFile: vi.fn(),
    openNavigationDrawer: vi.fn(),
    closeNavigationDrawer: vi.fn(),
    toggleNavigationDrawer: vi.fn(),
    openAIWarning: vi.fn(),
    closeAIWarning: vi.fn(),
    openAuthModalFromTour: vi.fn(),
    closeAuthModalFromTour: vi.fn(),
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    openDownloadCelebration: vi.fn(),
    closeDownloadCelebration: vi.fn(),
    ...overrides,
  });

  // Create mock tour flow
  const createMockTourFlow = (
    overrides: Partial<UseTourFlowReturn> = {}
  ): UseTourFlowReturn => ({
    showWelcomeTour: false,
    setShowWelcomeTour: vi.fn(),
    handleTourComplete: vi.fn(),
    showIdleTooltip: false,
    dismissIdleTooltip: vi.fn(),
    isSigningInFromTour: false,
    handleSignInFromTour: vi.fn(),
    handleSignInSuccess: vi.fn(),
    ...overrides,
  });

  // Default props
  const createDefaultProps = (
    overrides: Partial<EditorModalsProps> = {}
  ): EditorModalsProps => ({
    modalManager: createMockModalManager(),
    tourFlow: createMockTourFlow(),
    preview: {
      previewUrl: null,
      isGenerating: false,
      isStale: false,
      error: null,
    },
    actions: {
      handleAddSection: vi.fn(),
      confirmDelete: vi.fn(),
      confirmImportYAML: vi.fn(),
      confirmStartFresh: vi.fn(),
      handleRefreshPreview: vi.fn(),
      handleGenerateResume: vi.fn(),
    },
    loading: {
      loadingStartFresh: false,
      loadingLoad: false,
      isDownloading: false,
    },
    isAnonymous: false,
    isAuthenticated: true,
    supportsIcons: true,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Context Aware Tour', () => {
    it('should render tour when showWelcomeTour is true', () => {
      const props = createDefaultProps({
        tourFlow: createMockTourFlow({ showWelcomeTour: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('context-aware-tour')).toBeInTheDocument();
    });

    it('should not render tour when showWelcomeTour is false', () => {
      const props = createDefaultProps({
        tourFlow: createMockTourFlow({ showWelcomeTour: false }),
      });
      render(<EditorModals {...props} />);

      expect(screen.queryByTestId('context-aware-tour')).not.toBeInTheDocument();
    });

    it('should call handleSignInFromTour and openAuthModalFromTour when sign-in clicked in tour', () => {
      const handleSignInFromTour = vi.fn();
      const openAuthModalFromTour = vi.fn();
      const props = createDefaultProps({
        tourFlow: createMockTourFlow({ showWelcomeTour: true, handleSignInFromTour }),
        modalManager: createMockModalManager({ openAuthModalFromTour }),
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Tour Sign In'));

      expect(handleSignInFromTour).toHaveBeenCalledTimes(1);
      expect(openAuthModalFromTour).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auth Modal (from tour)', () => {
    it('should render auth modal from tour when showAuthModalFromTour is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showAuthModalFromTour: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    });

    it('should call handleSignInSuccess when auth from tour succeeds', () => {
      const handleSignInSuccess = vi.fn();
      const closeAuthModalFromTour = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showAuthModalFromTour: true, closeAuthModalFromTour }),
        tourFlow: createMockTourFlow({ handleSignInSuccess }),
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Auth Success'));

      expect(closeAuthModalFromTour).toHaveBeenCalledTimes(1);
      expect(handleSignInSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auth Modal (from actions)', () => {
    it('should render auth modal when showAuthModal is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showAuthModal: true }),
      });
      render(<EditorModals {...props} />);

      // Should have auth modal rendered (may have multiple if both tour and action modals are open)
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    });

    it('should call onAuthSuccess when auth succeeds', () => {
      const onAuthSuccess = vi.fn();
      const closeAuthModal = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showAuthModal: true, closeAuthModal }),
        onAuthSuccess,
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Auth Success'));

      expect(closeAuthModal).toHaveBeenCalledTimes(1);
      expect(onAuthSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('Download Celebration Modal', () => {
    it('should render when showDownloadCelebration is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showDownloadCelebration: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('download-celebration-modal')).toBeInTheDocument();
    });

    it('should open auth modal when sign up clicked', () => {
      const closeDownloadCelebration = vi.fn();
      const openAuthModal = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDownloadCelebration: true,
          closeDownloadCelebration,
          openAuthModal,
        }),
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Sign Up'));

      expect(closeDownloadCelebration).toHaveBeenCalledTimes(1);
      expect(openAuthModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('Help Modal', () => {
    it('should render when showHelpModal is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showHelpModal: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('help-modal')).toBeInTheDocument();
    });

    it('should open auth modal when sign in clicked in help', () => {
      const closeHelpModal = vi.fn();
      const openAuthModal = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showHelpModal: true,
          closeHelpModal,
          openAuthModal,
        }),
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Sign In'));

      expect(closeHelpModal).toHaveBeenCalledTimes(1);
      expect(openAuthModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('Section Type Modal', () => {
    it('should render when showSectionTypeModal is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showSectionTypeModal: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('section-type-modal')).toBeInTheDocument();
    });

    it('should call handleAddSection when section type selected', () => {
      const handleAddSection = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showSectionTypeModal: true }),
        actions: {
          ...createDefaultProps().actions,
          handleAddSection,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Select Text'));

      expect(handleAddSection).toHaveBeenCalledWith('text');
    });
  });

  describe('Delete Confirmation Dialog', () => {
    it('should render when showDeleteConfirm is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'entry', sectionIndex: 0 },
        }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-delete-entry-')).toBeInTheDocument();
    });

    it('should show section title when deleting section', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'section', sectionIndex: 0, sectionName: 'Experience' },
        }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-delete-section-')).toBeInTheDocument();
    });

    it('should show section name in message when deleting a named section', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'section', sectionIndex: 0, sectionName: 'Experience' },
        }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-message')).toHaveTextContent(
        'Are you sure you want to delete the "Experience" section?'
      );
    });

    it('should show fallback text in message when deleting a section with no name', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'section', sectionIndex: 0, sectionName: undefined },
        }),
      });
      render(<EditorModals {...props} />);

      // When sectionName is undefined, the message uses "this" as a pronoun, not as a quoted name
      expect(screen.getByTestId('confirm-dialog-message')).toHaveTextContent(
        'Are you sure you want to delete this section? This will remove all content in this section and cannot be undone.'
      );
    });

    it('should show entry deletion message when deleting an entry', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'entry', sectionIndex: 0, entryIndex: 1 },
        }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-message')).toHaveTextContent(
        'Are you sure you want to delete this entry? This action cannot be undone.'
      );
    });

    it('should call confirmDelete when confirmed', () => {
      const confirmDelete = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showDeleteConfirm: true,
          deleteTarget: { type: 'entry', sectionIndex: 0 },
        }),
        actions: {
          ...createDefaultProps().actions,
          confirmDelete,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Confirm'));

      expect(confirmDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Start Fresh Confirmation Dialog', () => {
    it('should render when showStartFreshConfirm is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showStartFreshConfirm: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-start-fresh-')).toBeInTheDocument();
    });

    it('should call confirmStartFresh when confirmed', () => {
      const confirmStartFresh = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showStartFreshConfirm: true }),
        actions: {
          ...createDefaultProps().actions,
          confirmStartFresh,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Confirm'));

      expect(confirmStartFresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('Import Confirmation Dialog', () => {
    it('should render when showImportConfirm is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showImportConfirm: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('confirm-dialog-confirm-import-')).toBeInTheDocument();
    });

    it('should call confirmImportYAML when confirmed', () => {
      const confirmImportYAML = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showImportConfirm: true }),
        actions: {
          ...createDefaultProps().actions,
          confirmImportYAML,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Confirm'));

      expect(confirmImportYAML).toHaveBeenCalledTimes(1);
    });
  });

  describe('Preview Modal', () => {
    it('should render when showPreviewModal is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showPreviewModal: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('preview-modal')).toBeInTheDocument();
    });

    it('should call handleRefreshPreview when refresh clicked', () => {
      const handleRefreshPreview = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showPreviewModal: true }),
        actions: {
          ...createDefaultProps().actions,
          handleRefreshPreview,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Refresh'));

      expect(handleRefreshPreview).toHaveBeenCalledTimes(1);
    });

    it('should call handleGenerateResume when download clicked', () => {
      const handleGenerateResume = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showPreviewModal: true }),
        actions: {
          ...createDefaultProps().actions,
          handleGenerateResume,
        },
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Download'));

      expect(handleGenerateResume).toHaveBeenCalledTimes(1);
    });
  });

  describe('Storage Limit Modal', () => {
    it('should render when showStorageLimitModal is true', () => {
      const props = createDefaultProps({
        modalManager: createMockModalManager({ showStorageLimitModal: true }),
      });
      render(<EditorModals {...props} />);

      expect(screen.getByTestId('storage-limit-modal')).toBeInTheDocument();
    });

    it('should call closeStorageLimitModal when closed', () => {
      const closeStorageLimitModal = vi.fn();
      const props = createDefaultProps({
        modalManager: createMockModalManager({
          showStorageLimitModal: true,
          closeStorageLimitModal,
        }),
      });
      render(<EditorModals {...props} />);

      fireEvent.click(screen.getByText('Close Storage Limit'));

      expect(closeStorageLimitModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('No modals open', () => {
    it('should not render any modals when all are closed', () => {
      const props = createDefaultProps();
      render(<EditorModals {...props} />);

      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('download-celebration-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('section-type-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('preview-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('storage-limit-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('context-aware-tour')).not.toBeInTheDocument();
    });
  });
});
