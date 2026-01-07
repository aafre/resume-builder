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
import { AlertCircle, X } from "lucide-react";
import { generateThumbnail } from "../services/templates";
import { useIconRegistry } from "../hooks/useIconRegistry";
import { usePreview } from "../hooks/usePreview";
import { useCloudSave } from "../hooks/useCloudSave";
import { useAuth } from "../contexts/AuthContext";
import { useConversion } from "../contexts/ConversionContext";
import { StorageLimitModal } from "./StorageLimitModal";
import { processSectionsForExport } from "../services/yamlService";
import ContactInfoSection from "./ContactInfoSection";
import FormattingHelp from "./FormattingHelp";
import { Section } from "../types";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import GenericSection from "./GenericSection";
import IconListSection from "./IconListSection";
import SectionTypeModal from "./SectionTypeModal";
import EditorToolbar from "./EditorToolbar";
import MobileActionBar from "./MobileActionBar";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import SectionNavigator from "./SectionNavigator";
import ResponsiveConfirmDialog from "./ResponsiveConfirmDialog";
import DragHandle from "./DragHandle";
import PreviewModal from "./PreviewModal";
import { useEditorContext } from "../contexts/EditorContext";
import ContextAwareTour from "./ContextAwareTour";
import TabbedHelpModal from "./TabbedHelpModal";
import AuthModal from "./AuthModal";
import DownloadCelebrationModal from "./DownloadCelebrationModal";
import usePreferencePersistence from "../hooks/usePreferencePersistence";
import { isExperienceSection, isEducationSection } from "../utils/sectionTypeChecker";
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

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
import { EditorHeader } from "./editor";

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
    } : { contact_info: { name: '', location: '', email: '', phone: '' }, sections: [], template_id: '' },
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

  // ===== Helper for adding section with loading state =====
  const handleAddNewSectionClick = async () => {
    modalManager.openSectionTypeModal();
  };

  // ===== Main Render =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content Container */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-[calc(var(--mobile-action-bar-height)+1rem)] lg:pb-[1rem] max-w-4xl lg:max-w-none transition-all duration-300 ${
        navigation.isSidebarCollapsed ? 'lg:mr-[88px]' : 'lg:mr-[296px]'
      }`}>
        {/* Imported Resume Review Banner */}
        {modalManager.showAIWarning && (
          <div className="mb-4 p-4 rounded-lg border-2 bg-blue-50 border-blue-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-blue-900">
                Imported Resume - Please Review
              </h3>
              <p className="text-xs mt-1 text-blue-700">
                Please review all information for accuracy and completeness.
              </p>
            </div>
            <button
              onClick={modalManager.closeAIWarning}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Contact Information Section */}
        {contactInfo && (
          <div ref={contactInfoRef}>
            <ContactInfoSection
              contactInfo={contactInfo}
              onUpdate={setContactInfo}
              socialLinkErrors={contactForm.socialLinkErrors}
              onSocialLinkChange={contactForm.handleSocialLinkChange}
              onAddSocialLink={contactForm.handleAddSocialLink}
              onRemoveSocialLink={contactForm.handleRemoveSocialLink}
              autoGeneratedIndexes={contactForm.autoGeneratedIndexes}
            />
          </div>
        )}

        {/* Global Formatting Help */}
        <FormattingHelp />

        {/* Resume Sections with Drag and Drop */}
        <DndContext
          sensors={dragDrop.sensors}
          collisionDetection={closestCenter}
          onDragStart={dragDrop.handleDragStart}
          onDragEnd={dragDrop.handleDragEnd}
          onDragCancel={dragDrop.handleDragCancel}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={sections.map((_, index) => index.toString())}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section, index) => {
              if (isExperienceSection(section)) {
                return (
                  <DragHandle key={index} id={index.toString()} disabled={false}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          newSectionRef.current = el;
                        }
                      }}
                    >
                      <ExperienceSection
                        sectionName={section.name}
                        experiences={section.content}
                        onUpdate={(updatedExperiences) =>
                          sectionManagement.handleUpdateSection(index, {
                            ...section,
                            content: updatedExperiences,
                          })
                        }
                        onTitleEdit={() => sectionManagement.handleTitleEdit(index)}
                        onTitleSave={sectionManagement.handleTitleSave}
                        onTitleCancel={sectionManagement.handleTitleCancel}
                        onDelete={() => sectionManagement.handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => sectionManagement.handleDeleteEntry(index, entryIndex)}
                        isEditingTitle={sectionManagement.editingTitleIndex === index}
                        temporaryTitle={sectionManagement.temporaryTitle}
                        setTemporaryTitle={sectionManagement.setTemporaryTitle}
                        supportsIcons={supportsIcons}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else if (isEducationSection(section)) {
                return (
                  <DragHandle key={index} id={index.toString()} disabled={false}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          newSectionRef.current = el;
                        }
                      }}
                    >
                      <EducationSection
                        sectionName={section.name}
                        education={section.content}
                        onUpdate={(updatedEducation) =>
                          sectionManagement.handleUpdateSection(index, {
                            ...section,
                            content: updatedEducation,
                          })
                        }
                        onTitleEdit={() => sectionManagement.handleTitleEdit(index)}
                        onTitleSave={sectionManagement.handleTitleSave}
                        onTitleCancel={sectionManagement.handleTitleCancel}
                        onDelete={() => sectionManagement.handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => sectionManagement.handleDeleteEntry(index, entryIndex)}
                        isEditingTitle={sectionManagement.editingTitleIndex === index}
                        temporaryTitle={sectionManagement.temporaryTitle}
                        setTemporaryTitle={sectionManagement.setTemporaryTitle}
                        supportsIcons={supportsIcons}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else if (section.type === "icon-list") {
                return (
                  <DragHandle key={index} id={index.toString()} disabled={false}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          newSectionRef.current = el;
                        }
                      }}
                    >
                      <IconListSection
                        data={section.content}
                        onUpdate={(updatedContent) =>
                          sectionManagement.handleUpdateSection(index, {
                            ...section,
                            content: updatedContent,
                          })
                        }
                        onDelete={() => sectionManagement.handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => sectionManagement.handleDeleteEntry(index, entryIndex)}
                        sectionName={section.name}
                        onEditTitle={() => sectionManagement.handleTitleEdit(index)}
                        onSaveTitle={sectionManagement.handleTitleSave}
                        onCancelTitle={sectionManagement.handleTitleCancel}
                        isEditing={sectionManagement.editingTitleIndex === index}
                        temporaryTitle={sectionManagement.temporaryTitle}
                        setTemporaryTitle={sectionManagement.setTemporaryTitle}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else {
                return (
                  <DragHandle key={index} id={index.toString()} disabled={false}>
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          newSectionRef.current = el;
                        }
                      }}
                    >
                      <GenericSection
                        section={section}
                        onUpdate={(updatedSection) =>
                          sectionManagement.handleUpdateSection(index, updatedSection)
                        }
                        onEditTitle={() => sectionManagement.handleTitleEdit(index)}
                        onSaveTitle={sectionManagement.handleTitleSave}
                        onCancelTitle={sectionManagement.handleTitleCancel}
                        onDelete={() => sectionManagement.handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => sectionManagement.handleDeleteEntry(index, entryIndex)}
                        isEditing={sectionManagement.editingTitleIndex === index}
                        temporaryTitle={sectionManagement.temporaryTitle}
                        setTemporaryTitle={sectionManagement.setTemporaryTitle}
                      />
                    </div>
                  </DragHandle>
                );
              }
            })}
          </SortableContext>

          <DragOverlay modifiers={[restrictToVerticalAxis]}>
            {dragDrop.activeId && dragDrop.draggedSection ? (
              <div className="drag-overlay">
                {dragDrop.draggedSection.name === "Experience" ? (
                  <ExperienceSection
                    sectionName={dragDrop.draggedSection.name}
                    experiences={dragDrop.draggedSection.content}
                    onUpdate={() => {}}
                    onTitleEdit={() => {}}
                    onTitleSave={() => {}}
                    onTitleCancel={() => {}}
                    onDelete={() => {}}
                    isEditingTitle={false}
                    temporaryTitle=""
                    setTemporaryTitle={() => {}}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                  />
                ) : dragDrop.draggedSection.name === "Education" ? (
                  <EducationSection
                    sectionName={dragDrop.draggedSection.name}
                    education={dragDrop.draggedSection.content}
                    onUpdate={() => {}}
                    onTitleEdit={() => {}}
                    onTitleSave={() => {}}
                    onTitleCancel={() => {}}
                    onDelete={() => {}}
                    isEditingTitle={false}
                    temporaryTitle=""
                    setTemporaryTitle={() => {}}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                  />
                ) : dragDrop.draggedSection.type === "icon-list" ? (
                  <IconListSection
                    data={dragDrop.draggedSection.content}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    sectionName={dragDrop.draggedSection.name}
                    onEditTitle={() => {}}
                    onSaveTitle={() => {}}
                    onCancelTitle={() => {}}
                    isEditing={false}
                    temporaryTitle=""
                    setTemporaryTitle={() => {}}
                    iconRegistry={iconRegistry}
                  />
                ) : (
                  <GenericSection
                    section={dragDrop.draggedSection}
                    onUpdate={() => {}}
                    onEditTitle={() => {}}
                    onSaveTitle={() => {}}
                    onCancelTitle={() => {}}
                    onDelete={() => {}}
                    isEditing={false}
                    temporaryTitle=""
                    setTemporaryTitle={() => {}}
                  />
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Desktop Toolbar - Tablet only */}
        <div className="hidden md:flex lg:hidden fixed z-[60] bg-gradient-to-r from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg transition-all duration-300 left-auto right-6 border border-gray-200/60 rounded-2xl w-auto max-w-none bottom-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 p-4 lg:p-6 max-w-screen-lg mx-auto lg:max-w-none">
            <EditorToolbar
              onAddSection={handleAddNewSectionClick}
              onGenerateResume={editorActions.handleGenerateResume}
              onExportYAML={fileOperations.handleExportYAML}
              onImportYAML={fileOperations.handleFileInputChange}
              onToggleHelp={modalManager.openHelpModal}
              onLoadEmptyTemplate={editorActions.handleStartFresh}
              loadingAddSection={false}
              generating={editorActions.isDownloading}
              loadingSave={fileOperations.loadingSave}
              loadingLoad={fileOperations.loadingLoad}
              showAdvancedMenu={modalManager.showAdvancedMenu}
              setShowAdvancedMenu={(show) => show ? modalManager.openAdvancedMenu() : modalManager.closeAdvancedMenu()}
              mode="integrated"
            />
          </div>
        </div>

        {/* Mobile Action Bar */}
        <MobileActionBar
          onNavigationClick={modalManager.openNavigationDrawer}
          onPreviewClick={editorActions.handleOpenPreview}
          onDownloadClick={editorActions.handleGenerateResume}
          isSaving={saveStatus === 'saving'}
          isGenerating={editorActions.isDownloading}
          isGeneratingPreview={preview.isGenerating}
          previewIsStale={preview.isStale}
          lastSaved={cloudLastSaved}
          saveError={saveStatus === 'error'}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNavigationDrawer
          isOpen={modalManager.showNavigationDrawer}
          onClose={modalManager.closeNavigationDrawer}
          sections={sections}
          onSectionClick={navigation.scrollToSection}
          activeSectionIndex={navigation.activeSectionIndex}
          onAddSection={handleAddNewSectionClick}
          onExportYAML={fileOperations.handleExportYAML}
          onImportYAML={() => fileOperations.fileInputRef.current?.click()}
          onStartFresh={editorActions.handleStartFresh}
          onHelp={modalManager.openHelpModal}
          loadingSave={fileOperations.loadingSave}
          loadingLoad={fileOperations.loadingLoad}
        />

        {/* Desktop Section Navigator Sidebar */}
        <SectionNavigator
          sections={sections}
          onSectionClick={navigation.scrollToSection}
          activeSectionIndex={navigation.activeSectionIndex}
          onAddSection={handleAddNewSectionClick}
          onDownloadResume={editorActions.handleGenerateResume}
          onPreviewResume={editorActions.handleOpenPreview}
          onExportYAML={fileOperations.handleExportYAML}
          onImportYAML={() => fileOperations.fileInputRef.current?.click()}
          onStartFresh={editorActions.handleStartFresh}
          onHelp={modalManager.openHelpModal}
          isGenerating={editorActions.isDownloading}
          isGeneratingPreview={preview.isGenerating}
          previewIsStale={preview.isStale}
          loadingSave={fileOperations.loadingSave}
          loadingLoad={fileOperations.loadingLoad}
          onCollapseChange={navigation.setIsSidebarCollapsed}
        />

        {/* Hidden file input */}
        <input
          ref={fileOperations.fileInputRef}
          type="file"
          accept=".yaml,.yml"
          className="hidden"
          onChange={fileOperations.handleFileInputChange}
        />
      </div>

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
          toast.success('Welcome! Your resume will now be saved to the cloud.');
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
          onSelect={sectionManagement.handleAddSection}
          supportsIcons={supportsIcons}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showDeleteConfirm}
        onClose={modalManager.closeDeleteConfirm}
        onConfirm={sectionManagement.confirmDelete}
        title={modalManager.deleteTarget?.type === 'section' ? "Delete Section?" : "Delete Entry?"}
        message={
          modalManager.deleteTarget?.type === 'section'
            ? `Are you sure you want to delete the "${modalManager.deleteTarget.sectionName}" section? This will remove all content in this section and cannot be undone.`
            : "Are you sure you want to delete this entry? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Start Fresh Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showStartFreshConfirm}
        onClose={modalManager.closeStartFreshConfirm}
        onConfirm={editorActions.confirmStartFresh}
        title="Start Fresh?"
        message="Starting fresh will permanently delete all your current work. This action cannot be undone. Are you sure you want to continue?"
        confirmText="Start Fresh"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={editorActions.loadingStartFresh}
      />

      {/* Import YAML Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={modalManager.showImportConfirm}
        onClose={modalManager.closeImportConfirm}
        onConfirm={fileOperations.confirmImportYAML}
        title="Confirm Import?"
        message="Importing this will override your existing content."
        confirmText="Confirm Import"
        cancelText="Cancel Import"
        isDestructive={true}
        isLoading={fileOperations.loadingLoad}
      />

      {/* PDF Preview Modal */}
      <PreviewModal
        isOpen={modalManager.showPreviewModal}
        onClose={modalManager.closePreviewModal}
        previewUrl={preview.previewUrl}
        isGenerating={preview.isGenerating}
        isDownloading={editorActions.isDownloading}
        isStale={preview.isStale}
        error={preview.error}
        onRefresh={editorActions.handleRefreshPreview}
        onDownload={editorActions.handleGenerateResume}
      />

      {/* Storage Limit Modal */}
      <StorageLimitModal
        isOpen={modalManager.showStorageLimitModal}
        onClose={modalManager.closeStorageLimitModal}
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
