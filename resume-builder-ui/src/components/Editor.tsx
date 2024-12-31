import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaFileExport, FaFileImport, FaFilePdf, FaPlus } from "react-icons/fa";
import { fetchTemplate, generateResume } from "../services/templates";
import yaml from "js-yaml";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import GenericSection from "./GenericSection";
import IconListSection from "./IconListSection";
import SectionTypeModal from "./SectionTypeModal";

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
  const [supportsIcons, setSupportsIcons] = useState(false); // Dynamically set
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(
    null
  );
  const [temporaryTitle, setTemporaryTitle] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const newSectionRef = useRef<HTMLDivElement | null>(null);

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
        setSections(parsedYaml.sections);
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
      if (["Experience", "Education"].includes(section.name)) {
        const updatedContent = Array.isArray(section.content)
          ? section.content.map((item: any) => {
              const { icon, iconFile, ...rest } = item;
              return icon ? { ...rest, icon } : rest;
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
    const defaultContent = [
      "bulleted-list",
      "inline-list",
      "dynamic-column-list",
    ].includes(type)
      ? []
      : "";

    const newSection: Section = {
      name: "New Section",
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
        setSections(parsedYaml.sections);
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
      });

      const { pdfBlob } = await generateResume(formData);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "resume.pdf";
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

  return (
    <div className="container mx-auto my-10">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Section
        </button>
        <button
          onClick={handleExportYAML}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaFileExport />
          Export as YAML
        </button>
        <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2">
          <FaFileImport />
          Import YAML
          <input
            type="file"
            accept=".yaml,.yml"
            className="hidden"
            onChange={handleImportYAML}
          />
        </label>
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
          );
        } else if (section.name === "Education") {
          return (
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
          );
        } else if (section.type === "icon-list") {
          return (
            <IconListSection
              key={index}
              data={section.content}
              onUpdate={(updatedContent) =>
                handleUpdateSection(index, {
                  ...section,
                  content: updatedContent,
                })
              }
            />
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

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
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
