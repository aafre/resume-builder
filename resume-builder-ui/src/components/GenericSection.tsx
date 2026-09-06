import React, { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { RichTextArea } from "./RichTextArea";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import { SectionEmptyState } from "./shared/SectionEmptyState";
import { MdDelete } from "react-icons/md";

interface Section {
  name: string;
  type?: string;
  content: any;
}

/**
 * What an empty list section teaches. A first-resume writer opening a blank
 * card learns nothing from it, so each list type says what belongs in it and
 * what a good entry looks like. Keyed by section type.
 */
const LIST_EMPTY_COPY: Record<string, { headline: string; hint: string }> = {
  "bulleted-list": {
    headline: "No bullet points yet.",
    hint: 'One point per line. Start with a verb and add a number where you have one — "Cut onboarding from three weeks to five days" beats "Responsible for onboarding".',
  },
  "inline-list": {
    headline: "No items yet.",
    hint: "One skill or tool per item. These print as a single comma-separated line, so keep each one to a word or two.",
  },
  "dynamic-column-list": {
    headline: "No items yet.",
    hint: "One item per line. They lay out in columns on the PDF, so short entries read best.",
  },
};

interface GenericSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
  onDelete: () => void;
  onDeleteEntry?: (index: number) => void; // Callback when entry delete is requested (triggers confirmation)
  onReorderEntry?: (oldIndex: number, newIndex: number) => void; // Callback when entry is reordered via drag-and-drop
  isEditing: boolean;
  temporaryTitle: string;
  setTemporaryTitle: (title: string) => void;
}

const GenericSection: React.FC<GenericSectionProps> = ({
  section,
  onUpdate,
  onEditTitle,
  onSaveTitle,
  onCancelTitle,
  onDelete,
  onDeleteEntry,
  onReorderEntry,
  isEditing,
  temporaryTitle,
  setTemporaryTitle,
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
  const handleContentChange = (value: string | string[], index?: number) => {
    if (Array.isArray(section.content)) {
      const updatedContent = [...section.content];
      if (index !== undefined) {
        updatedContent[index] = value as string;
      } else {
        updatedContent.push(value as string);
      }
      onUpdate({ ...section, content: updatedContent });
    } else {
      onUpdate({ ...section, content: value });
    }
  };

  const handleAddItem = () => {
    const existing = Array.isArray(section.content) ? section.content : [];
    onUpdate({ ...section, content: [...existing, ""] });
  };

  const isEmptyList =
    !Array.isArray(section.content) || section.content.length === 0;
  const emptyCopy = LIST_EMPTY_COPY[section.type ?? ""];

  const handleRemoveItem = (index: number) => {
    if (onDeleteEntry) {
      // Trigger confirmation dialog
      onDeleteEntry(index);
    } else {
      // Fallback: direct delete (backward compatibility)
      const updatedContent = section.content.filter(
        (_: string, i: number) => i !== index
      );
      onUpdate({ ...section, content: updatedContent });
    }
  };

  return (
    <div className="section-card">
      <SectionHeader
        title={section.name}
        isEditing={isEditing}
        temporaryTitle={temporaryTitle}
        onTitleEdit={onEditTitle}
        onTitleSave={onSaveTitle}
        onTitleCancel={onCancelTitle}
        onTitleChange={setTemporaryTitle}
        onDelete={onDelete}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {!isCollapsed && (
        <div className="mt-4">
          {section.type === "text" && (
            <>
            <MarkdownHint className="mb-2" />
            <RichTextArea
              value={section.content || ""}
              onChange={(value) => handleContentChange(value)}
              placeholder="Two or three sentences: what you do, how long you have done it, and what you are looking for next."
              className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
              rows={4}
            />
          </>
        )}
        {/* Bulleted List - Keep original full-width layout */}
        {section.type === "bulleted-list" && (
          <>
            <MarkdownHint className="mb-2" />
            {Array.isArray(section.content) && section.content.length > 0 && (
              <ItemDndContext
                items={section.content}
                sectionId={`bulletedlist-${section.name.replace(/\s+/g, '-').toLowerCase()}`}
                onReorder={(oldIndex, newIndex) => {
                  if (onReorderEntry) {
                    onReorderEntry(oldIndex, newIndex);
                  }
                }}
                getItemInfo={(item: string) => ({
                  label: item.length > 60 ? item.substring(0, 60) + '...' : item || 'Empty item',
                  type: 'generic' as const,
                })}
              >
                {({ itemIds }) => (
                  <>
                    {section.content.map((item: string, index: number) => (
                      <SortableItem key={itemIds[index]} id={itemIds[index]}>
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <RichTextInput
                                value={item}
                                onChange={(value) => handleContentChange(value, index)}
                                placeholder="Add item..."
                                className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-white flex-shrink-0"
                              title="Remove Item"
                              aria-label="Remove item"
                            >
                              <MdDelete className="text-xl" />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </>
                )}
              </ItemDndContext>
            )}
            {isEmptyList && emptyCopy ? (
              <SectionEmptyState
                headline={emptyCopy.headline}
                hint={emptyCopy.hint}
                addLabel="Add Item"
                onAdd={handleAddItem}
              />
            ) : (
              <GhostButton onClick={handleAddItem} className="mt-2">
                Add Item
              </GhostButton>
            )}
          </>
        )}

        {/* Inline List - Compact flex wrap layout */}
        {section.type === "inline-list" && (
          <>
            <MarkdownHint className="mb-2" />
            <div className="space-y-2 mb-4">
              {Array.isArray(section.content) && section.content.length > 0 && (
                <ItemDndContext
                  items={section.content}
                  sectionId={`inlinelist-${section.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onReorder={(oldIndex, newIndex) => {
                    if (onReorderEntry) {
                      onReorderEntry(oldIndex, newIndex);
                    }
                  }}
                  getItemInfo={(item: string) => ({
                    label: item.length > 60 ? item.substring(0, 60) + '...' : item || 'Empty item',
                    type: 'generic' as const,
                  })}
                >
                  {({ itemIds }) => (
                    <>
                      {section.content.map((item: string, index: number) => (
                        <SortableItem key={itemIds[index]} id={itemIds[index]}>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <RichTextInput
                                  value={item}
                                  onChange={(value) => handleContentChange(value, index)}
                                  placeholder="Add skill or item..."
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-white flex-shrink-0"
                                title="Remove Item"
                                aria-label="Remove item"
                              >
                                <MdDelete className="text-xl" />
                              </button>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </>
                  )}
                </ItemDndContext>
              )}
            </div>
            {isEmptyList && emptyCopy ? (
              <SectionEmptyState
                headline={emptyCopy.headline}
                hint={emptyCopy.hint}
                addLabel="Add Item"
                onAdd={handleAddItem}
              />
            ) : (
              <GhostButton onClick={handleAddItem}>Add Item</GhostButton>
            )}
          </>
        )}

        {/* Dynamic Column List - CSS Grid layout */}
        {section.type === "dynamic-column-list" && (
          <>
            <MarkdownHint className="mb-2" />
            <div className="space-y-2 mb-4">
              {Array.isArray(section.content) && section.content.length > 0 && (
                <ItemDndContext
                  items={section.content}
                  sectionId={`dynamiccolumnlist-${section.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onReorder={(oldIndex, newIndex) => {
                    if (onReorderEntry) {
                      onReorderEntry(oldIndex, newIndex);
                    }
                  }}
                  getItemInfo={(item: string) => ({
                    label: item.length > 60 ? item.substring(0, 60) + '...' : item || 'Empty item',
                    type: 'generic' as const,
                  })}
                >
                  {({ itemIds }) => (
                    <>
                      {section.content.map((item: string, index: number) => (
                        <SortableItem key={itemIds[index]} id={itemIds[index]}>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <RichTextInput
                                  value={item}
                                  onChange={(value) => handleContentChange(value, index)}
                                  placeholder="Add item..."
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-accent-text focus-within:border-accent transition-all duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-white flex-shrink-0"
                                title="Remove Item"
                                aria-label="Remove item"
                              >
                                <MdDelete className="text-xl" />
                              </button>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </>
                  )}
                </ItemDndContext>
              )}
            </div>
            {isEmptyList && emptyCopy ? (
              <SectionEmptyState
                headline={emptyCopy.headline}
                hint={emptyCopy.hint}
                addLabel="Add Item"
                onAdd={handleAddItem}
              />
            ) : (
              <GhostButton onClick={handleAddItem}>Add Item</GhostButton>
            )}
          </>
        )}
        </div>
      )}
    </div>
  );
};

export default GenericSection;
