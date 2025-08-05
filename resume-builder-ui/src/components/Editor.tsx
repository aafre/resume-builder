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
import yaml from "js-yaml";
import { PortableYAMLData } from "../types/iconTypes";
import { extractReferencedIconFilenames } from "../utils/iconExtractor";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import GenericSection from "./GenericSection";
import IconListSection from "./IconListSection";
import SectionTypeModal from "./SectionTypeModal";
import EditorToolbar from "./EditorToolbar";
import DragHandle from "./DragHandle";
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
  linkedin: string;
}

const Editor: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get("template");

  // Get context for footer integration and auto-save
  const {
    isAtBottom: contextIsAtBottom,
    setIsAtBottom: setContextIsAtBottom,
    setLastSaved,
    isSaving,
    setIsSaving,
    setSaveError,
  } = useEditorContext();

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [supportsIcons, setSupportsIcons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Central icon registry for all uploaded icons
  const iconRegistry = useIconRegistry();
  const [generating, setGenerating] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(
    null
  );
  const [temporaryTitle, setTemporaryTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const newSectionRef = useRef<HTMLDivElement | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveredData, setRecoveredData] = useState<{
    timestamp: any;
    contactInfo: ContactInfo;
    sections: Section[];
  } | null>(null);
  const [originalTemplateData, setOriginalTemplateData] = useState<{
    contactInfo: ContactInfo;
    sections: Section[];
  } | null>(null);
  const [loadingRecover, setLoadingRecover] = useState(false);
  const [loadingStartFresh, setLoadingStartFresh] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [loadingAddSection, setLoadingAddSection] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);

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
        // Process sections to clean up icon paths when loading template
        const processedSections = processSections(parsedYaml.sections);
        setSections(processedSections);
        setSupportsIcons(supportsIcons);

        // Store original template data to compare against changes
        setOriginalTemplateData({
          contactInfo: parsedYaml.contact_info,
          sections: processedSections,
        });

        // Check for auto-saved data after template loads
        setTimeout(async () => {
          const savedData = await loadFromLocalStorage();
          if (savedData) {
            const timeDiff =
              new Date().getTime() - savedData.timestamp.getTime();

            // Only show recovery if saved within last 7 days
            if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
              setRecoveredData(savedData);
              setShowRecoveryModal(true);
            }
          }
        }, 500);
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

  const processSections = (sections: Section[]) => {
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

      if (["Experience", "Education"].includes(section.name)) {
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
  };

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
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

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
    if (
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

        // Process sections to clean up icon paths when importing YAML
        const processedSections = processSections(parsedYaml.sections);
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

  // Auto-save localStorage functions
  const getAutoSaveKey = () => `resume-builder-${templateId}-autosave`;

  const hasDataChanged = (): boolean => {
    if (!originalTemplateData) return false;

    // Compare contact info
    if (
      JSON.stringify(contactInfo) !==
      JSON.stringify(originalTemplateData.contactInfo)
    ) {
      return true;
    }

    // Compare sections (excluding iconFile objects as they're not part of original data)
    const currentSectionsForComparison = sections.map((section) => {
      if (
        ["Experience", "Education"].includes(section.name) &&
        Array.isArray(section.content)
      ) {
        return {
          ...section,
          content: section.content.map((item: any) => {
            const { iconFile, iconBase64, ...rest } = item;
            return rest;
          }),
        };
      } else if (
        section.type === "icon-list" &&
        Array.isArray(section.content)
      ) {
        return {
          ...section,
          content: section.content.map((item: any) => {
            const { iconFile, iconBase64, ...rest } = item;
            return rest;
          }),
        };
      }
      return section;
    });

    return (
      JSON.stringify(currentSectionsForComparison) !==
      JSON.stringify(originalTemplateData.sections)
    );
  };

  const saveToLocalStorage = async () => {
    try {
      // Only save if data has changed from original template
      if (!hasDataChanged()) {
        return;
      }

      // Export icon registry data for storage
      const iconRegistryData = await iconRegistry.exportForStorage();

      const data = {
        contactInfo,
        sections,
        iconRegistry: iconRegistryData,
        timestamp: new Date().toISOString(),
      };

      // Store as JSON (basic obfuscation can be added later if needed)
      localStorage.setItem(getAutoSaveKey(), JSON.stringify(data));
      const savedTime = new Date();
      setLastSaved(savedTime);
      setSaveError(false); // Clear any previous errors
    } catch (error) {
      console.error("Failed to auto-save to localStorage:", error);
      setSaveError(true);
      // Auto-retry after 5 seconds
      setTimeout(() => {
        if (contactInfo && sections.length > 0) {
          saveToLocalStorage();
        }
      }, 5000);
    }
  };

  const loadFromLocalStorage = async () => {
    try {
      const saved = localStorage.getItem(getAutoSaveKey());
      if (saved) {
        // Parse JSON data
        const decodedData = JSON.parse(saved);

        // Import icon registry data if it exists
        if (decodedData.iconRegistry) {
          await iconRegistry.importFromStorage(decodedData.iconRegistry);
        }

        return {
          contactInfo: decodedData.contactInfo,
          sections: decodedData.sections,
          timestamp: new Date(decodedData.timestamp),
        };
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return null;
  };

  const clearAutoSave = () => {
    try {
      localStorage.removeItem(getAutoSaveKey());
      setLastSaved(null);
    } catch (error) {
      console.error("Failed to clear auto-save:", error);
    }
  };

  const handleRecoverData = async () => {
    if (recoveredData) {
      setLoadingRecover(true);

      // Longer delay for noticeable feedback
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setContactInfo(recoveredData.contactInfo);
      setSections(recoveredData.sections);
      setShowRecoveryModal(false);
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
    setLoadingStartFresh(false);
    // Keep the current template data (already loaded)
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

  // Debounced auto-save effect
  useEffect(() => {
    if (!contactInfo && sections.length === 0) return; // Don't save empty state
    if (!originalTemplateData) return; // Don't save until template is loaded

    const timer = setTimeout(async () => {
      setIsSaving(true);
      await saveToLocalStorage();
      setIsSaving(false);
    }, 2000); // Save 2 seconds after user stops editing

    return () => clearTimeout(timer);
  }, [
    contactInfo,
    sections,
    templateId,
    originalTemplateData,
    setIsSaving,
    setLastSaved,
    setSaveError,
  ]);

  // Periodic auto-save backup
  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        (contactInfo || sections.length > 0) &&
        originalTemplateData &&
        !isSaving
      ) {
        setIsSaving(true);
        await saveToLocalStorage();
        setIsSaving(false);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [
    contactInfo,
    sections,
    templateId,
    originalTemplateData,
    isSaving,
    setIsSaving,
    setLastSaved,
    setSaveError,
  ]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if ((contactInfo || sections.length > 0) && originalTemplateData) {
        await saveToLocalStorage();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [contactInfo, sections, templateId, originalTemplateData]);

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

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-8 pb-72 sm:pb-56 lg:pb-44">
        {/* Contact Information Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Contact Information
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Start by filling out your basic contact information
          </p>
          {contactInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(contactInfo).map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={contactInfo[key as keyof ContactInfo] || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, [key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={`Enter your ${key}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

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
              if (section.name === "Experience") {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={index === sections.length - 1 ? newSectionRef : null}
                    >
                      <ExperienceSection
                        experiences={section.content}
                        onUpdate={(updatedExperiences) =>
                          handleUpdateSection(index, {
                            ...section,
                            content: updatedExperiences,
                          })
                        }
                        supportsIcons={supportsIcons}
                        iconRegistry={iconRegistry}
                      />
                    </div>
                  </DragHandle>
                );
              } else if (section.name === "Education") {
                return (
                  <DragHandle
                    key={index}
                    id={index.toString()}
                    disabled={false}
                  >
                    <div
                      ref={index === sections.length - 1 ? newSectionRef : null}
                    >
                      <EducationSection
                        education={section.content}
                        onUpdate={(updatedEducation) =>
                          handleUpdateSection(index, {
                            ...section,
                            content: updatedEducation,
                          })
                        }
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
                      ref={index === sections.length - 1 ? newSectionRef : null}
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
                      ref={index === sections.length - 1 ? newSectionRef : null}
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
                    experiences={draggedSection.content}
                    onUpdate={() => {}}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                  />
                ) : draggedSection.name === "Education" ? (
                  <EducationSection
                    education={draggedSection.content}
                    onUpdate={() => {}}
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

        {/* Docked Bottom Toolbar - Always visible, positioned above footer when footer shows */}
        <div
          className={`fixed z-[60] bg-gradient-to-r from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg transition-all duration-300 
            left-0 right-0 border-t border-gray-200/60 lg:left-auto lg:right-6 lg:border-t-0 lg:border lg:border-gray-200/60 lg:rounded-2xl lg:w-auto lg:max-w-none ${
              contextIsAtBottom
                ? "bottom-56 sm:bottom-40 lg:bottom-24"
                : "bottom-0 lg:bottom-6"
            }`}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 lg:p-6 max-w-screen-lg mx-auto lg:max-w-none">
            <EditorToolbar
              onAddSection={handleAddNewSectionClick}
              onGenerateResume={handleGenerateResume}
              onExportYAML={handleExportYAML}
              onImportYAML={handleImportYAML}
              onToggleHelp={toggleHelpModal}
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
      {showRecoveryModal && recoveredData && (
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
                        {recoveredData.timestamp.toLocaleDateString()} at{" "}
                        {recoveredData.timestamp.toLocaleTimeString()}
                      </p>
                      <p>
                        Contains: Contact info + {recoveredData.sections.length}{" "}
                        section{recoveredData.sections.length !== 1 ? "s" : ""}
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
    </div>
  );
};

export default Editor;
