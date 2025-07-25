import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaFilePdf, FaPlus } from "react-icons/fa";
import { fetchTemplate, generateResume } from "../services/templates";
import { getSessionId } from "../utils/session";
import yaml from "js-yaml";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import GenericSection from "./GenericSection";
import IconListSection from "./IconListSection";
import SectionTypeModal from "./SectionTypeModal";
import { MdFileDownload, MdFileUpload, MdHelpOutline, MdMoreVert, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

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

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [supportsIcons, setSupportsIcons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(
    null
  );
  const [temporaryTitle, setTemporaryTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const newSectionRef = useRef<HTMLDivElement | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);

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
      } catch (error) {
        console.error("Error fetching template:", error);
        toast.error("Failed to load template.");
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  const processSections = (sections: Section[]) => {
    return sections.map((section) => {
      // Handle icon-list sections (Certifications, Awards, etc.)
      if (section.type === "icon-list") {
        const updatedContent = section.content.map((item: any) => ({
          certification: item.certification || "",
          issuer: item.issuer || "",
          date: item.date || "",
          icon: item.icon
            ? item.icon.startsWith("/icons/")
              ? item.icon.replace("/icons/", "")
              : item.icon
            : null,
        }));
        return {
          ...section,
          content: updatedContent,
        };
      }

      if (["Experience", "Education"].includes(section.name)) {
        const updatedContent = Array.isArray(section.content)
          ? section.content.map((item: any) => {
              const { icon, iconFile, ...rest } = item;
              return {
                ...rest,
                icon: icon
                  ? icon.startsWith("/icons/")
                    ? icon.replace("/icons/", "")
                    : icon
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

  const handleAddSection = (type: string) => {
    // Check for duplicates - generate a unique name if needed
    const getUniqueDefaultName = (baseType: string) => {
      const typeNameMap: { [key: string]: string } = {
        "text": "New Text Section",
        "bulleted-list": "New Bulleted List Section", 
        "inline-list": "New Inline List Section",
        "dynamic-column-list": "New Dynamic Column List Section",
        "icon-list": "New Icon List Section"
      };
      
      const baseName = typeNameMap[baseType] || "New Section";
      const existingNames = sections.map(s => s.name.toLowerCase());
      
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
    if (["bulleted-list", "inline-list", "dynamic-column-list", "icon-list"].includes(type)) {
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

  const handleExportYAML = () => {
    try {
      const processedSections = processSections(sections);

      const yamlData = yaml.dump({
        contact_info: contactInfo,
        sections: processedSections,
      });

      const blob = new Blob([yamlData], { type: "application/x-yaml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.yaml";
      link.click();
    } catch (error) {
      console.error("Error exporting YAML:", error);
      toast.error("Failed to export YAML. Please try again.");
    }
  };

  const handleImportYAML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedYaml = yaml.load(e.target?.result as string) as {
          contact_info: ContactInfo;
          sections: Section[];
        };
        setContactInfo(parsedYaml.contact_info);
        // Process sections to clean up icon paths when importing YAML
        const processedSections = processSections(parsedYaml.sections);
        setSections(processedSections);
      } catch (error) {
        console.error("Error parsing YAML file:", error);
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

      sections.forEach((section) => {
        if (
          ["Experience", "Education"].includes(section.name) &&
          Array.isArray(section.content)
        ) {
          section.content.forEach((item: any) => {
            if (item.icon && item.iconFile) {
              formData.append("icons", item.iconFile, item.icon);
            }
          });
        }

        // Handle icon-list section icons (Certifications, Awards, etc.)
        if (
          section.type === "icon-list" &&
          Array.isArray(section.content)
        ) {
          section.content.forEach((item: any) => {
            if (item.icon && item.iconFile) {
              formData.append("icons", item.iconFile, item.icon);
            }
          });
        }
      });

      const { pdfBlob, fileName } = await generateResume(formData);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName; // Use dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Resume generated successfully!");
    } catch (error) {
      console.error("Error generating resume:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error generating resume: ${errorMessage}`);
    } finally {
      setGenerating(false);
    }
  };

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  // Close advanced menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAdvancedMenu) {
        const target = event.target as Element;
        if (!target.closest('.advanced-menu-container')) {
          setShowAdvancedMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdvancedMenu]);


  if (!templateId) {
    return (
      <p className="text-red-500">
        Invalid template ID. Please select a template.
      </p>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Header with Actions */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Build Your Resume</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaPlus />
                Add New Section
              </button>
              
              <div className="relative advanced-menu-container">
                <button
                  onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                  className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <MdMoreVert />
                  Save/Load
                </button>
                {showAdvancedMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 z-[100]">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleExportYAML();
                          setShowAdvancedMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <MdFileDownload className="text-blue-600" />
                        <div>
                          <div className="font-medium">Save My Work</div>
                          <div className="text-xs text-gray-500">Download to continue later</div>
                        </div>
                      </button>
                      <label className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                        <MdFileUpload className="text-green-600" />
                        <div>
                          <div className="font-medium">Load Previous Work</div>
                          <div className="text-xs text-gray-500">Upload your saved resume</div>
                        </div>
                        <input
                          type="file"
                          accept=".yaml,.yml"
                          className="hidden"
                          onChange={(e) => {
                            handleImportYAML(e);
                            setShowAdvancedMenu(false);
                          }}
                        />
                      </label>
                      <button
                        onClick={() => {
                          toggleHelpModal();
                          setShowAdvancedMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <MdHelpOutline className="text-purple-600" />
                        <div>
                          <div className="font-medium">Help & Tips</div>
                          <div className="text-xs text-gray-500">How to save your work</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-8 pb-32">
        {/* Contact Information Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <MdCheckCircle className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
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

        {/* Resume Sections */}
        {sections.map((section, index) => {
          if (section.name === "Experience") {
            return (
              <div
                key={index}
                ref={index === sections.length - 1 ? newSectionRef : null}
              >
                <ExperienceSection
                  key={index}
                  experiences={section.content}
                  onUpdate={(updatedExperiences) =>
                    handleUpdateSection(index, {
                      ...section,
                      content: updatedExperiences,
                    })
                  }
                  supportsIcons={supportsIcons}
                />
              </div>
            );
          } else if (section.name === "Education") {
            return (
              <div
                key={index}
                ref={index === sections.length - 1 ? newSectionRef : null}
              >
                <EducationSection
                  key={index}
                  education={section.content}
                  onUpdate={(updatedEducation) =>
                    handleUpdateSection(index, {
                      ...section,
                      content: updatedEducation,
                    })
                  }
                  supportsIcons={supportsIcons}
                />
              </div>
            );
          } else if (section.type === "icon-list") {
            return (
              <div
                key={index}
                ref={index === sections.length - 1 ? newSectionRef : null}
              >
                <IconListSection
                  key={index}
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
                />
              </div>
            );
          } else {
            return (
              <div
                key={index}
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
            );
          }
        })}

        {/* Generate Button - Sticky with footer spacing */}
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleGenerateResume}
            className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl font-semibold text-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 ${
              generating ? "opacity-75 cursor-not-allowed scale-95" : "hover:scale-105"
            }`}
            disabled={generating}
          >
            <FaFilePdf className="text-xl" />
            {generating ? "Creating Your Resume..." : "Download My Resume"}
          </button>
        </div>
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
                We don't require accounts, so your resume isn't automatically saved. 
                Here's how to keep your work safe:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl mb-6">
                <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
                  <MdFileDownload className="text-blue-600" />
                  💾 Two Easy Steps:
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <strong>Save My Work:</strong> Downloads a file you can reopen later
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <strong>Load Previous Work:</strong> Upload that file to continue editing
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Think of it like saving a document - you can pick up exactly where you left off!
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

      {showModal && (
        <SectionTypeModal
          onClose={() => setShowModal(false)}
          onSelect={handleAddSection}
        />
      )}
    </div>
  );
};

export default Editor;