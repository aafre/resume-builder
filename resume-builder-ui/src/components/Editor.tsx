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
import { MdFileDownload, MdFileUpload, MdHelpOutline } from "react-icons/md";

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

  if (!templateId) {
    return (
      <p className="text-red-500">
        Invalid template ID. Please select a template.
      </p>
    );
  }

  if (loading) return <p>Loading...</p>;

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  return (
    <div className="container mx-auto my-10">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Add Section Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Section
        </button>

        {/* Right Side: Export, Import, and Help Buttons */}
        <div className="flex gap-2">
          {/* Export Button */}
          <button
            onClick={handleExportYAML}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-teal-800 transition-all"
            title="Export your resume as a YAML file"
          >
            <MdFileDownload />
            Export YAML
          </button>

          {/* Import Button */}
          <label
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow hover:bg-green-600 transition-all"
            title="Import your resume as a YAML file"
          >
            <MdFileUpload />
            Import YAML
            <input
              type="file"
              accept=".yaml,.yml"
              className="hidden"
              onChange={handleImportYAML}
            />
          </label>

          {/* Help Button */}
          <button
            onClick={toggleHelpModal}
            className="bg-gray-500 text-white p-3 rounded-md shadow-md hover:bg-gray-600 transition-all"
            title="What is YAML Export/Import?"
          >
            <MdHelpOutline />
          </button>

          {/* Help Modal */}
          {showHelpModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Why Use YAML Export/Import?
                </h2>
                <p className="text-gray-700 mb-4">
                  We don’t ask you to create an account, and we don’t store your
                  resume data. This means if you close the app and come back
                  later, your resume edits will be gone.
                </p>
                <div className="bg-blue-100 border border-blue-300 p-3 rounded-lg mb-4">
                  <h3 className="text-blue-700 font-medium mb-2">
                    💡 Here's How to Use It:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>
                      <strong>Export:</strong> After creating your resume, save
                      it as a YAML file to your computer.
                    </li>
                    <li>
                      <strong>Import:</strong> When you come back later, upload
                      that YAML file to quickly load your saved resume and
                      continue editing.
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-4">
                  It's like saving your work - without needing to create an
                  account!
                </p>
                <button
                  onClick={toggleHelpModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Got It!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border p-6 mb-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        {contactInfo && (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(contactInfo).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-medium mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  value={contactInfo[key as keyof ContactInfo] || ""}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, [key]: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
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

      <div
        className="sticky bottom-5 transform z-50 "
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={handleGenerateResume}
          className={`bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition-all ${
            generating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={generating}
        >
          <FaFilePdf className="inline mr-2" />
          {generating ? "Generating..." : "Generate PDF"}
        </button>
      </div>

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
