import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { fetchTemplate, generateResume } from "../services/templates";
import { getSessionId } from "../utils/session";
import { useIconRegistry } from "../hooks/useIconRegistry";
import { useAutoSave } from "../hooks/useAutoSave";
import { usePreview } from "../hooks/usePreview";
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get("template");

  // Get context for footer integration
  const {
    isAtBottom: contextIsAtBottom,
    setIsAtBottom: setContextIsAtBottom,
    setIsSidebarCollapsed: setContextIsSidebarCollapsed,
  } = useEditorContext();

  // TODO: useResponsive() will be added when implementing navigation drawer

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [supportsIcons, setSupportsIcons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [originalTemplateData, setOriginalTemplateData] = useState<{
    contactInfo: ContactInfo;
    sections: Section[];
  } | null>(null);

  // Central icon registry for all uploaded icons
  const iconRegistry = useIconRegistry();

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

  // Auto-save hook - handles localStorage persistence
  const {
    saving: isSaving,
    lastSaved,
    error: saveError,
    saveManually: _saveManually, // Available for future use (auto-save is primary)
    clearSave: clearAutoSave,
    loadSaved: _loadSaved, // Available for future use
    recoveredData: autoSaveRecoveredData,
  } = useAutoSave({
    contactInfo,
    sections,
    originalTemplateData,
    templateId,
    iconRegistry,
  });

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
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [hasHandledRecovery, setHasHandledRecovery] = useState(false);
  const [loadingRecover, setLoadingRecover] = useState(false);

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

  // Navigation drawer state
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(-1); // -1 for contact info
  const [isSidebarCollapsed, setIsSidebarCollapsedLocal] = useState(false);

  // Sync sidebar state with context for footer awareness
  const setIsSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsedLocal(collapsed);
    setContextIsSidebarCollapsed(collapsed);
  };

  const [loadingStartFresh, setLoadingStartFresh] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [loadingAddSection, setLoadingAddSection] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);

  // LinkedIn display text state management (deprecated - keeping for backward compatibility)
  const [lastLinkedInSuggestion, setLastLinkedInSuggestion] = useState("");
  const [isLinkedInTextAutoGenerated, setIsLinkedInTextAutoGenerated] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Social links state management
  const [socialLinkErrors, setSocialLinkErrors] = useState<Record<number, string>>({});
  const [autoGeneratedIndexes, setAutoGeneratedIndexes] = useState<Set<number>>(new Set());
  const socialLinkDebounceRefs = useRef<Record<number, NodeJS.Timeout>>({});

  // Simple scroll detection for footer visibility
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    if (!templateId) {
      console.error("Template ID is undefined.");
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
  }, [templateId]);

  // Show recovery modal when auto-saved data is detected (only once)
  useEffect(() => {
    if (autoSaveRecoveredData && originalTemplateData && !hasHandledRecovery) {
      setShowRecoveryModal(true);
    }
  }, [autoSaveRecoveredData, originalTemplateData, hasHandledRecovery]);

  // Check if user should see welcome tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("resume-builder-tour-seen");
    if (!hasSeenTour) {
      // Show tour after a brief delay to let page load
      const timer = setTimeout(() => {
        setShowWelcomeTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const handleImportYAML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        setSections(processedSections);

        toast.success("Resume loaded successfully!");
      } catch (error) {
        console.error("Error parsing YAML file:", error);
        toast.error("Invalid file format. Please upload a valid resume file.");
      } finally {
        setLoadingLoad(false);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateResume = async () => {
    try {
      // Validate LinkedIn URL only if provided (block invalid, allow empty)
      if (contactInfo?.linkedin && !validateLinkedInUrl(contactInfo.linkedin)) {
        toast.error("Please enter a valid LinkedIn URL or leave it empty");
        return;
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

      // Use centralized IconRegistry to get icon files for PDF generation
      const referencedIcons = extractReferencedIconFilenames(sections);
      for (const iconFilename of referencedIcons) {
        const iconFile = iconRegistry.getIconFile(iconFilename);
        if (iconFile) {
          formData.append("icons", iconFile, iconFilename);
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

      setTimeout(() => {
        toast.info(
          "Need to continue on another device? Save your work via the ⋮ menu"
        );
      }, 2000);
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
    await generatePreview();
  };

  const handleAddNewSectionClick = async () => {
    setLoadingAddSection(true);

    // Brief delay for subtle visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    setShowModal(true);
    setLoadingAddSection(false);
  };

  const handleTourComplete = (dontShowAgain: boolean = false) => {
    setShowWelcomeTour(false);
    if (dontShowAgain) {
      localStorage.setItem("resume-builder-tour-seen", "true");
    }
  };

  // Debounced LinkedIn display text generation
  const generateLinkedInDisplayText = useCallback(async (linkedinUrl: string) => {
    if (!linkedinUrl || !contactInfo) return;

    try {
      const response = await fetch("/api/generate-linkedin-display", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkedin_url: linkedinUrl,
          contact_name: contactInfo.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const suggestedText = data.display_text;

        // Always refresh display text when LinkedIn URL changes
        setContactInfo(prevContactInfo => {
          if (!prevContactInfo) return null;
          return {
            ...prevContactInfo,
            linkedin_display: suggestedText,
          };
        });
        setLastLinkedInSuggestion(suggestedText);
        setIsLinkedInTextAutoGenerated(true);
      }
    } catch (error) {
      console.error("Error generating LinkedIn display text:", error);
    }
  }, [contactInfo, lastLinkedInSuggestion]);

  // Debounced version of LinkedIn display generation
  const debouncedGenerateLinkedInDisplay = useCallback((linkedinUrl: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 500ms debounce
    debounceTimeoutRef.current = setTimeout(() => {
      generateLinkedInDisplayText(linkedinUrl);
    }, 500);
  }, [generateLinkedInDisplayText]);

  // LinkedIn URL validation state
  const [linkedinUrlError, setLinkedinUrlError] = useState("");

  // Validate LinkedIn URL
  const validateLinkedInUrl = (url: string): boolean => {
    if (!url.trim()) {
      setLinkedinUrlError("");
      return true; // Empty is valid (optional field)
    }
    
    const urlLower = url.toLowerCase().trim();
    
    // Optimized LinkedIn URL regex that handles:
    // - Any subdomain (country codes, www, mobile, etc.)
    // - Personal profiles (/in/, /pub/, /public-profile/in/, /public-profile/pub/)
    // - Username length validation (3-100 characters)
    // - Optional trailing slash
    const linkedinProfilePattern = /^(https?:\/\/)?([\w\d]+\.)?linkedin\.com\/(?:public-profile\/)?(in|pub)\/[\w-]{3,100}\/?$/;
    
    // Smart Error Messages
    if (urlLower.includes("linkedin.com") && (urlLower.endsWith("linkedin.com") || urlLower.endsWith("linkedin.com/"))) {
      setLinkedinUrlError("Please enter a complete LinkedIn profile URL (e.g., linkedin.com/in/yourname)");
      return false;
    }
    
    if (urlLower.includes("linkedin") && !urlLower.includes("linkedin.com")) {
      setLinkedinUrlError("Please enter a valid LinkedIn.com profile URL");
      return false;
    }
    
    // Final validation with robust regex
    if (!linkedinProfilePattern.test(urlLower)) {
      setLinkedinUrlError("Please enter a valid LinkedIn profile URL");
      return false;
    }
    
    setLinkedinUrlError("");
    return true;
  };

  // Handle LinkedIn URL changes
  const handleLinkedInUrlChange = (newUrl: string) => {
    setContactInfo(prevContactInfo => {
      if (!prevContactInfo) return null;
      return {
        ...prevContactInfo,
        linkedin: newUrl,
      };
    });
    
    // If URL is empty, clear the display text
    if (!newUrl.trim()) {
      setContactInfo(prevContactInfo => {
        if (!prevContactInfo) return null;
        return {
          ...prevContactInfo,
          linkedin_display: "",
        };
      });
      setIsLinkedInTextAutoGenerated(false);
      return;
    }
    
    // Validate the URL
    const isValid = validateLinkedInUrl(newUrl);
    
    // Only trigger auto-generation if there's a valid LinkedIn URL
    if (isValid) {
      debouncedGenerateLinkedInDisplay(newUrl.trim());
    } else {
      // Clear display text if URL is invalid
      setContactInfo(prevContactInfo => {
        if (!prevContactInfo) return null;
        return {
          ...prevContactInfo,
          linkedin_display: "",
        };
      });
      setIsLinkedInTextAutoGenerated(false);
    }
  };

  // No longer need to show required field error on load since LinkedIn is optional

  // Handle LinkedIn display text changes
  const handleLinkedInDisplayChange = (newDisplayText: string) => {
    setContactInfo(prevContactInfo => {
      if (!prevContactInfo) return null;
      return {
        ...prevContactInfo,
        linkedin_display: newDisplayText,
      };
    });

    // If user is typing, it's no longer auto-generated
    if (newDisplayText !== lastLinkedInSuggestion) {
      setIsLinkedInTextAutoGenerated(false);
    }
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

  const handleRecoverData = async () => {
    if (autoSaveRecoveredData) {
      setLoadingRecover(true);

      // Longer delay for noticeable feedback
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setContactInfo(autoSaveRecoveredData.contactInfo);
      setSections(autoSaveRecoveredData.sections);
      setShowRecoveryModal(false);
      setHasHandledRecovery(true); // Prevent modal from showing again
      setLoadingRecover(false);
      toast.success("Previous work restored successfully");
    }
  };

  const handleStartFresh = async () => {
    setLoadingStartFresh(true);

    // Longer delay for noticeable feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));

    clearAutoSave();
    setShowRecoveryModal(false);
    setHasHandledRecovery(true); // Prevent modal from showing again
    setLoadingStartFresh(false);
    // Keep the current template data (already loaded)
  };

  const handleLoadEmptyTemplate = () => {
    // Show confirmation dialog before clearing
    setShowStartFreshConfirm(true);
  };

  const confirmStartFresh = async () => {
    if (!originalTemplateData) return;

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
      clearAutoSave();

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

  if (!templateId) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
        toastClassName="custom-toast"
      />

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
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 lg:p-6 max-w-screen-lg mx-auto lg:max-w-none">
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
          isSaving={isSaving}
          isGenerating={generating}
          isGeneratingPreview={isGeneratingPreview}
          previewIsStale={previewIsStale}
          lastSaved={lastSaved}
          saveError={saveError}
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

      {/* Help Modal - Improved */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <MdHelpOutline className="text-blue-600" />
                Save Your Work
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We don't require accounts, so your resume isn't automatically
                saved. Here's how to keep your work safe:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl mb-6">
                <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
                  <MdFileDownload className="text-blue-600" />
                  💾 Two Easy Steps:
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div>
                      <strong>Save My Work:</strong> Downloads a file you can
                      reopen later
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <strong>Load Previous Work:</strong> Upload that file to
                      continue editing
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Think of it like saving a document - you can pick up exactly
                where you left off!
              </p>
              <button
                onClick={toggleHelpModal}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recovery Modal */}
      {showRecoveryModal && autoSaveRecoveredData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-lg w-full border border-gray-200">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Continue Your Resume
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We found work you were doing earlier. You can pick up exactly
                  where you left off.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Your Previous Session
                    </h3>
                    <div className="text-blue-700 text-sm space-y-1 leading-relaxed">
                      <p>
                        Last worked on:{" "}
                        {autoSaveRecoveredData.timestamp.toLocaleDateString()} at{" "}
                        {autoSaveRecoveredData.timestamp.toLocaleTimeString()}
                      </p>
                      <p>
                        Contains: Contact info + {autoSaveRecoveredData.sections.length}{" "}
                        section{autoSaveRecoveredData.sections.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleRecoverData}
                  disabled={loadingRecover || loadingStartFresh}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${
                    loadingRecover
                      ? "opacity-75 cursor-not-allowed scale-95"
                      : ""
                  }`}
                >
                  {loadingRecover ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Restoring Work...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Continue Previous Work
                    </>
                  )}
                </button>
                <button
                  onClick={handleStartFresh}
                  disabled={loadingRecover || loadingStartFresh}
                  className={`w-full bg-white/80 backdrop-blur-sm text-gray-700 py-4 px-6 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 ${
                    loadingStartFresh
                      ? "opacity-75 cursor-not-allowed scale-95"
                      : ""
                  }`}
                >
                  {loadingStartFresh ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      Starting Fresh...
                    </>
                  ) : (
                    "Start With Clean Template"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal - Clean & Simple */}
      {showWelcomeTour && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Quick heads up
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="text-green-600 text-xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Auto-saved
                    </h3>
                    <p className="text-gray-600 text-sm">
                      As you make edits, your work is automatically saved
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-amber-600 text-xl">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Only on this device
                    </h3>
                    <p className="text-gray-600 text-sm">
                      To use it elsewhere: tap ⋮ → "Save My Work"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 text-xl">🛡️</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Your data stays yours
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We don't store or send your resume anywhere. You're always
                      in control.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleTourComplete(true)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Got it, don't show again
                </button>
                <button
                  onClick={() => handleTourComplete(false)}
                  className="w-full text-gray-600 py-2 px-6 rounded-lg hover:text-gray-800 transition-colors"
                >
                  Show next time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        title="Clear Template?"
        message="Are you sure you want to clear all content and start fresh? This will remove all your work and reset the template to empty. This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={loadingSave}
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
    </div>
  );
};

export default Editor;
