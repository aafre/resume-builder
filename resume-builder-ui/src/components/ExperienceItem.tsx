import React, { useCallback } from "react";
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

// Union of fields that can be updated via the generic onUpdate handler
// Note: icon/iconFile are handled via onIconChange
export type EditableExperienceField = 'company' | 'title' | 'dates' | 'description';

interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface ExperienceItemProps {
  id: string; // SortableItem id
  item: ExperienceItemData;
  index: number;
  sectionId: string; // For generating description item IDs
  onUpdate: (index: number, field: EditableExperienceField, value: ExperienceItemData[EditableExperienceField]) => void;
  onDelete: (index: number) => void;
  onIconChange: (index: number, filename: string | null, file: File | null) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const ExperienceItem: React.FC<ExperienceItemProps> = React.memo(({
  id,
  item,
  index,
  sectionId,
  onUpdate,
  onDelete,
  onIconChange,
  supportsIcons = false,
  iconRegistry,
}) => {
  // Stable handlers for this item's fields
  const handleCompanyChange = useCallback((value: string) => {
    onUpdate(index, "company", value);
  }, [onUpdate, index]);

  const handleTitleChange = useCallback((value: string) => {
    onUpdate(index, "title", value);
  }, [onUpdate, index]);

  const handleDatesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, "dates", e.target.value);
  }, [onUpdate, index]);

  // Handler for icon change
  const handleIconChangeLocal = useCallback((filename: string | null, file: File | null) => {
    onIconChange(index, filename, file);
  }, [onIconChange, index]);

  // Handlers for description list updates
  const handleDescriptionReorder = useCallback((oldDescIndex: number, newDescIndex: number) => {
    const reorderedDescriptions = arrayMove(
      item.description,
      oldDescIndex,
      newDescIndex
    );
    onUpdate(index, "description", reorderedDescriptions);
  }, [onUpdate, index, item.description]);

  const handleDescriptionChange = useCallback((descIndex: number, value: string) => {
    const updatedDescriptions = [...item.description];
    updatedDescriptions[descIndex] = value;
    onUpdate(index, "description", updatedDescriptions);
  }, [onUpdate, index, item.description]);

  const handleDescriptionDelete = useCallback((descIndex: number) => {
    const updatedDescriptions = [...item.description];
    updatedDescriptions.splice(descIndex, 1);
    onUpdate(index, "description", updatedDescriptions);
  }, [onUpdate, index, item.description]);

  const handleAddDescription = useCallback(() => {
    const updatedDescriptions = [...item.description, ""];
    onUpdate(index, "description", updatedDescriptions);
  }, [onUpdate, index, item.description]);

  const handleDelete = useCallback(() => {
    onDelete(index);
  }, [onDelete, index]);

  return (
    <SortableItem id={id}>
      <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
          <button
            onClick={handleDelete}
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
                value={item.icon || null}
                onChange={handleIconChangeLocal}
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
                value={item.company}
                onChange={handleCompanyChange}
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <RichTextInput
                value={item.title}
                onChange={handleTitleChange}
                placeholder="Enter job title"
                className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Dates
              </label>
              <input
                type="text"
                value={item.dates}
                onChange={handleDatesChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200"
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
              {item.description.length > 0 && (
                <ItemDndContext
                  items={item.description}
                  sectionId={`${sectionId}-item-${index}`}
                  isSubitem={true}
                  onReorder={handleDescriptionReorder}
                  getItemInfo={(descItem) => ({
                    label: descItem.length > 60 ? descItem.substring(0, 60) + '...' : descItem || 'Empty bullet point',
                    type: 'bullet' as const,
                  })}
                >
                  {({ itemIds }) => (
                    <>
                      {item.description.map((desc, descIndex) => (
                        <SortableItem
                          key={itemIds[descIndex]}
                          id={itemIds[descIndex]}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <RichTextInput
                                value={desc}
                                onChange={(val) => handleDescriptionChange(descIndex, val)}
                                placeholder="Describe your responsibilities, achievements, or key projects..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
                              />
                            </div>
                            <button
                              onClick={() => handleDescriptionDelete(descIndex)}
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
              onClick={handleAddDescription}
              className="mt-3 bg-accent text-ink px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
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
