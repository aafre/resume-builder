import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { generateThumbnail } from "../services/templates";
import { useIconRegistry } from "../hooks/useIconRegistry";
import { usePreview } from "../hooks/usePreview";
import { useCloudSave } from "../hooks/useCloudSave";
import { useAuth } from "../contexts/AuthContext";
import { useConversion } from "../contexts/ConversionContext";
import { processSectionsForExport } from "../services/yamlService";
import { useEditorContext } from "../contexts/EditorContext";
import usePreferencePersistence from "../hooks/usePreferencePersistence";

// Import extracted hooks
import { useModalManager } from "../hooks/editor/useModalManager";
import { useEditorState } from "../hooks/editor/useEditorState";
import { useContactForm } from "../hooks/editor/useContactForm";
import { useSectionDragDrop } from "../hooks/editor/useSectionDragDrop";
import { useSectionNavigation } from "../hooks/editor/useSectionNavigation";
import { useResumeLoader } from "../hooks/editor/useResumeLoader";
import { useTourFlow } from "../hooks/editor/useTourFlow";
import { useSectionManagement } from "../hooks/editor/useSectionManagement";
import { useFileOperations } from "../hooks/editor/useFileOperations";
import { useEditorActions } from "../hooks/editor/useEditorActions";
import { EditorHeader, EditorModals, EditorContent } from "./editor";

// Lazy-loaded error components
const NotFound = lazy(() => import("./NotFound"));
const ErrorPage = lazy(() => import("./ErrorPage"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-xl text-gray-600">Loading...</p>
    </div>
  </div>
);

const Editor: React.FC = () => {
  const { resumeId: resumeIdFromUrl } = useParams<{ resumeId: string }>();
  const [searchParams] = useSearchParams();

  // Get context for footer integration
  const { setIsSidebarCollapsed: setContextIsSidebarCollapsed } = useEditorContext();

  // ===== LAYER 1: Core State Hooks =====
  const modalManager = useModalManager();
  const editorState = useEditorState();

  const {
    contactInfo,
    setContactInfo,
    sections,
    setSections,
    templateId,
    setTemplateId,
    supportsIcons,
    setSupportsIcons,
    originalTemplateData,
    setOriginalTemplateData,
    loading,
    setLoading,
    loadingError,
    setLoadingError,
  } = editorState;

  // Central icon registry for all uploaded icons
  const iconRegistry = useIconRegistry();

  // Auth state
  const { isAnonymous, session, loading: authLoading, anonMigrationInProgress } = useAuth();
  const isAuthenticated = !!session && !isAnonymous;

  // Conversion nudges
  const { hasShownDownloadToast, markDownloadToastShown, hasShownIdleNudge, markIdleNudgeShown } = useConversion();

  // AI warning state (not yet displayed in UI, but used by useResumeLoader)
  const [aiWarnings, setAIWarnings] = useState<string[]>([]);
  const [aiConfidence, setAIConfidence] = useState(0);

  // Tour persistence
  const { preferences, setPreference, isLoading: prefsLoading } = usePreferencePersistence({
    session,
    authLoading
  });

  // Refs for section scrolling and navigation
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const newSectionRef = useRef<HTMLDivElement | null>(null);

  // ===== LAYER 2: Dependent Hooks =====
  const contactForm = useContactForm({
    contactInfo,
    setContactInfo,
  });

  const dragDrop = useSectionDragDrop({
    sections,
    setSections,
  });

  const navigation = useSectionNavigation({
    sections,
    contactInfoRef,
    sectionRefs,
    setContextIsSidebarCollapsed,
  });

  // ===== LAYER 3: Complex Logic Hooks =====
  // NOTE: These must be declared BEFORE useCloudSave since it depends on resumeLoader

  // Wrapper for setShowAIWarning using modal manager
  const setShowAIWarning = useCallback((show: boolean) => {
    if (show) {
      modalManager.openAIWarning();
    } else {
      modalManager.closeAIWarning();
    }
  }, [modalManager.openAIWarning, modalManager.closeAIWarning]);

  const tourFlow = useTourFlow({
    session,
    isAnonymous,
    anonMigrationInProgress,
    authLoading,
    tourCompleted: preferences.tour_completed,
    prefsLoading,
    setPreference,
    hasShownIdleNudge,
    markIdleNudgeShown,
  });

  const resumeLoader = useResumeLoader({
    contactInfo,
    sections,
    setContactInfo,
    setSections,
    templateId,
    setTemplateId,
    setSupportsIcons,
    setOriginalTemplateData,
    setLoading,
    setLoadingError,
    authLoading,
    anonMigrationInProgress,
    session,
    iconRegistry,
    resumeIdFromUrl,
    searchParams,
    setShowAIWarning,
    setAIWarnings,
    setAIConfidence,
    isSigningInFromTour: tourFlow.isSigningInFromTour,
  });

  // ===== Cloud Save Integration =====
  // Convert iconRegistry to plain object for cloud save
  const iconsForCloudSave = React.useMemo(() => {
    const filenames = iconRegistry.getRegisteredFilenames();
    const iconsObj: { [filename: string]: File } = {};
    filenames.forEach(filename => {
      const file = iconRegistry.getIconFile(filename);
      if (file) {
        iconsObj[filename] = file;
      }
    });
    return iconsObj;
  }, [iconRegistry.getRegisteredFilenames().join(',')]);

  const {
    saveStatus,
    lastSaved: cloudLastSaved,
    saveNow,
    resumeId: savedResumeId
  } = useCloudSave({
    resumeId: resumeLoader.cloudResumeId,
    resumeData: contactInfo && templateId ? {
      contact_info: contactInfo,
      sections: sections,
      template_id: templateId
    } : { contact_info: {} as any, sections: [], template_id: '' },
    icons: iconsForCloudSave,
    enabled: !!templateId && !!contactInfo && !resumeLoader.isLoadingFromUrl && !authLoading,
    session: session
  });

  // Ref to track latest saveStatus for use in async callbacks (avoids stale closures)
  const saveStatusRef = useRef(saveStatus);
  useEffect(() => {
    saveStatusRef.current = saveStatus;
  }, [saveStatus]);

  /**
   * Saves pending changes before critical actions (Preview, Download, etc.)
   * Returns true if action can proceed, false if save failed
   */
  const saveBeforeAction = useCallback(async (actionName: string): Promise<boolean> => {
    // Skip save for anonymous users or if no data exists
    if (isAnonymous || !contactInfo || !templateId) {
      return true;
    }

    // If already saving, wait for completion (use ref to avoid stale closure)
    if (saveStatusRef.current === 'saving') {
      console.log(`Waiting for in-progress save before ${actionName}...`);
      const timeout = 10000;
      const start = Date.now();
      while (saveStatusRef.current === 'saving' && Date.now() - start < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return saveStatusRef.current !== 'error';
    }

    // Always trigger save before action
    try {
      console.log(`Saving before ${actionName}...`);
      const result = await saveNow();

      if (result === null && saveStatusRef.current === 'error') {
        toast.error(`Failed to save changes before ${actionName}. Please try again.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Save failed before ${actionName}:`, error);

      if (error instanceof Error && error.message === 'RESUME_LIMIT_REACHED') {
        modalManager.openStorageLimitModal();
        return false;
      }

      toast.error(`Failed to save changes before ${actionName}. Please try again.`);
      return false;
    }
  }, [isAnonymous, contactInfo, templateId, saveNow, modalManager.openStorageLimitModal]);

  // Update cloud resume ID when it's set from cloud save
  useEffect(() => {
    if (savedResumeId && savedResumeId !== resumeLoader.cloudResumeId) {
      resumeLoader.setCloudResumeId(savedResumeId);
    }
  }, [savedResumeId, resumeLoader.cloudResumeId, resumeLoader.setCloudResumeId]);

  const sectionManagement = useSectionManagement({
    sections,
    setSections,
    deleteTarget: modalManager.deleteTarget,
    openDeleteConfirm: modalManager.openDeleteConfirm,
    closeDeleteConfirm: modalManager.closeDeleteConfirm,
    closeSectionTypeModal: modalManager.closeSectionTypeModal,
    onSectionAdded: () => {
      setTimeout(() => {
        newSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  // ===== Preview Hook =====
  const preview = usePreview({
    contactInfo,
    sections,
    templateId,
    iconRegistry,
    processSections: processSectionsForExport,
    supportsIcons,
  });

  // ===== LAYER 4: Action Hooks =====
  const fileOperations = useFileOperations({
    contactInfo,
    setContactInfo,
    sections,
    setSections,
    iconRegistry,
    saveBeforeAction,
    isAnonymous,
    supportsIcons,
    setOriginalTemplateData,
    setIsLoadingFromUrl: resumeLoader.setIsLoadingFromUrl,
    pendingImportFile: modalManager.pendingImportFile,
    openImportConfirm: modalManager.openImportConfirm,
    closeImportConfirmModal: modalManager.closeImportConfirmModal,
    clearPendingImportFile: modalManager.clearPendingImportFile,
  });

  const editorActions = useEditorActions({
    contactInfo,
    setContactInfo,
    sections,
    setSections,
    templateId,
    supportsIcons,
    iconRegistry,
    processSections: processSectionsForExport,
    saveBeforeAction,
    isAnonymous,
    hasShownDownloadToast,
    markDownloadToastShown,
    originalTemplateData,
    isLoadingFromUrl: resumeLoader.isLoadingFromUrl,
    validateIcons: preview.validateIcons,
    previewIsStale: preview.isStale,
    clearPreview: preview.clearPreview,
    generatePreview: preview.generatePreview,
    checkAndRefreshIfStale: preview.checkAndRefreshIfStale,
    openPreviewModal: modalManager.openPreviewModal,
    openStartFreshConfirm: modalManager.openStartFreshConfirm,
    closeStartFreshConfirm: modalManager.closeStartFreshConfirm,
    openDownloadCelebration: modalManager.openDownloadCelebration,
  });

  // ===== DEPRECATED URL Pattern Block =====
  useEffect(() => {
    const templateParam = searchParams.get('template');
    const importedParam = searchParams.get('imported');

    // Exception: Allow ?template=X&imported=true for AI import flow only
    if (templateParam && importedParam === 'true') {
      setTemplateId(templateParam);
      return;
    }

    // Block deprecated ?template=X pattern (without imported flag)
    if (templateParam && !resumeIdFromUrl) {
      console.error('Deprecated URL pattern detected:', window.location.href);
      setLoadingError('Invalid URL: Please create a resume from the templates page');
      setLoading(false);
      return;
    }
  }, [searchParams, resumeIdFromUrl, setTemplateId, setLoadingError, setLoading]);

  // ===== Close advanced menu on click outside =====
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalManager.showAdvancedMenu) {
        const target = event.target as Element;
        if (!target.closest(".advanced-menu-container")) {
          modalManager.closeAdvancedMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalManager.showAdvancedMenu, modalManager.closeAdvancedMenu]);

  // ===== Keyboard shortcuts for preview =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        editorActions.handleOpenPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorActions.handleOpenPreview]);

  // ===== Warn user if closing browser/tab with unsaved changes =====
  useEffect(() => {
    if (isAnonymous || !contactInfo || !templateId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || saveStatus === 'error') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnonymous, contactInfo, templateId, saveStatus]);

  // ===== Save on component unmount =====
  const saveOnUnmountRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    saveOnUnmountRef.current = async () => {
      if (!isAnonymous && contactInfo && templateId && saveStatus !== 'saving') {
        try {
          await saveNow();
          console.log('Saved on unmount');

          const resumeId = savedResumeId || resumeLoader.cloudResumeId;
          if (resumeId) {
            console.log('Triggering thumbnail generation for resume:', resumeId);
            generateThumbnail(resumeId, session);
          }
        } catch (error) {
          console.error('Failed to save on unmount:', error);
        }
      }
    };
  }, [isAnonymous, contactInfo, templateId, saveStatus, saveNow, savedResumeId, resumeLoader.cloudResumeId, session]);

  useEffect(() => {
    return () => {
      if (saveOnUnmountRef.current) {
        saveOnUnmountRef.current();
      }
    };
  }, []);

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your resume builder...</p>
        </div>
      </div>
    );
  }

  // ===== Error State =====
  if (loadingError) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorPage />
      </Suspense>
    );
  }

  // ===== 404 State =====
  if (!templateId && !resumeIdFromUrl) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    );
  }

  // ===== Main Render =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Editor Content - Main content area */}
      <EditorContent
        contactInfo={contactInfo}
        setContactInfo={setContactInfo}
        sections={sections}
        supportsIcons={supportsIcons}
        iconRegistry={iconRegistry}
        contactForm={{
          socialLinkErrors: contactForm.socialLinkErrors,
          autoGeneratedIndexes: contactForm.autoGeneratedIndexes,
          handleSocialLinkChange: contactForm.handleSocialLinkChange,
          handleAddSocialLink: contactForm.handleAddSocialLink,
          handleRemoveSocialLink: contactForm.handleRemoveSocialLink,
        }}
        dragDrop={{
          sensors: dragDrop.sensors,
          activeId: dragDrop.activeId,
          draggedSection: dragDrop.draggedSection,
          handleDragStart: dragDrop.handleDragStart,
          handleDragEnd: dragDrop.handleDragEnd,
          handleDragCancel: dragDrop.handleDragCancel,
        }}
        sectionManagement={{
          editingTitleIndex: sectionManagement.editingTitleIndex,
          temporaryTitle: sectionManagement.temporaryTitle,
          setTemporaryTitle: sectionManagement.setTemporaryTitle,
          handleUpdateSection: sectionManagement.handleUpdateSection,
          handleDeleteSection: sectionManagement.handleDeleteSection,
          handleDeleteEntry: sectionManagement.handleDeleteEntry,
          handleTitleEdit: sectionManagement.handleTitleEdit,
          handleTitleSave: sectionManagement.handleTitleSave,
          handleTitleCancel: sectionManagement.handleTitleCancel,
        }}
        navigation={{
          activeSectionIndex: navigation.activeSectionIndex,
          isSidebarCollapsed: navigation.isSidebarCollapsed,
          scrollToSection: navigation.scrollToSection,
          setIsSidebarCollapsed: navigation.setIsSidebarCollapsed,
        }}
        modals={{
          showAIWarning: modalManager.showAIWarning,
          showAdvancedMenu: modalManager.showAdvancedMenu,
          showNavigationDrawer: modalManager.showNavigationDrawer,
          closeAIWarning: modalManager.closeAIWarning,
          openAdvancedMenu: modalManager.openAdvancedMenu,
          closeAdvancedMenu: modalManager.closeAdvancedMenu,
          openNavigationDrawer: modalManager.openNavigationDrawer,
          closeNavigationDrawer: modalManager.closeNavigationDrawer,
          openSectionTypeModal: modalManager.openSectionTypeModal,
          openHelpModal: modalManager.openHelpModal,
        }}
        fileOperations={{
          handleExportYAML: fileOperations.handleExportYAML,
          handleFileInputChange: fileOperations.handleFileInputChange,
          fileInputRef: fileOperations.fileInputRef,
          loadingSave: fileOperations.loadingSave,
          loadingLoad: fileOperations.loadingLoad,
        }}
        editorActions={{
          handleGenerateResume: editorActions.handleGenerateResume,
          handleOpenPreview: editorActions.handleOpenPreview,
          handleStartFresh: editorActions.handleStartFresh,
          isDownloading: editorActions.isDownloading,
        }}
        preview={{
          isGenerating: preview.isGenerating,
          isStale: preview.isStale,
        }}
        saveStatus={{
          saveStatus: saveStatus,
          lastSaved: cloudLastSaved,
        }}
        refs={{
          contactInfoRef: contactInfoRef,
          sectionRefs: sectionRefs,
          newSectionRef: newSectionRef,
        }}
      />

      {/* Editor Modals - All modals and dialogs */}
      <EditorModals
        modalManager={modalManager}
        tourFlow={tourFlow}
        preview={{
          previewUrl: preview.previewUrl,
          isGenerating: preview.isGenerating,
          isStale: preview.isStale,
          error: preview.error,
        }}
        actions={{
          handleAddSection: sectionManagement.handleAddSection,
          confirmDelete: sectionManagement.confirmDelete,
          confirmImportYAML: fileOperations.confirmImportYAML,
          confirmStartFresh: editorActions.confirmStartFresh,
          handleRefreshPreview: editorActions.handleRefreshPreview,
          handleGenerateResume: editorActions.handleGenerateResume,
        }}
        loading={{
          loadingStartFresh: editorActions.loadingStartFresh,
          loadingLoad: fileOperations.loadingLoad,
          isDownloading: editorActions.isDownloading,
        }}
        isAnonymous={isAnonymous}
        isAuthenticated={isAuthenticated}
        supportsIcons={supportsIcons}
        onAuthSuccess={() => {
          toast.success('Welcome! Your resume will now be saved to the cloud.');
        }}
      />

      {/* Editor Header - Status indicators and idle tooltip */}
      <EditorHeader
        showIdleTooltip={tourFlow.showIdleTooltip}
        onDismissIdleTooltip={tourFlow.dismissIdleTooltip}
        saveStatus={saveStatus}
        lastSaved={cloudLastSaved}
        isAnonymous={isAnonymous}
        isAuthenticated={isAuthenticated}
        onSignInClick={modalManager.openAuthModal}
      />
    </div>
  );
};

export default Editor;
