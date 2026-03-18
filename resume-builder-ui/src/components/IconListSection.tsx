import React, { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import IconManager from "./IconManager";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";

interface Certification {
  certification: string;
  issuer: string;
  date: string;
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

interface IconListSectionProps {
  data: Certification[];
  onUpdate: (updatedData: Certification[]) => void;
  onDelete?: () => void;
  onDeleteEntry?: (index: number) => void; // Callback when entry delete is requested (triggers confirmation)
  onReorderEntry?: (oldIndex: number, newIndex: number) => void; // Callback when entry is reordered via drag-and-drop
  sectionName?: string;
  onEditTitle?: () => void;
  onSaveTitle?: () => void;
  onCancelTitle?: () => void;
  isEditing?: boolean;
  temporaryTitle?: string;
  setTemporaryTitle?: (title: string) => void;
  iconRegistry?: IconRegistryMethods;
}

const IconListSection: React.FC<IconListSectionProps> = ({
  data,
  onUpdate,
  onDelete,
  onDeleteEntry,
  onReorderEntry,
  sectionName = "Certifications",
  onEditTitle,
  onSaveTitle,
  onCancelTitle,
  isEditing = false,
  temporaryTitle = "",
  setTemporaryTitle,
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
  const handleUpdateItem = (
    index: number,
    field: keyof Certification,
    value: string | File | null
  ) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    onUpdate(updatedData);
  };

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedData);
  };

  const handleAddItem = () => {
    const newItem: Certification = {
      certification: "",
      issuer: "",
      date: "",
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdate([...data, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (onDeleteEntry) {
      // Trigger confirmation dialog
      onDeleteEntry(index);
    } else {
      // Fallback: direct delete (backward compatibility)
      const updatedData = data.filter((_, i) => i !== index);
      onUpdate(updatedData);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <SectionHeader
        title={sectionName}
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
      {!isCollapsed && data.length > 0 && (
        <ItemDndContext
          items={data}
          sectionId={`iconlist-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
          onReorder={(oldIndex, newIndex) => {
            if (onReorderEntry) {
              onReorderEntry(oldIndex, newIndex);
            }
          }}
          getItemInfo={(item) => ({
            label: item.certification || 'Untitled Certification',
            sublabel: item.issuer || undefined,
            type: 'certification' as const,
          })}
        >
          {({ itemIds }) => (
            <>
              {data.map((item, index) => (
                <SortableItem key={itemIds[index]} id={itemIds[index]}>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
                    <div>
                      {iconRegistry && (
                        <div className="mb-4">
                          <IconManager
                            value={item.icon || null}
                            onChange={(filename, file) => handleIconChange(index, filename, file)}
                            registerIcon={iconRegistry.registerIcon}
                            getIconFile={iconRegistry.getIconFile}
                            removeIcon={iconRegistry.removeIcon}
                          />
                        </div>
                      )}
                      <div>
                        <MarkdownHint className="mb-2" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Certification
                            </label>
                            <RichTextInput
                              value={item.certification}
                              onChange={(value) =>
                                handleUpdateItem(index, "certification", value)
                              }
                              placeholder="e.g., AWS Certified Solutions Architect"
                              className="w-full border border-gray-300 rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Issuer
                            </label>
                            <RichTextInput
                              value={item.issuer}
                              onChange={(value) => handleUpdateItem(index, "issuer", value)}
                              placeholder="e.g., Amazon Web Services"
                              className="w-full border border-gray-300 rounded-lg p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Date
                            </label>
                            <RichTextInput
                              value={item.date}
                              onChange={(value) => handleUpdateItem(index, "date", value)}
                              placeholder="e.g., 2024"
                              className="w-full border border-gray-300 rounded-lg p-2"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Certification"
                            aria-label="Remove certification"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
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
        <GhostButton onClick={handleAddItem}>
          Add Item
        </GhostButton>
      )}
    </div>
  );
};

export default IconListSection;
