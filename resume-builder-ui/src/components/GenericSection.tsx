import React, { useState, useEffect } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { RichTextArea } from "./RichTextArea";
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
  const [showHint, setShowHint] = useState(true);

  // Collapse state - default to collapsed on mobile, expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return false;
  });

  useEffect(() => {
    if (section.name.startsWith('New ')) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide hint after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [section.name]);

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Collapse/Expand Button */}
          <button
            onClick={handleToggleCollapse}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            title={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? (
              <MdExpandMore className="text-2xl" />
            ) : (
              <MdExpandLess className="text-2xl" />
            )}
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={temporaryTitle}
                onChange={(e) => setTemporaryTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full text-xl font-semibold"
                autoFocus
              />
              <button
                onClick={onSaveTitle}
                className="text-green-600 hover:text-green-800"
                title="Save Title"
              >
                ✅
              </button>
              <button
                onClick={onCancelTitle}
                className="text-red-600 hover:text-red-800"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <h2 className={`text-xl font-semibold ${
              section.name.startsWith('New ') ? 'text-gray-500 italic' : ''
            }`}>
              {section.name}
              <button
                onClick={onEditTitle}
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Edit Title"
              >
                ✏️
              </button>
              {section.name.startsWith('New ') && showHint && (
                <span className="ml-2 text-sm text-blue-500 font-normal">
                  (Click ✏️ to rename)
                </span>
              )}
            </h2>
          )}
        </div>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
          title="Remove Section"
        >
          Remove
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-4">
          {section.type === "text" && (
            <>
            <MarkdownHint className="mb-2" />
            <RichTextArea
              value={section.content || ""}
              onChange={(value) => handleContentChange(value)}
              placeholder="Enter text..."
              className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
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
                                className="w-full border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 flex-shrink-0"
                              title="Remove Item"
                            >
                              ✕
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
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                                title="Remove Item"
                              >
                                ✕
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
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                                title="Remove Item"
                              >
                                ✕
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
