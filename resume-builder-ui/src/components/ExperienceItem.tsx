import React from "react";
import IconManager from "./IconManager";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { arrayMove } from "@dnd-kit/sortable";

export interface ExperienceItemData {
  company: string;
  title: string;
  dates: string;
  description: string[];
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

// Icon registry methods passed from parent Editor component
export interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface ExperienceItemProps {
  id: string;
  index: number;
  experience: ExperienceItemData;
  onUpdate: (index: number, updatedItem: ExperienceItemData) => void;
  onDelete: (index: number) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
  sectionIdPrefix: string; // Used for description dnd context id
}

const ExperienceItem: React.FC<ExperienceItemProps> = React.memo(({
  id,
  index,
  experience,
  onUpdate,
  onDelete,
  supportsIcons = false,
  iconRegistry,
  sectionIdPrefix,
}) => {
  const handleUpdateField = (
    field: keyof ExperienceItemData,
    value: any
  ) => {
    const updatedExperience = {
      ...experience,
      [field]: value,
    };
    onUpdate(index, updatedExperience);
  };

  const handleIconChange = (filename: string | null, file: File | null) => {
    const updatedExperience = {
      ...experience,
      icon: filename,
      iconFile: file,
      iconBase64: null,
    };
    onUpdate(index, updatedExperience);
  };

  return (
    <SortableItem id={id}>
      <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
          <button
            onClick={() => onDelete(index)}
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
                onChange={handleIconChange}
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
                onChange={(value) => handleUpdateField("company", value)}
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
                onChange={(value) => handleUpdateField("title", value)}
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
                  handleUpdateField("dates", e.target.value)
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
                  sectionId={`${sectionIdPrefix}-item-${index}`}
                  isSubitem={true}
                  onReorder={(oldDescIndex, newDescIndex) => {
                    const reorderedDescriptions = arrayMove(
                      experience.description,
                      oldDescIndex,
                      newDescIndex
                    );
                    const updatedExperience = {
                      ...experience,
                      description: reorderedDescriptions,
                    };
                    onUpdate(index, updatedExperience);
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
                                  const updatedDescriptions = [...experience.description];
                                  updatedDescriptions[descIndex] = value;
                                  const updatedExperience = {
                                    ...experience,
                                    description: updatedDescriptions,
                                  };
                                  onUpdate(index, updatedExperience);
                                }}
                                placeholder="Describe your responsibilities, achievements, or key projects..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const updatedDescriptions = [...experience.description];
                                updatedDescriptions.splice(descIndex, 1);
                                const updatedExperience = {
                                  ...experience,
                                  description: updatedDescriptions,
                                };
                                onUpdate(index, updatedExperience);
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
                const updatedDescriptions = [...experience.description, ""];
                const updatedExperience = {
                  ...experience,
                  description: updatedDescriptions,
                };
                onUpdate(index, updatedExperience);
              }}
              className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              + Add Description Point
            </button>
          </div>
        </div>
      </div>
    </SortableItem>
  );
});

export default ExperienceItem;
