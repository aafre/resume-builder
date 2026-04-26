import React, { useCallback, useRef, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RichTextInput } from './RichTextInput';
import { MarkdownHint } from './MarkdownLinkPreview';
import IconManager from './IconManager';
import ItemDndContext from './ItemDndContext';
import SortableItem from './SortableItem';
import { arrayMove } from '@dnd-kit/sortable';
import ResponsiveConfirmDialog from './ResponsiveConfirmDialog';

export interface ExperienceItemData {
  company: string;
  title: string;
  dates: string;
  description: string[];
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

export type EditableExperienceField = 'company' | 'title' | 'dates';

interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface ExperienceItemProps {
  item: ExperienceItemData;
  index: number;
  sectionName: string;
  supportsIcons: boolean;
  iconRegistry?: IconRegistryMethods;
  onUpdate: (index: number, updatedItem: ExperienceItemData) => void;
  onDelete: (index: number) => void;
  // Make Dnd context props optional if they need to be passed down
  itemIds?: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = React.memo(({
  item,
  index,
  sectionName,
  supportsIcons,
  iconRegistry,
  onUpdate,
  onDelete,
}) => {
  // Use a ref to hold the latest item to prevent stale closures in callbacks
  // while maintaining reference stability for the callbacks themselves
  const itemRef = useRef(item);
  itemRef.current = item;

  const handleUpdateField = useCallback((field: EditableExperienceField, value: string) => {
    onUpdate(index, { ...itemRef.current, [field]: value });
  }, [index, onUpdate]);

  const handleIconChange = useCallback((filename: string | null, file: File | null) => {
    onUpdate(index, {
      ...itemRef.current,
      icon: filename,
      iconFile: file,
      iconBase64: null,
    });
  }, [index, onUpdate]);

  const handleDescReorder = useCallback((oldDescIndex: number, newDescIndex: number) => {
    const reorderedDescriptions = arrayMove(
      itemRef.current.description,
      oldDescIndex,
      newDescIndex
    );
    onUpdate(index, { ...itemRef.current, description: reorderedDescriptions });
  }, [index, onUpdate]);

  const handleDescUpdate = useCallback((descIndex: number, value: string) => {
    const updatedDescriptions = [...itemRef.current.description];
    updatedDescriptions[descIndex] = value;
    onUpdate(index, { ...itemRef.current, description: updatedDescriptions });
  }, [index, onUpdate]);

  const handleDescRemove = useCallback((descIndex: number) => {
    const updatedDescriptions = [...itemRef.current.description];
    updatedDescriptions.splice(descIndex, 1);
    onUpdate(index, { ...itemRef.current, description: updatedDescriptions });
  }, [index, onUpdate]);

  const handleDescAdd = useCallback(() => {
    onUpdate(index, { ...itemRef.current, description: [...itemRef.current.description, ""] });
  }, [index, onUpdate]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
    <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
        <button
          onClick={() => setShowDeleteConfirm(true)}
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
              onChange={handleIconChange}
              registerIcon={iconRegistry.registerIcon}
              getIconFile={iconRegistry.getIconFile}
              removeIcon={iconRegistry.removeIcon}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Company</label>
            <RichTextInput
              value={item.company}
              onChange={(value) => handleUpdateField("company", value)}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <RichTextInput
              value={item.title}
              onChange={(value) => handleUpdateField("title", value)}
              placeholder="Enter job title"
              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Dates</label>
            <input
              type="text"
              value={item.dates}
              onChange={(e) => handleUpdateField("dates", e.target.value)}
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
                sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}-item-${index}`}
                isSubitem={true}
                onReorder={handleDescReorder}
                getItemInfo={(descItem) => ({
                  label: descItem.length > 60 ? descItem.substring(0, 60) + '...' : descItem || 'Empty bullet point',
                  type: 'bullet' as const,
                })}
              >
                {({ itemIds: descItemIds }) => (
                  <>
                    {item.description.map((desc, descIndex) => (
                      <SortableItem key={descItemIds[descIndex]} id={descItemIds[descIndex]}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <RichTextInput
                              value={desc}
                              onChange={(value) => handleDescUpdate(descIndex, value)}
                              placeholder="Describe your responsibilities, achievements, or key projects..."
                              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
                            />
                          </div>
                          <button
                            onClick={() => handleDescRemove(descIndex)}
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
            onClick={handleDescAdd}
            className="mt-3 bg-accent text-ink px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            + Add Description Point
          </button>
        </div>
      </div>
    </div>
    <ResponsiveConfirmDialog
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={() => {
        onDelete(index);
        setShowDeleteConfirm(false);
      }}
      title="Delete Experience?"
      message="Are you sure you want to delete this experience entry? This action cannot be undone."
      isDestructive={true}
    />
    </>
  );
});

export default ExperienceItem;
