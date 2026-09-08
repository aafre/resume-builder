import React, { useCallback, useRef } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { X } from 'lucide-react';
import { RichTextInput } from './RichTextInput';
import { MarkdownHint } from './MarkdownLinkPreview';
import IconManager from './IconManager';
import ItemDndContext from './ItemDndContext';
import SortableItem from './SortableItem';
import { arrayMove } from '@dnd-kit/sortable';
import { toastUndo } from '../utils/undoToast';

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

  // The one destructive path in the editor that does not route through
  // useSectionManagement — a bullet is not a section entry, so it has its own
  // convergence point here. Every bullet delete in this component goes through
  // it, and it is the most-pressed destructive control on the page.
  const handleDescRemove = useCallback((descIndex: number) => {
    const removed = itemRef.current.description[descIndex];
    if (removed === undefined) return;

    const updatedDescriptions = [...itemRef.current.description];
    updatedDescriptions.splice(descIndex, 1);
    onUpdate(index, { ...itemRef.current, description: updatedDescriptions });

    toastUndo('Bullet point removed', () => {
      // Read the latest item so an edit to a sibling bullet inside the undo
      // window survives the restore.
      const restored = [...itemRef.current.description];
      restored.splice(Math.min(descIndex, restored.length), 0, removed);
      onUpdate(index, { ...itemRef.current, description: restored });
    });
  }, [index, onUpdate]);

  const handleDescAdd = useCallback(() => {
    onUpdate(index, { ...itemRef.current, description: [...itemRef.current.description, ""] });
  }, [index, onUpdate]);

  return (
    // Tonal, not bordered: this card already sits inside .section-card, which is
    // white with a border and a shadow. Repeating both here made one bullet sit
    // inside three nested bordered boxes, each with its own resting shadow --
    // against Flat-At-Rest, and against DESIGN.md's "where a resting surface
    // needs to separate from its ground, it does so tonally, not with a shadow".
    // Chalk Dark on white is the whole separation this needs.
    <div className="bg-chalk-dark p-4 sm:p-6 mb-edit-group rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
        <button
          onClick={() => onDelete(index)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Delete experience entry"
          title="Delete this experience"
        >
          <MdDelete className="text-xl" />
        </button>
      </div>

      <div className="mt-edit-group">
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
            <label className="block text-ink font-medium mb-1">Company</label>
            <RichTextInput
              value={item.company}
              onChange={(value) => handleUpdateField("company", value)}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-ink font-medium mb-1">Title</label>
            <RichTextInput
              value={item.title}
              onChange={(value) => handleUpdateField("title", value)}
              placeholder="Enter job title"
              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-ink font-medium mb-1">Dates</label>
            <input
              type="text"
              value={item.dates}
              onChange={(e) => handleUpdateField("dates", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-accent-text focus:border-accent transition-all duration-200"
              placeholder="e.g., Jan 2020 - Present"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-ink font-medium mb-1">
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
                              className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
                            />
                          </div>
                          {/* The most-pressed destructive control in the editor,
                              one per bullet. Was a bare ✕ glyph at 29x40, red at
                              rest -- a permanently alarming mark repeated down
                              every job. Now neutral until you reach for it. */}
                          <button
                            onClick={() => handleDescRemove(descIndex)}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink/60 hover:text-red-700 hover:bg-red-50 transition-colors duration-150 flex-shrink-0 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            title="Remove description point"
                            aria-label="Remove description point"
                          >
                            <X className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </SortableItem>
                    ))}
                  </>
                )}
              </ItemDndContext>
            )}
          </div>
          {item.description.length === 0 && (
            <p className="mt-2 text-sm text-ink/60">
              Nothing here yet. One bullet per line: what you did, and what
              changed because of it. Numbers land hardest — "cut invoice errors
              by 30%" beats "improved accuracy".
            </p>
          )}
          {/* .btn-ghost-add, not the accent fill it replaced: adding a bullet is
              a tertiary action, and the old button carried a hover lift the
              editor does not allow. */}
          <button
            type="button"
            onClick={handleDescAdd}
            className="btn-ghost-add mt-3"
          >
            <MdAdd className="text-lg" aria-hidden="true" />
            <span>Add Description Point</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ExperienceItem;
