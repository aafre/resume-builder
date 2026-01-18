import React, { useState, useEffect } from "react";
import IconManager from "./IconManager";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { arrayMove } from "@dnd-kit/sortable";
import { GhostButton } from "./shared/GhostButton";

interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface ExperienceSectionProps {
  sectionName: string; // Custom section title
  experiences: ExperienceItem[];
  onUpdate: (updatedExperiences: ExperienceItem[]) => void;
  onTitleEdit: () => void; // Callback when edit mode is activated
  onTitleSave: () => void; // Callback when title is saved
  onTitleCancel: () => void; // Callback when title edit is cancelled
  onDelete: () => void; // Callback when section is deleted
  onDeleteEntry?: (index: number) => void; // Callback when entry delete is requested (triggers confirmation)
  onReorderEntry?: (oldIndex: number, newIndex: number) => void; // Callback when entry is reordered via drag-and-drop
  isEditingTitle: boolean; // Whether title is being edited
  temporaryTitle: string; // Temporary title during editing
  setTemporaryTitle: (title: string) => void; // Update temporary title
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  sectionName,
  experiences,
  onUpdate,
  onTitleEdit,
  onTitleSave,
  onTitleCancel,
  onDelete,
  onDeleteEntry,
  onReorderEntry,
  isEditingTitle,
  temporaryTitle,
  setTemporaryTitle,
  supportsIcons = false,
  iconRegistry,
}) => {
  // Collapse state - default to collapsed on mobile, expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return false;
  });

  // Update collapse state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isCollapsed) {
        setIsCollapsed(false); // Auto-expand on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleUpdateField = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    onUpdate(updatedExperiences);
  };

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedExperiences);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <SectionHeader
        title={sectionName}
        isEditing={isEditingTitle}
        temporaryTitle={temporaryTitle}
        onTitleEdit={onTitleEdit}
        onTitleSave={onTitleSave}
        onTitleCancel={onTitleCancel}
        onTitleChange={setTemporaryTitle}
        onDelete={onDelete}
        showHint={sectionName.startsWith("New ")}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      {!isCollapsed && (
        <ItemDndContext
          items={experiences}
          sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
          onReorder={(oldIndex, newIndex) => {
            if (onReorderEntry) {
              onReorderEntry(oldIndex, newIndex);
            }
          }}
          getItemInfo={(item) => ({
            label: item.company || 'Untitled Company',
            sublabel: item.title || undefined,
            type: 'experience' as const,
          })}
        >
          {({ itemIds }) => (
            <>
              {experiences.map((experience, index) => (
                <SortableItem key={itemIds[index]} id={itemIds[index]}>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                      <button
                        onClick={() => {
                          if (onDeleteEntry) {
                            onDeleteEntry(index);
                          } else {
                            const updatedExperiences = [...experiences];
                            updatedExperiences.splice(index, 1);
                            onUpdate(updatedExperiences);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete experience entry"
                        title="Delete this experience"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>

                    <div className="mt-4">
                      {supportsIcons && iconRegistry && (
                        <div className="mb-4">
                          <IconManager
                            value={experience.icon || null}
                            onChange={(filename, file) => handleIconChange(index, filename, file)}
                            registerIcon={iconRegistry.registerIcon}
                            getIconFile={iconRegistry.getIconFile}
                            removeIcon={iconRegistry.removeIcon}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Company
                          </label>
                          <RichTextInput
                            value={experience.company}
                            onChange={(value) => handleUpdateField(index, "company", value)}
                            placeholder="Enter company name"
                            className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Title
                          </label>
                          <RichTextInput
                            value={experience.title}
                            onChange={(value) => handleUpdateField(index, "title", value)}
                            placeholder="Enter job title"
                            className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Dates
                          </label>
                          <input
                            type="text"
                            value={experience.dates}
                            onChange={(e) =>
                              handleUpdateField(index, "dates", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="e.g., Jan 2020 - Present"
                          />
                        </div>
                      </div>

                      <div className="w-full">
                        <label className="block text-gray-700 font-medium mb-1">
                          Job Description & Achievements
                        </label>
                        <MarkdownHint />
                        <div className="space-y-3 mt-2">
                          {experience.description.length > 0 && (
                            <ItemDndContext
                              items={experience.description}
                              sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}-item-${index}`}
                              isSubitem={true}
                              onReorder={(oldDescIndex, newDescIndex) => {
                                const updatedExperiences = [...experiences];
                                const reorderedDescriptions = arrayMove(
                                  updatedExperiences[index].description,
                                  oldDescIndex,
                                  newDescIndex
                                );
                                updatedExperiences[index] = {
                                  ...updatedExperiences[index],
                                  description: reorderedDescriptions,
                                };
                                onUpdate(updatedExperiences);
                              }}
                              getItemInfo={(item) => ({
                                label: item.length > 60 ? item.substring(0, 60) + '...' : item || 'Empty bullet point',
                                type: 'bullet' as const,
                              })}
                            >
                              {({ itemIds }) => (
                                <>
                                  {experience.description.map((desc, descIndex) => (
                                    <SortableItem
                                      key={itemIds[descIndex]}
                                      id={itemIds[descIndex]}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                          <RichTextInput
                                            value={desc}
                                            onChange={(value) => {
                                              const updatedExperiences = [...experiences];
                                              updatedExperiences[index].description[descIndex] = value;
                                              onUpdate(updatedExperiences);
                                            }}
                                            placeholder="Describe your responsibilities, achievements, or key projects..."
                                            className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                                          />
                                        </div>
                                        <button
                                          onClick={() => {
                                            const updatedExperiences = [...experiences];
                                            updatedExperiences[index].description.splice(descIndex, 1);
                                            onUpdate(updatedExperiences);
                                          }}
                                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-2"
                                          title="Remove description point"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </SortableItem>
                                  ))}
                                </>
                              )}
                            </ItemDndContext>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const updatedExperiences = [...experiences];
                            updatedExperiences[index].description.push("");
                            onUpdate(updatedExperiences);
                          }}
                          className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                          + Add Description Point
                        </button>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {!isCollapsed && (
        <GhostButton
          onClick={() => {
            const newExperience: ExperienceItem = {
              company: "",
              title: "",
              dates: "",
              description: [],
              icon: null,
              iconFile: null,
              iconBase64: null,
            };
            onUpdate([...experiences, newExperience]);
          }}
        >
          Add Experience
        </GhostButton>
      )}
    </div>
  );
};

export default ExperienceSection;
