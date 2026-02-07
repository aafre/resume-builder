import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useIconRegistry } from "../hooks/useIconRegistry";
import { usePreview } from "../hooks/usePreview";
import { useAuth } from "../contexts/AuthContext";
import { useConversion } from "../contexts/ConversionContext";
import { processSectionsForExport } from "../services/yamlService";
import { useEditorContext } from "../contexts/EditorContext";
import usePreferencePersistence from "../hooks/usePreferencePersistence";

// Import extracted hooks
import { useModalManager } from "../hooks/editor/useModalManager";
import { useEditorState } from "../hooks/editor/useEditorState";
import { useContactForm } from "../hooks/editor/useContactForm";
import { useUnifiedDragDrop } from "../hooks/editor/useUnifiedDragDrop";
import { useSectionNavigation } from "../hooks/editor/useSectionNavigation";
import { useResumeLoader } from "../hooks/editor/useResumeLoader";
import { useTourFlow } from "../hooks/editor/useTourFlow";
import { useSectionManagement } from "../hooks/editor/useSectionManagement";
import { useFileOperations } from "../hooks/editor/useFileOperations";
import { useEditorActions } from "../hooks/editor/useEditorActions";
import { useSaveIntegration } from "../hooks/editor/useSaveIntegration";
import { useEditorEffects } from "../hooks/editor/useEditorEffects";
import { EditorHeader, EditorModals, EditorContent } from "./editor/index";

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
  const { isAnonymous, session, loading: authLoading, anonMigrationInProgress, authInProgress } = useAuth();
  const isAuthenticated = !!session && !isAnonymous;

  // Conversion nudges
  const { hasShownDownloadToast, markDownloadToastShown, hasShownIdleNudge, markIdleNudgeShown } = useConversion();

  // AI warning state (not yet displayed in UI, but used by useResumeLoader)
  const [_aiWarnings, setAIWarnings] = useState<string[]>([]);
  const [_aiConfidence, setAIConfidence] = useState(0);

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

  const dragDrop = useUnifiedDragDrop({
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
  const {
    saveStatus,
    lastSaved: cloudLastSaved,
    saveNow,
    savedResumeId,
    saveBeforeAction,
  } = useSaveIntegration({
    contactInfo,
    sections,
    templateId,
    iconRegistry,
    cloudResumeId: resumeLoader.cloudResumeId,
    setCloudResumeId: resumeLoader.setCloudResumeId,
    isLoadingFromUrl: resumeLoader.isLoadingFromUrl,
    authLoading,
    session,
    isAnonymous,
    openStorageLimitModal: modalManager.openStorageLimitModal,
  });

  // Memoized callback for scrolling to newly added sections
  const handleSectionAdded = useCallback((insertedIndex: number) => {
    setTimeout(() => {
      const targetRef = sectionRefs.current[insertedIndex];
      targetRef?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const sectionManagement = useSectionManagement({
    sections,
    setSections,
    deleteTarget: modalManager.deleteTarget,
    openDeleteConfirm: modalManager.openDeleteConfirm,
    closeDeleteConfirm: modalManager.closeDeleteConfirm,
    closeSectionTypeModal: modalManager.closeSectionTypeModal,
    onSectionAdded: handleSectionAdded,
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

  // ===== Editor Effects (click outside, keyboard shortcuts, save lifecycle) =====
  useEditorEffects({
    showAdvancedMenu: modalManager.showAdvancedMenu,
    closeAdvancedMenu: modalManager.closeAdvancedMenu,
    handleOpenPreview: editorActions.handleOpenPreview,
    isAnonymous,
    contactInfo,
    templateId,
    saveStatus,
    saveNow,
    savedResumeId,
    cloudResumeId: resumeLoader.cloudResumeId,
    session,
    authInProgress,
  });

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
        isAnonymous={isAnonymous}
        isAuthenticated={isAuthenticated}
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
          activeLevel: dragDrop.activeLevel,
          draggedSection: dragDrop.draggedSection,
          draggedItemInfo: dragDrop.draggedItemInfo,
          handleDragStart: dragDrop.handleDragStart,
          handleDragEnd: dragDrop.handleDragEnd,
          handleDragCancel: dragDrop.handleDragCancel,
          collisionDetection: dragDrop.collisionDetection,
          registerItemHandler: dragDrop.registerItemHandler,
          unregisterItemHandler: dragDrop.unregisterItemHandler,
          setDraggedItemInfo: dragDrop.setDraggedItemInfo,
        }}
        sectionManagement={{
          editingTitleIndex: sectionManagement.editingTitleIndex,
          temporaryTitle: sectionManagement.temporaryTitle,
          setTemporaryTitle: sectionManagement.setTemporaryTitle,
          handleUpdateSection: sectionManagement.handleUpdateSection,
          handleDeleteSection: sectionManagement.handleDeleteSection,
          handleDeleteEntry: sectionManagement.handleDeleteEntry,
          handleReorderEntry: sectionManagement.handleReorderEntry,
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
          isOpeningPreview: editorActions.isOpeningPreview,
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
        sections={sections}
        contactInfo={contactInfo}
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
        isAuthenticated={isAuthenticated}
        contactInfo={contactInfo}
        sections={sections}
      />
    </div>
  );
};

export default Editor;
