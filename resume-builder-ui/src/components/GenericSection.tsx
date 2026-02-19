import React, { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { RichTextArea } from "./RichTextArea";
import { MdClose } from "react-icons/md";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";

interface Section {
  name: string;
  type?: string;
  content: any;
}

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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
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
              placeholder="Enter text..."
              className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
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
                                className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 flex-shrink-0 p-1 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove Item"
                              aria-label="Remove Item"
                            >
                              <MdClose className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </>
                )}
              </ItemDndContext>
            )}
            <GhostButton
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="mt-2"
            >
              Add Item
            </GhostButton>
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
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm flex-shrink-0 p-1 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove Item"
                                aria-label="Remove Item"
                              >
                                <MdClose className="text-lg" />
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
            <GhostButton
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
            >
              Add Item
            </GhostButton>
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
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm flex-shrink-0 p-1 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove Item"
                                aria-label="Remove Item"
                              >
                                <MdClose className="text-lg" />
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
            <GhostButton
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
            >
              Add Item
            </GhostButton>
          </>
        )}
        </div>
      )}
    </div>
  );
};

export default GenericSection;
