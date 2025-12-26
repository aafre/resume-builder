import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchTemplate, generateResume, generateThumbnail } from "../services/templates";
import { getSessionId } from "../utils/session";
import { useIconRegistry } from "../hooks/useIconRegistry";
import { usePreview } from "../hooks/usePreview";
import { useCloudSave } from "../hooks/useCloudSave";
import { useAuth } from "../contexts/AuthContext";
import { useConversion } from "../contexts/ConversionContext";
import { StorageLimitModal } from "./StorageLimitModal";
import { supabase } from "../lib/supabase";
import { apiClient } from "../lib/api-client";
import yaml from "js-yaml";
import { PortableYAMLData } from "../types/iconTypes";
import { extractReferencedIconFilenames } from "../utils/iconExtractor";
import { isExperienceSection, isEducationSection } from "../utils/sectionTypeChecker";
import { migrateLegacySections } from "../utils/sectionMigration";
import ContactInfoSection from "./ContactInfoSection";
import FormattingHelp from "./FormattingHelp";
import { validatePlatformUrl, generateDisplayText } from "../constants/socialPlatforms";
import { SocialLink } from "../types";
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
import { MdFileDownload, MdHelpOutline } from "react-icons/md";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

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

// Default icons provided by the system (served from /icons/ directory)
// Complete list of all icons in /icons/ directory (27 icons total)
const DEFAULT_ICONS = new Set([
  // Contact icons (13)
  'location.png',
  'email.png',
  'phone.png',
  'linkedin.png',
  'github.png',
  'twitter.png',
  'website.png',
  'pinterest.png',
  'medium.png',
  'youtube.png',
  'stackoverflow.png',
  'behance.png',
  'dribbble.png',

  // Company icons (4)
  'company.png',
  'company_google.png',
  'company_amazon.png',
  'company_apple.png',

  // School/Education icons (4)
  'school.png',
  'school_harvard.png',
  'school_oxford.png',
  'school_berkeley.svg',

  // Certification icons (6)
  'certification_aws.png',
  'certification_azure.png',
  'certification_k8s.png',
  'certification_google.png',
  'certification_devops.png',
  'certification_scrum.png',
]);

interface Section {
  name: string;
  type?: string;
  content: any;
}

interface ContactInfo {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin?: string; // Deprecated but kept for backward compatibility
  linkedin_display?: string; // Deprecated but kept for backward compatibility
  social_links?: SocialLink[];
}

const Editor: React.FC = () => {
  const { resumeId: resumeIdFromUrl } = useParams<{ resumeId: string }>();

  // Get context for footer integration
  const {
    isAtBottom: contextIsAtBottom,
    setIsAtBottom: setContextIsAtBottom,
    setIsSidebarCollapsed: setContextIsSidebarCollapsed,
  } = useEditorContext();

  // TODO: useResponsive() will be added when implementing navigation drawer

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [supportsIcons, setSupportsIcons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [originalTemplateData, setOriginalTemplateData] = useState<{
    contactInfo: ContactInfo;
    sections: Section[];
  } | null>(null);

  // Central icon registry for all uploaded icons
  const iconRegistry = useIconRegistry();

  // Auth state - used by cloud save
  const { isAnonymous, session, loading: authLoading } = useAuth();
  const isAuthenticated = !!session && !isAnonymous;

  // Conversion nudges
  const { hasShownDownloadToast, markDownloadToastShown, hasShownIdleNudge, markIdleNudgeShown } = useConversion();

  const [showStorageLimitModal, setShowStorageLimitModal] = useState(false);
  const [cloudResumeId, setCloudResumeId] = useState<string | null>(resumeIdFromUrl || null);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState<boolean>(!!resumeIdFromUrl);

  // Process sections to clean up icon paths for export/preview
  const processSections = useCallback((sections: Section[]) => {
    return sections.map((section) => {
      // Handle icon-list sections (Certifications, Awards, etc.)
      if (section.type === "icon-list") {
        const updatedContent = section.content.map((item: any) => {
          // Remove iconFile and iconBase64 for export, keep only clean icon filename
          const { iconFile, iconBase64, ...cleanItem } = item;
          return {
            certification: cleanItem.certification || "",
            issuer: cleanItem.issuer || "",
            date: cleanItem.date || "",
            icon: cleanItem.icon
              ? cleanItem.icon.startsWith("/icons/")
                ? cleanItem.icon.replace("/icons/", "")
                : cleanItem.icon
              : null,
          };
        });
        return {
          ...section,
          content: updatedContent,
        };
      }

      if (isExperienceSection(section) || isEducationSection(section)) {
        const updatedContent = Array.isArray(section.content)
          ? section.content.map((item: any) => {
              // Remove iconFile and iconBase64 for export, keep only clean icon filename
              const { iconFile, iconBase64, ...rest } = item;
              return {
                ...rest,
                icon: rest.icon
                  ? rest.icon.startsWith("/icons/")
                    ? rest.icon.replace("/icons/", "")
                    : rest.icon
                  : null,
              };
            })
          : section.content;

        return {
          ...section,
          content: updatedContent,
        };
      }

      return section;
    });
  }, []);

  // Preview hook - handles PDF preview generation and caching
  const {
    previewUrl,
    isGenerating: isGeneratingPreview,
    error: previewError,
    isStale: previewIsStale,
    generatePreview,
  } = usePreview({
    contactInfo,
    sections,
    templateId,
    iconRegistry,
    processSections,
  });

  // Cloud save hook - handles saving to Supabase for authenticated users
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
    saveNow, // Used before critical actions
    resumeId: savedResumeId
  } = useCloudSave({
    resumeId: cloudResumeId,
    resumeData: contactInfo && templateId ? {
      contact_info: contactInfo,
      sections: sections,
      template_id: templateId
    } : { contact_info: {} as any, sections: [], template_id: '' },
    icons: iconsForCloudSave,
    enabled: !!templateId && !!contactInfo && !isLoadingFromUrl && !authLoading,  // Wait for auth and data to be ready
    session: session  // Pass session from AuthContext
  });

  // Update cloud resume ID when it's set from cloud save
  useEffect(() => {
    if (savedResumeId && savedResumeId !== cloudResumeId) {
      setCloudResumeId(savedResumeId);
    }
  }, [savedResumeId, cloudResumeId]);

  // Note: Storage limit errors are handled in saveBeforeAction() via RESUME_LIMIT_REACHED
  // No need for blanket error handling here that shows modal for all errors

  const [generating, setGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(
    null
  );
  const [temporaryTitle, setTemporaryTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const newSectionRef = useRef<HTMLDivElement | null>(null);
  const contactInfoRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  // Idle nudge state
  const [showIdleTooltip, setShowIdleTooltip] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'section' | 'entry';
    sectionIndex: number;
    entryIndex?: number;
    sectionName?: string;
  } | null>(null);

  // Start Fresh confirmation
  const [showStartFreshConfirm, setShowStartFreshConfirm] = useState(false);

  // Import YAML confirmation
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  // Navigation drawer state
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(-1); // -1 for contact info
  const [isSidebarCollapsed, setIsSidebarCollapsedLocal] = useState(false);

  // Sync sidebar state with context for footer awareness
  const setIsSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsedLocal(collapsed);
    setContextIsSidebarCollapsed(collapsed);
  };

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [loadingAddSection, setLoadingAddSection] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);

  // Social links state management
  const [socialLinkErrors, setSocialLinkErrors] = useState<Record<number, string>>({});
  const [autoGeneratedIndexes, setAutoGeneratedIndexes] = useState<Set<number>>(new Set());
  const socialLinkDebounceRefs = useRef<Record<number, NodeJS.Timeout>>({});

  // Simple scroll detection for footer visibility
  const lastScrollY = useRef(0);

  // Store save function for unmount to avoid stale closure
  const saveOnUnmountRef = useRef<(() => Promise<void>) | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Saves pending changes before critical actions (Preview, Download, etc.)
   * Returns true if action can proceed, false if save failed
   */
  const saveBeforeAction = useCallback(async (actionName: string): Promise<boolean> => {
    // Skip save for anonymous users or if no data exists
    if (isAnonymous || !contactInfo || !templateId) {
      return true;
    }

    // If already saving, wait for completion
    if (saveStatus === 'saving') {
      console.log(`Waiting for in-progress save before ${actionName}...`);
      // Wait up to 10 seconds
      const timeout = 10000;
      const start = Date.now();
      while (saveStatus === 'saving' && Date.now() - start < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return saveStatus !== 'error';
    }

    // Always trigger save before action to ensure latest data is persisted
    // Backend handles deduplication via hash comparison, so redundant saves are cheap
    try {
      console.log(`Saving before ${actionName}...`);
      const result = await saveNow();

      if (result === null && saveStatus === 'error') {
        toast.error(`Failed to save changes before ${actionName}. Please try again.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Save failed before ${actionName}:`, error);

      // Handle storage limit error
      if (error instanceof Error && error.message === 'RESUME_LIMIT_REACHED') {
        setShowStorageLimitModal(true);
        return false;
      }

      toast.error(`Failed to save changes before ${actionName}. Please try again.`);
      return false;
    }
  }, [isAnonymous, contactInfo, templateId, saveStatus, saveNow]);

  useEffect(() => {
    // Skip template loading if we're loading a saved resume from URL
    // The resume data will be loaded from the database instead
    if (resumeIdFromUrl || isLoadingFromUrl) {
      return;
    }

    // Skip if no template ID is set yet
    if (!templateId) {
      return;
    }

    // Skip template loading if editor already has data (e.g., from YAML import)
    // This prevents overwriting imported data with default template
    if (contactInfo && sections.length > 0) {
      return;
    }

    const loadTemplate = async () => {
      try {
        setLoading(true);
        const { yaml: yamlString, supportsIcons } = await fetchTemplate(
          templateId
        );
        const parsedYaml = yaml.load(yamlString) as {
          contact_info: ContactInfo;
          sections: Section[];
        };
        setContactInfo(parsedYaml.contact_info);
        // Migrate legacy sections (auto-add type property for backwards compatibility)
        const migratedSections = migrateLegacySections(parsedYaml.sections);
        // Process sections to clean up icon paths when loading template
        const processedSections = processSections(migratedSections);
        setSections(processedSections);
        setSupportsIcons(supportsIcons);

        // Store original template data to compare against changes
        setOriginalTemplateData({
          contactInfo: parsedYaml.contact_info,
          sections: processedSections,
        });
      } catch (error) {
        console.error("Error fetching template:", error);
        setLoadingError(
          "Failed to load template. Please check your connection and try again."
        );
        // Don't show toast when we're going to show error page
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, resumeIdFromUrl, isLoadingFromUrl]);

  // Load saved resume from cloud when resumeId is in URL
  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) return;

    if (!resumeIdFromUrl || !supabase) return;

    const loadResumeFromCloud = async () => {
      try {
        setLoading(true);

        // Use session from AuthContext instead of calling getSession()
        if (!session) {
          toast.error('Please sign in to load saved resumes');
          return;
        }

        // Use centralized API client (handles auth, 401/403 interceptor)
        const { resume } = await apiClient.get(`/api/resumes/${resumeIdFromUrl}`);

        // Populate editor state from database (JSONB)
        setContactInfo(resume.contact_info);
        setSections(resume.sections);
        setTemplateId(resume.template_id); // Get template ID from database
        setCloudResumeId(resume.id);

        // Set supportsIcons flag based on template
        // Only 'modern-with-icons' template supports icons
        const templateSupportsIcons = resume.template_id === 'modern-with-icons';
        setSupportsIcons(templateSupportsIcons);

        // Load icons from storage URLs and register them
        iconRegistry.clearRegistry(); // Clear existing icons first
        for (const icon of resume.icons || []) {
          try {
            const iconResponse = await fetch(icon.storage_url);
            const blob = await iconResponse.blob();
            const file = new File([blob], icon.filename, { type: blob.type });
            // Use registerIconWithFilename to preserve original filename from storage
            iconRegistry.registerIconWithFilename(file, icon.filename);
          } catch (iconError) {
            console.error(`Failed to load icon ${icon.filename}:`, iconError);
          }
        }

        toast.success('Resume loaded successfully');
        setIsLoadingFromUrl(false);
      } catch (error) {
        console.error('Failed to load resume:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load resume');
        setIsLoadingFromUrl(false);
      } finally {
        setLoading(false);
      }
    };

    loadResumeFromCloud();
  }, [resumeIdFromUrl, authLoading, session]);

  // Tour persistence using unified preferences hook
  const { preferences, setPreference, isLoading: prefsLoading } = usePreferencePersistence({
    session,
    authLoading
  });

  const shouldShowTour = !preferences.tour_completed && !prefsLoading;

  const markTourComplete = useCallback(async () => {
    await setPreference('tour_completed', true);
  }, [setPreference]);

  const [showAuthModalFromTour, setShowAuthModalFromTour] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // Bug fix: Was referenced but not defined
  const [showDownloadCelebration, setShowDownloadCelebration] = useState(false);

  useEffect(() => {
    if (shouldShowTour) {
      setTimeout(() => setShowWelcomeTour(true), 1500);
    }
  }, [shouldShowTour]);

  const handleTourComplete = async () => {
    setShowWelcomeTour(false);
    await markTourComplete();
  };

  // Idle nudge: Show tooltip after 5 minutes for anonymous users (one-time ever)
  useEffect(() => {
    if (isAnonymous && !hasShownIdleNudge && !authLoading) {
      // Start 5-minute timer
      idleTimerRef.current = setTimeout(() => {
        setShowIdleTooltip(true);
        markIdleNudgeShown();

        // Auto-dismiss after 10 seconds
        setTimeout(() => setShowIdleTooltip(false), 10000);
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [isAnonymous, hasShownIdleNudge, authLoading, markIdleNudgeShown]);

  const handleUpdateSection = (index: number, updatedSection: Section) => {
    const updatedSections = [...sections];
    updatedSections[index] = updatedSection;
    setSections(updatedSections);
  };

  const handleTitleEdit = (index: number) => {
    setEditingTitleIndex(index);
    setTemporaryTitle(sections[index].name);
  };

  const handleTitleSave = () => {
    if (editingTitleIndex === null) return;
    const updatedSections = [...sections];
    updatedSections[editingTitleIndex].name = temporaryTitle;
    setSections(updatedSections);
    setEditingTitleIndex(null);
  };

  const handleTitleCancel = () => {
    setTemporaryTitle("");
    setEditingTitleIndex(null);
  };

  const handleDeleteSection = (index: number) => {
    // Show confirmation dialog instead of deleting immediately
    setDeleteTarget({
      type: 'section',
      sectionIndex: index,
      sectionName: sections[index]?.name,
    });
    setShowDeleteConfirm(true);
  };

  const handleDeleteEntry = (sectionIndex: number, entryIndex: number) => {
    // Show confirmation dialog for entry deletion
    setDeleteTarget({
      type: 'entry',
      sectionIndex,
      entryIndex,
      sectionName: sections[sectionIndex]?.name,
    });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'section') {
      // Delete entire section
      const updatedSections = sections.filter((_, i) => i !== deleteTarget.sectionIndex);
      setSections(updatedSections);
      toast.success(`Section "${deleteTarget.sectionName}" deleted`);
    } else if (deleteTarget.type === 'entry' && deleteTarget.entryIndex !== undefined) {
      // Delete entry from section
      const updatedSections = [...sections];
      const section = updatedSections[deleteTarget.sectionIndex];

      if (Array.isArray(section.content)) {
        const updatedContent = section.content.filter((_, i) => i !== deleteTarget.entryIndex);
        updatedSections[deleteTarget.sectionIndex] = {
          ...section,
          content: updatedContent,
        };
        setSections(updatedSections);
        toast.success(`Entry deleted from "${section.name}"`);
      }
    }

    // Reset state
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const handleScrollToSection = (index: number) => {
    setActiveSectionIndex(index);

    // Scroll to contact info (-1) or section (0+)
    const targetRef = index === -1 ? contactInfoRef.current : sectionRefs.current[index];

    if (targetRef) {
      const yOffset = -100; // Offset for fixed headers
      const y = targetRef.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Get viewport middle point
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check contact info first
      if (contactInfoRef.current) {
        const rect = contactInfoRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (scrollPosition >= top && scrollPosition < top + rect.height) {
          setActiveSectionIndex(-1);
          return;
        }
      }

      // Check each section
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const ref = sectionRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollPosition >= top && scrollPosition < top + rect.height) {
            setActiveSectionIndex(i);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    const sectionIndex = parseInt(active.id as string);
    setDraggedSection(sections[sectionIndex]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id as string);
      const newIndex = parseInt(over?.id as string);

      if (oldIndex !== undefined && newIndex !== undefined) {
        setSections((sections) => {
          return arrayMove(sections, oldIndex, newIndex);
        });

        // Toast notification for successful reorder
        toast.success("Section reordered successfully!");
      }
    }

    setActiveId(null);
    setDraggedSection(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedSection(null);
  };

  const handleAddSection = (type: string) => {
    // Check for duplicates - generate a unique name if needed
    const getUniqueDefaultName = (baseType: string) => {
      const typeNameMap: { [key: string]: string } = {
        experience: "New Experience Section",
        education: "New Education Section",
        text: "New Text Section",
        "bulleted-list": "New Bulleted List Section",
        "inline-list": "New Inline List Section",
        "dynamic-column-list": "New Dynamic Column List Section",
        "icon-list": "New Icon List Section",
      };

      const baseName = typeNameMap[baseType] || "New Section";
      const existingNames = sections.map((s) => s.name.toLowerCase());

      // If base name doesn't exist, use it
      if (!existingNames.includes(baseName.toLowerCase())) {
        return baseName;
      }

      // Otherwise, append a number
      let counter = 2;
      let uniqueName = `${baseName} ${counter}`;
      while (existingNames.includes(uniqueName.toLowerCase())) {
        counter++;
        uniqueName = `${baseName} ${counter}`;
      }
      return uniqueName;
    };

    const defaultName = getUniqueDefaultName(type);

    let defaultContent;
    if (type === "experience") {
      // Default content for Experience sections
      defaultContent = [
        {
          company: "",
          title: "",
          dates: "",
          description: [""],
          icon: null,
        },
      ];
    } else if (type === "education") {
      // Default content for Education sections
      defaultContent = [
        {
          degree: "",
          school: "",
          year: "",
          field_of_study: "",
          icon: null,
        },
      ];
    } else if (
      [
        "bulleted-list",
        "inline-list",
        "dynamic-column-list",
        "icon-list",
      ].includes(type)
    ) {
      defaultContent = [];
    } else {
      defaultContent = "";
    }

    const newSection: Section = {
      name: defaultName,
      type: type,
      content: defaultContent,
    };

    setSections((prevSections) => [...prevSections, newSection]);
    setShowModal(false);
    setTimeout(() => {
      newSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExportYAML = async () => {
    // Save first to ensure export has latest changes
    const canProceed = await saveBeforeAction('export YAML');
    if (!canProceed) return;

    try {
      setLoadingSave(true);
      // Longer delay for noticeable feedback on file operations
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const processedSections = processSections(sections);

      // Extract all referenced icon filenames from the sections
      const referencedIcons = extractReferencedIconFilenames(processedSections);

      // Get icon data for only the referenced icons (efficient export)
      const iconData =
        referencedIcons.length > 0
          ? await iconRegistry.exportIconsForYAML(referencedIcons)
          : {};

      // Create portable YAML with embedded icons
      const portableData: PortableYAMLData = {
        contact_info: contactInfo,
        sections: processedSections,
      };

      // Only include __icons__ section if there are icons to embed
      if (Object.keys(iconData).length > 0) {
        portableData.__icons__ = iconData;
      }

      const yamlData = yaml.dump(portableData);

      const blob = new Blob([yamlData], { type: "application/x-yaml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.yaml";
      link.click();

      // Show success message with icon count if applicable
      const iconCount = Object.keys(iconData).length;
      const message =
        iconCount > 0
          ? `Resume saved successfully with ${iconCount} embedded icon${
              iconCount === 1 ? "" : "s"
            }!`
          : "Resume saved successfully!";
      toast.success(message);
    } catch (error) {
      console.error("Error exporting YAML:", error);
      toast.error("Save failed. Check browser settings and try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleImportYAML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Store file and show confirmation dialog
    setPendingImportFile(file);
    setShowImportConfirm(true);

    // Reset file input so the same file can be selected again
    event.target.value = '';
  };

  const confirmImportYAML = async () => {
    if (!pendingImportFile) return;

    setShowImportConfirm(false);

    // Save current work before importing (if authenticated and has content)
    // Auto-save will handle preserving the current resume
    if (!isAnonymous && contactInfo && sections.length > 0) {
      const canProceed = await saveBeforeAction('import YAML');
      if (!canProceed) {
        setPendingImportFile(null);
        return;
      }
    }

    setLoadingLoad(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Longer delay for noticeable feedback on file operations
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const parsedYaml = yaml.load(
          e.target?.result as string
        ) as PortableYAMLData;

        setContactInfo(parsedYaml.contact_info);

        // Import icons first if they exist in the YAML
        if (
          parsedYaml.__icons__ &&
          Object.keys(parsedYaml.__icons__).length > 0
        ) {
          await iconRegistry.importIconsFromYAML(parsedYaml.__icons__);
        }

        // Migrate legacy sections (auto-add type property for backwards compatibility)
        const migratedSections = migrateLegacySections(parsedYaml.sections);
        // Process sections to clean up icon paths when importing YAML
        const processedSections = processSections(migratedSections);

        // Validate imported icons against template compatibility
        if (!supportsIcons) {
          const referencedIcons = extractReferencedIconFilenames(processedSections);
          if (referencedIcons.length > 0) {
            toast.warning(
              `This template doesn't support icons. ${referencedIcons.length} icon(s) ` +
              `were found in the imported file and will be ignored.`,
              { autoClose: 8000 }
            );
          }
        }

        setSections(processedSections);

        // CRITICAL FIX: Update originalTemplateData to reflect the imported YAML
        // This ensures hasDataChanged() returns false for the imported baseline
        setOriginalTemplateData({
          contactInfo: parsedYaml.contact_info,
          sections: processedSections,
        });

        // Enable auto-save after YAML import completes
        setIsLoadingFromUrl(false);

        toast.success("Resume loaded successfully!");
      } catch (error) {
        console.error("Error parsing YAML file:", error);
        toast.error("Invalid file format. Please upload a valid resume file.");
      } finally {
        setLoadingLoad(false);
        setPendingImportFile(null);
      }
    };
    reader.readAsText(pendingImportFile);
  };

  const handleGenerateResume = async () => {
    try {
      // Save first to ensure PDF has latest changes
      const canProceed = await saveBeforeAction('download PDF');
      if (!canProceed) return;

      // Validate LinkedIn URL only if provided (block invalid, allow empty)
      if (contactInfo?.linkedin && !validateLinkedInUrl(contactInfo.linkedin)) {
        toast.error("Please enter a valid LinkedIn URL or leave it empty");
        return;
      }

      // Validate icon availability for icon-supporting templates
      if (supportsIcons) {
        const { valid, missingIcons } = validateIconAvailability();
        if (!valid) {
          showMissingIconsDialog(missingIcons, isLoadingFromUrl);
          return;
        }
      }

      setGenerating(true);
      const processedSections = processSections(sections);

      const yamlData = yaml.dump({
        contact_info: contactInfo,
        sections: processedSections,
      });

      const formData = new FormData();
      const yamlBlob = new Blob([yamlData], { type: "application/x-yaml" });
      formData.append("yaml_file", yamlBlob, "resume.yaml");
      formData.append("template", templateId || "modern-no-icons");

      // Add session ID for session-based icon isolation
      const sessionId = getSessionId();
      formData.append("session_id", sessionId);

      // Only add icons if template supports them (validation already confirmed all icons exist)
      if (supportsIcons) {
        const referencedIcons = extractReferencedIconFilenames(sections);
        for (const iconFilename of referencedIcons) {
          const iconFile = iconRegistry.getIconFile(iconFilename);
          if (iconFile) {
            formData.append("icons", iconFile, iconFilename);
          }
          // No need for else - validation already caught missing icons
        }
      }

      const { pdfBlob, fileName } = await generateResume(formData);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName; // Use dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Resume downloaded successfully!");

      // Show celebration modal for anonymous users (first time only)
      if (isAnonymous && !hasShownDownloadToast) {
        markDownloadToastShown();

        setTimeout(() => {
          setShowDownloadCelebration(true);
        }, 500);
      } else if (!isAnonymous) {
        // Original message for authenticated users
        setTimeout(() => {
          toast.info(
            "Need to continue on another device? Save your work via the ⋮ menu"
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Resume generation failed: ${errorMessage}`);
    } finally {
      setGenerating(false);
    }
  };

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  // Preview handlers
  const handleOpenPreview = async () => {
    // Save first to ensure database has latest changes
    const canProceed = await saveBeforeAction('preview');
    if (!canProceed) return;

    // Validate icon availability for icon-supporting templates
    if (supportsIcons) {
      const { valid, missingIcons } = validateIconAvailability();
      if (!valid) {
        showMissingIconsDialog(missingIcons, isLoadingFromUrl);
        return;
      }
    }

    // If no preview exists or it's stale, generate it first
    if (!previewUrl || previewIsStale) {
      await generatePreview();
    }
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
  };

  const handleRefreshPreview = async () => {
    // Save first to ensure database has latest changes
    const canProceed = await saveBeforeAction('refresh preview');
    if (!canProceed) return;

    // Validate icon availability for icon-supporting templates
    if (supportsIcons) {
      const { valid, missingIcons } = validateIconAvailability();
      if (!valid) {
        showMissingIconsDialog(missingIcons, isLoadingFromUrl);
        return;
      }
    }

    await generatePreview();
  };

  const handleAddNewSectionClick = async () => {
    setLoadingAddSection(true);

    // Brief delay for subtle visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    setShowModal(true);
    setLoadingAddSection(false);
  };

  // Validate LinkedIn URL (without storing error state - just return boolean)
  const validateLinkedInUrl = (url: string): boolean => {
    if (!url.trim()) {
      return true; // Empty is valid (optional field)
    }

    const urlLower = url.toLowerCase().trim();

    // Optimized LinkedIn URL regex that handles:
    // - Any subdomain (country codes, www, mobile, etc.)
    // - Personal profiles (/in/, /pub/, /public-profile/in/, /public-profile/pub/)
    // - Username length validation (3-100 characters)
    // - Optional trailing slash
    const linkedinProfilePattern = /^(https?:\/\/)?([\w\d]+\.)?linkedin\.com\/(?:public-profile\/)?(in|pub)\/[\w-]{3,100}\/?$/;

    return linkedinProfilePattern.test(urlLower);
  };

  // Social Links Handlers
  const handleAddSocialLink = () => {
    setContactInfo(prevContactInfo => {
      if (!prevContactInfo) return null;

      const currentLinks = prevContactInfo.social_links || [];
      return {
        ...prevContactInfo,
        social_links: [
          ...currentLinks,
          { platform: "", url: "", display_text: "" }
        ]
      };
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    setContactInfo(prevContactInfo => {
      if (!prevContactInfo) return null;

      const currentLinks = prevContactInfo.social_links || [];
      const updatedLinks = currentLinks.filter((_, i) => i !== index);

      return {
        ...prevContactInfo,
        social_links: updatedLinks
      };
    });

    // Clear error for this index
    setSocialLinkErrors(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });

    // Remove from auto-generated indexes
    setAutoGeneratedIndexes(prev => {
      const updated = new Set(prev);
      updated.delete(index);
      return updated;
    });

    // Clear any pending debounce for this index
    if (socialLinkDebounceRefs.current[index]) {
      clearTimeout(socialLinkDebounceRefs.current[index]);
      delete socialLinkDebounceRefs.current[index];
    }
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    setContactInfo(prevContactInfo => {
      if (!prevContactInfo) return null;

      const currentLinks = prevContactInfo.social_links || [];
      const updatedLinks = [...currentLinks];

      if (!updatedLinks[index]) {
        updatedLinks[index] = { platform: "", url: "", display_text: "" };
      }

      updatedLinks[index] = {
        ...updatedLinks[index],
        [field]: value
      };

      return {
        ...prevContactInfo,
        social_links: updatedLinks
      };
    });

    // Handle validation and auto-generation based on field
    if (field === "url") {
      const link = contactInfo?.social_links?.[index];
      const platform = link?.platform || "";

      if (!value.trim()) {
        // Clear error if URL is empty
        setSocialLinkErrors(prev => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });

        // Clear display text if URL is empty
        setContactInfo(prevContactInfo => {
          if (!prevContactInfo) return null;
          const currentLinks = prevContactInfo.social_links || [];
          const updatedLinks = [...currentLinks];
          if (updatedLinks[index]) {
            updatedLinks[index] = { ...updatedLinks[index], display_text: "" };
          }
          return { ...prevContactInfo, social_links: updatedLinks };
        });

        setAutoGeneratedIndexes(prev => {
          const updated = new Set(prev);
          updated.delete(index);
          return updated;
        });
        return;
      }

      // Validate URL for the platform
      if (platform) {
        const validation = validatePlatformUrl(platform, value);

        if (!validation.valid && validation.error) {
          setSocialLinkErrors(prev => ({
            ...prev,
            [index]: validation.error || ""
          }));
        } else {
          setSocialLinkErrors(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
          });

          // Auto-generate display text if URL is valid
          debouncedGenerateSocialDisplayText(index, platform, value);
        }
      }
    } else if (field === "platform") {
      // Re-validate URL when platform changes
      const link = contactInfo?.social_links?.[index];
      const url = link?.url || "";

      if (url && value) {
        const validation = validatePlatformUrl(value, url);

        if (!validation.valid && validation.error) {
          setSocialLinkErrors(prev => ({
            ...prev,
            [index]: validation.error || ""
          }));
        } else {
          setSocialLinkErrors(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
          });

          // Auto-generate display text for new platform
          debouncedGenerateSocialDisplayText(index, value, url);
        }
      }
    } else if (field === "display_text") {
      // User is manually editing, remove auto-generated flag
      setAutoGeneratedIndexes(prev => {
        const updated = new Set(prev);
        updated.delete(index);
        return updated;
      });
    }
  };

  const debouncedGenerateSocialDisplayText = (index: number, platform: string, url: string) => {
    // Clear existing timeout for this index
    if (socialLinkDebounceRefs.current[index]) {
      clearTimeout(socialLinkDebounceRefs.current[index]);
    }

    // Set new timeout for 500ms debounce
    socialLinkDebounceRefs.current[index] = setTimeout(() => {
      const displayText = generateDisplayText(platform, url, contactInfo?.name);

      setContactInfo(prevContactInfo => {
        if (!prevContactInfo) return null;

        const currentLinks = prevContactInfo.social_links || [];
        const updatedLinks = [...currentLinks];

        if (updatedLinks[index]) {
          updatedLinks[index] = {
            ...updatedLinks[index],
            display_text: displayText
          };
        }

        return {
          ...prevContactInfo,
          social_links: updatedLinks
        };
      });

      // Mark this index as auto-generated
      setAutoGeneratedIndexes(prev => new Set(prev).add(index));
    }, 500);
  };

  /**
   * Validates that all referenced icons are uploaded to the registry or available as default icons.
   * Returns { valid: boolean, missingIcons: string[] }
   */
  const validateIconAvailability = useCallback((): {
    valid: boolean;
    missingIcons: string[];
  } => {
    // Skip validation if template doesn't support icons
    if (!supportsIcons) {
      return { valid: true, missingIcons: [] };
    }

    const referencedIcons = extractReferencedIconFilenames(sections);
    const missingIcons: string[] = [];

    for (const iconFilename of referencedIcons) {
      // Check 1: User-uploaded icons in registry
      const iconFile = iconRegistry.getIconFile(iconFilename);
      if (iconFile) {
        continue; // Found in registry
      }

      // Check 2: Default/system icons (served from /icons/ directory)
      if (DEFAULT_ICONS.has(iconFilename)) {
        continue; // Found as default icon
      }

      // Icon not found in either location
      missingIcons.push(iconFilename);
    }

    return {
      valid: missingIcons.length === 0,
      missingIcons
    };
  }, [sections, iconRegistry, supportsIcons]);

  /**
   * Shows detailed information about missing icons to help user locate them
   */
  const showMissingIconsDialog = useCallback((missingIcons: string[], isFromCloudLoad: boolean = false) => {
    if (isFromCloudLoad) {
      // Special message for cloud load failures
      toast.error(
        `⚠️ Unable to load ${missingIcons.length} icon(s) from cloud storage\n\n` +
        `This can happen if:\n` +
        `• Icons failed to upload when resume was last saved\n` +
        `• Temporary storage connectivity issue\n\n` +
        `To fix:\n` +
        `1. Re-upload the missing icons using the icon picker\n` +
        `2. Save your resume\n` +
        `3. Icons will then be available on next edit\n\n` +
        `Missing icons:\n${missingIcons.map(icon => `• ${icon}`).join('\n')}`,
        {
          autoClose: 15000,
          style: { whiteSpace: 'pre-line', maxWidth: '600px' }
        }
      );
    } else {
      // Original detailed error for regular missing icons
      const iconLocations = missingIcons.map(icon => {
        // Find where this icon is referenced
        const locations: string[] = [];

        sections.forEach((section) => {
          if (isExperienceSection(section) || isEducationSection(section)) {
            const items = section.content as any[];
            items.forEach((item, itemIdx) => {
              if (item.icon === icon) {
                locations.push(`${section.name} → Entry ${itemIdx + 1}`);
              }
            });
          } else if (section.type === 'icon-list') {
            const items = section.content as any[];
            items.forEach((item, itemIdx) => {
              if (item.icon === icon) {
                locations.push(`${section.name} → Item ${itemIdx + 1}`);
              }
            });
          }
        });

        return `• ${icon}${locations.length > 0 ? ' (used in: ' + locations.join(', ') + ')' : ''}`;
      }).join('\n');

      toast.error(
        `Missing Icons (${missingIcons.length}):\n${iconLocations}\n\nPlease upload these icons or remove them from your sections.`,
        { autoClose: 12000, style: { whiteSpace: 'pre-line' } }
      );
    }
  }, [sections]);

  const handleLoadEmptyTemplate = () => {
    // Show confirmation dialog before clearing
    setShowStartFreshConfirm(true);
  };

  const confirmStartFresh = async () => {
    if (!originalTemplateData) return;

    // Save current work before clearing (if authenticated and has content)
    if (!isAnonymous && contactInfo && sections.length > 0) {
      const canProceed = await saveBeforeAction('start fresh');
      if (!canProceed) {
        setShowStartFreshConfirm(false);
        return;
      }
    }

    setShowStartFreshConfirm(false);
    setLoadingSave(true);
    try {
      // Reset contact info
      setContactInfo({
        name: "",
        location: "",
        email: "",
        phone: "",
        linkedin: "",
        linkedin_display: "",
      });

      // Reset sections by preserving structure but emptying content
      const emptySections = originalTemplateData.sections.map((section) => ({
        ...section,
        content: Array.isArray(section.content) ? [] : "",
      }));

      setSections(emptySections);
      iconRegistry.clearRegistry();

      toast.success("Template cleared successfully!");
    } catch (error) {
      console.error("Error clearing template:", error);
      toast.error("Failed to clear template");
    } finally {
      setLoadingSave(false);
    }
  };

  // Close advanced menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAdvancedMenu) {
        const target = event.target as Element;
        if (!target.closest(".advanced-menu-container")) {
          setShowAdvancedMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAdvancedMenu]);

  // Keyboard shortcuts for preview (Ctrl+Shift+P / Cmd+Shift+P)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+P or Cmd+Shift+P to open preview
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        handleOpenPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenPreview]);

  // Simple scroll detection for footer visibility
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if at bottom (with threshold accounting for footer height)
    const atBottom = windowHeight + currentScrollY >= documentHeight - 150;

    // Update context with bottom state for footer visibility
    setContextIsAtBottom(atBottom);

    lastScrollY.current = currentScrollY;
  }, [setContextIsAtBottom]);

  useEffect(() => {
    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [handleScroll]);

  // Warn user if closing browser/tab with unsaved changes
  useEffect(() => {
    if (isAnonymous || !contactInfo || !templateId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if save is pending or failed
      if (saveStatus === 'saving' || saveStatus === 'error') {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // For older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAnonymous, contactInfo, templateId, saveStatus]);

  // Update save function ref with current values (fixes stale closure bug)
  useEffect(() => {
    saveOnUnmountRef.current = async () => {
      if (!isAnonymous && contactInfo && templateId && saveStatus !== 'saving') {
        try {
          await saveNow();
          console.log('Saved on unmount');

          // Trigger thumbnail generation after save completes
          // Use savedResumeId if available, otherwise cloudResumeId
          const resumeId = savedResumeId || cloudResumeId;
          if (resumeId) {
            console.log('Triggering thumbnail generation for resume:', resumeId);
            generateThumbnail(resumeId); // Fire-and-forget
          }
        } catch (error) {
          console.error('Failed to save on unmount:', error);
        }
      }
    };
  }, [isAnonymous, contactInfo, templateId, saveStatus, saveNow, savedResumeId, cloudResumeId]);

  // Save on component unmount (navigating within app)
  useEffect(() => {
    return () => {
      // Fire-and-forget save using ref to avoid stale closure
      if (saveOnUnmountRef.current) {
        saveOnUnmountRef.current();
      }
    };
  }, []); // Empty deps is safe here since we're using ref

  // Show loading state first (handles initial load and resume loading from URL)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            Loading your resume builder...
          </p>
        </div>
      </div>
    );
  }

  // Show error page if template loading failed
  if (loadingError) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorPage />
      </Suspense>
    );
  }

  // Only show 404 if no templateId AND we're not loading from a URL resumeId
  if (!templateId && !resumeIdFromUrl) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content Container - Dynamic padding based on sidebar state */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-72 sm:pb-56 lg:pb-12 max-w-4xl lg:max-w-none transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:mr-[88px]' : 'lg:mr-[296px]'
      }`}>
        {/* Contact Information Section */}
        {contactInfo && (
          <div ref={contactInfoRef}>
            <ContactInfoSection
              contactInfo={contactInfo}
              onUpdate={setContactInfo}
              socialLinkErrors={socialLinkErrors}
              onSocialLinkChange={handleSocialLinkChange}
              onAddSocialLink={handleAddSocialLink}
              onRemoveSocialLink={handleRemoveSocialLink}
              autoGeneratedIndexes={autoGeneratedIndexes}
            />
          </div>
        )}

        {/* Global Formatting Help - Replaces repeated tips */}
        <FormattingHelp />

        {/* Resume Sections with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={sections.map((_, index) => index.toString())}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section, index) => {
              if (isExperienceSection(section)) {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          (newSectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                        }
                      }}
                    >
                      <ExperienceSection
                        sectionName={section.name}
                        experiences={section.content}
                        onUpdate={(updatedExperiences) =>
                          handleUpdateSection(index, {
                            ...section,
                            content: updatedExperiences,
                          })
                        }
                        onTitleEdit={() => handleTitleEdit(index)}
                        onTitleSave={handleTitleSave}
                        onTitleCancel={handleTitleCancel}
                        onDelete={() => handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => handleDeleteEntry(index, entryIndex)}
                        isEditingTitle={editingTitleIndex === index}
                        temporaryTitle={temporaryTitle}
                        setTemporaryTitle={setTemporaryTitle}
                        supportsIcons={supportsIcons}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else if (isEducationSection(section)) {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          (newSectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                        }
                      }}
                    >
                      <EducationSection
                        sectionName={section.name}
                        education={section.content}
                        onUpdate={(updatedEducation) =>
                          handleUpdateSection(index, {
                            ...section,
                            content: updatedEducation,
                          })
                        }
                        onTitleEdit={() => handleTitleEdit(index)}
                        onTitleSave={handleTitleSave}
                        onTitleCancel={handleTitleCancel}
                        onDelete={() => handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => handleDeleteEntry(index, entryIndex)}
                        isEditingTitle={editingTitleIndex === index}
                        temporaryTitle={temporaryTitle}
                        setTemporaryTitle={setTemporaryTitle}
                        supportsIcons={supportsIcons}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else if (section.type === "icon-list") {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          (newSectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                        }
                      }}
                    >
                      <IconListSection
                        data={section.content}
                        onUpdate={(updatedContent) =>
                          handleUpdateSection(index, {
                            ...section,
                            content: updatedContent,
                          })
                        }
                        onDelete={() => handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => handleDeleteEntry(index, entryIndex)}
                        sectionName={section.name}
                        onEditTitle={() => handleTitleEdit(index)}
                        onSaveTitle={handleTitleSave}
                        onCancelTitle={handleTitleCancel}
                        isEditing={editingTitleIndex === index}
                        temporaryTitle={temporaryTitle}
                        setTemporaryTitle={setTemporaryTitle}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={(el) => {
                        sectionRefs.current[index] = el;
                        if (index === sections.length - 1) {
                          (newSectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                        }
                      }}
                    >
                      <GenericSection
                        section={section}
                        onUpdate={(updatedSection) =>
                          handleUpdateSection(index, updatedSection)
                        }
                        onEditTitle={() => handleTitleEdit(index)}
                        onSaveTitle={handleTitleSave}
                        onCancelTitle={handleTitleCancel}
                        onDelete={() => handleDeleteSection(index)}
                        onDeleteEntry={(entryIndex) => handleDeleteEntry(index, entryIndex)}
                        isEditing={editingTitleIndex === index}
                        temporaryTitle={temporaryTitle}
                        setTemporaryTitle={setTemporaryTitle}
                      />
                    </div>
                  </DragHandle>
                );
              }
            })}
          </SortableContext>

          <DragOverlay modifiers={[restrictToVerticalAxis]}>
            {activeId && draggedSection ? (
              <div className="drag-overlay">
                {draggedSection.name === "Experience" ? (
                  <ExperienceSection
                    sectionName={draggedSection.name}
                    experiences={draggedSection.content}
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
                ) : draggedSection.name === "Education" ? (
                  <EducationSection
                    sectionName={draggedSection.name}
                    education={draggedSection.content}
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
                ) : draggedSection.type === "icon-list" ? (
                  <IconListSection
                    data={draggedSection.content}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    sectionName={draggedSection.name}
                    onEditTitle={() => {}}
                    onSaveTitle={() => {}}
                    onCancelTitle={() => {}}
                    isEditing={false}
                    temporaryTitle={""}
                    setTemporaryTitle={() => {}}
                    iconRegistry={iconRegistry}
                  />
                ) : (
                  <GenericSection
                    section={draggedSection}
                    onUpdate={() => {}}
                    onEditTitle={() => {}}
                    onSaveTitle={() => {}}
                    onCancelTitle={() => {}}
                    onDelete={() => {}}
                    isEditing={false}
                    temporaryTitle={""}
                    setTemporaryTitle={() => {}}
                  />
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Elegant Separator - Between content and toolbar (mobile/tablet only) */}
        {contextIsAtBottom && (
          <div className="fixed left-0 right-0 z-50 transition-all duration-300 bottom-80 sm:bottom-64 lg:bottom-48 px-4 lg:hidden">
            <div className="max-w-screen-lg mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-white/30 h-0.5 w-full"></div>
            </div>
          </div>
        )}

        {/* Desktop Toolbar - Now hidden on desktop (actions moved to sidebar), shown on tablet only */}
        <div
          className={`hidden md:flex lg:hidden fixed z-[60] bg-gradient-to-r from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg transition-all duration-300
            left-auto right-6 border border-gray-200/60 rounded-2xl w-auto max-w-none ${
              contextIsAtBottom ? "bottom-24" : "bottom-6"
            }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4 p-4 lg:p-6 max-w-screen-lg mx-auto lg:max-w-none">
            <EditorToolbar
              onAddSection={handleAddNewSectionClick}
              onGenerateResume={handleGenerateResume}
              onExportYAML={handleExportYAML}
              onImportYAML={handleImportYAML}
              onToggleHelp={toggleHelpModal}
              onLoadEmptyTemplate={handleLoadEmptyTemplate}
              loadingAddSection={loadingAddSection}
              generating={generating}
              loadingSave={loadingSave}
              loadingLoad={loadingLoad}
              showAdvancedMenu={showAdvancedMenu}
              setShowAdvancedMenu={setShowAdvancedMenu}
              mode="integrated"
            />
          </div>
        </div>

        {/* Mobile Action Bar - Only shown on mobile/tablet */}
        <MobileActionBar
          onNavigationClick={() => setShowNavigationDrawer(true)}
          onPreviewClick={handleOpenPreview}
          onDownloadClick={handleGenerateResume}
          isSaving={saveStatus === 'saving'}
          isGenerating={generating}
          isGeneratingPreview={isGeneratingPreview}
          previewIsStale={previewIsStale}
          lastSaved={cloudLastSaved}
          saveError={saveStatus === 'error' ? 'Save failed' : null}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNavigationDrawer
          isOpen={showNavigationDrawer}
          onClose={() => setShowNavigationDrawer(false)}
          sections={sections}
          onSectionClick={handleScrollToSection}
          activeSectionIndex={activeSectionIndex}
          onAddSection={handleAddNewSectionClick}
          onExportYAML={handleExportYAML}
          onImportYAML={() => fileInputRef.current?.click()}
          onStartFresh={handleLoadEmptyTemplate}
          onHelp={toggleHelpModal}
          loadingSave={loadingSave}
          loadingLoad={loadingLoad}
        />

        {/* Desktop Section Navigator Sidebar */}
        <SectionNavigator
          sections={sections}
          onSectionClick={handleScrollToSection}
          activeSectionIndex={activeSectionIndex}
          onAddSection={handleAddNewSectionClick}
          onDownloadResume={handleGenerateResume}
          onPreviewResume={handleOpenPreview}
          onExportYAML={handleExportYAML}
          onImportYAML={() => fileInputRef.current?.click()}
          onStartFresh={handleLoadEmptyTemplate}
          onHelp={toggleHelpModal}
          isGenerating={generating}
          isGeneratingPreview={isGeneratingPreview}
          previewIsStale={previewIsStale}
          loadingSave={loadingSave}
          loadingLoad={loadingLoad}
          onCollapseChange={setIsSidebarCollapsed}
          saveStatus={saveStatus}
          lastSaved={cloudLastSaved}
          isAnonymous={isAnonymous}
          isAuthenticated={isAuthenticated}
          onSignInClick={() => setShowAuthModal(true)}
        />

        {/* Hidden file input for both mobile and desktop */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".yaml,.yml"
          className="hidden"
          onChange={handleImportYAML}
        />

        {/* Elegant Separator - Between toolbar and footer (mobile/tablet only) */}
        {contextIsAtBottom && (
          <div className="fixed left-0 right-0 z-50 transition-all duration-300 bottom-64 sm:bottom-48 lg:bottom-20 px-4 lg:hidden">
            <div className="max-w-screen-lg mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-white/30 h-0.5 w-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Context-Aware Tour - New 5-Step Tour with Auth Branching */}
      <ContextAwareTour
        isOpen={showWelcomeTour}
        onClose={handleTourComplete}
        isAnonymous={isAnonymous}
        isAuthenticated={isAuthenticated}
        onSignInClick={() => setShowAuthModalFromTour(true)}
        onTourComplete={handleTourComplete}
      />

      {/* Auth Modal triggered from tour */}
      <AuthModal
        isOpen={showAuthModalFromTour}
        onClose={() => setShowAuthModalFromTour(false)}
        onSuccess={() => {
          setShowAuthModalFromTour(false);
          toast.success('Welcome! Your resume will now be saved to the cloud.');
        }}
      />

      {/* Auth Modal triggered from download and other actions */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          toast.success('Welcome! Your resume will now be saved to the cloud.');
        }}
      />

      {/* Download Celebration Modal - shown after first download for anonymous users */}
      <DownloadCelebrationModal
        isOpen={showDownloadCelebration}
        onClose={() => setShowDownloadCelebration(false)}
        onSignUp={() => {
          setShowDownloadCelebration(false);
          setShowAuthModal(true);
        }}
      />

      {/* Tabbed Help Modal - Replaces old help modal */}
      <TabbedHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        isAnonymous={isAnonymous}
        onSignInClick={() => {
          setShowHelpModal(false);
          setShowAuthModal(true);
        }}
      />

      {showModal && (
        <SectionTypeModal
          onClose={() => setShowModal(false)}
          onSelect={handleAddSection}
          supportsIcons={supportsIcons}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'section' ? "Delete Section?" : "Delete Entry?"}
        message={
          deleteTarget?.type === 'section'
            ? `Are you sure you want to delete the "${deleteTarget.sectionName}" section? This will remove all content in this section and cannot be undone.`
            : "Are you sure you want to delete this entry? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Start Fresh Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={showStartFreshConfirm}
        onClose={() => setShowStartFreshConfirm(false)}
        onConfirm={confirmStartFresh}
        title="Start Fresh?"
        message="Starting fresh will permanently delete all your current work. This action cannot be undone. Are you sure you want to continue?"
        confirmText="Start Fresh"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={loadingSave}
      />

      {/* Import YAML Confirmation Dialog */}
      <ResponsiveConfirmDialog
        isOpen={showImportConfirm}
        onClose={() => {
          setShowImportConfirm(false);
          setPendingImportFile(null);
        }}
        onConfirm={confirmImportYAML}
        title="Confirm Import?"
        message="Importing this will override your existing content."
        confirmText="Confirm Import"
        cancelText="Cancel Import"
        isDestructive={true}
        isLoading={loadingLoad}
      />

      {/* PDF Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        previewUrl={previewUrl}
        isGenerating={isGeneratingPreview}
        isStale={previewIsStale}
        error={previewError}
        onRefresh={handleRefreshPreview}
        onDownload={handleGenerateResume}
      />

      {/* Storage Limit Modal - shown when user hits 5-resume limit */}
      <StorageLimitModal
        isOpen={showStorageLimitModal}
        onClose={() => setShowStorageLimitModal(false)}
      />

      {/* Idle Nudge Tooltip - Portal to body, positioned near sign-in button */}
      {showIdleTooltip && ReactDOM.createPortal(
        <div className="fixed top-20 right-6 z-[70] bg-blue-600 text-white text-sm px-4 py-3 rounded-lg shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Don't forget to save your progress permanently</span>
            <button
              onClick={() => setShowIdleTooltip(false)}
              className="ml-2 hover:opacity-75 text-white"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Editor;
