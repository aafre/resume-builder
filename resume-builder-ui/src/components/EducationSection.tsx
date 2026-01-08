import React, { useState, useEffect } from "react";
import IconManager from "./IconManager";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
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

interface EducationSectionProps {
  sectionName: string; // Custom section title
  education: EducationItem[];
  onUpdate: (updatedEducation: EducationItem[]) => void;
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

const EducationSection: React.FC<EducationSectionProps> = ({
  sectionName,
  education,
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

  const handleUpdateItem = (
    index: number,
    key: keyof EducationItem,
    value: string | File | null
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [key]: value };
    onUpdate(updatedEducation);
  };

  const handleAddItem = () => {
    const newEducation: EducationItem = {
      degree: "",
      school: "",
      year: "",
      field_of_study: "",
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdate([...education, newEducation]);
  };

  const handleRemoveItem = (index: number) => {
    if (onDeleteEntry) {
      // Trigger confirmation dialog
      onDeleteEntry(index);
    } else {
      // Fallback: direct delete (backward compatibility)
      const updatedEducation = [...education];
      updatedEducation.splice(index, 1);
      onUpdate(updatedEducation);
    }
  };

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedEducation);
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
      {!isCollapsed && <MarkdownHint className="mb-4" />}
      {!isCollapsed && (
        <ItemDndContext
          items={education}
          sectionId={`education-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
          onReorder={(oldIndex, newIndex) => {
            if (onReorderEntry) {
              onReorderEntry(oldIndex, newIndex);
            }
          }}
        >
          {({ itemIds }) => (
            <>
              {education.map((item, index) => (
                <SortableItem key={itemIds[index]} id={itemIds[index]}>
                  <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete education entry"
                        title="Delete this entry"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                    <div className="mt-4">
                      {supportsIcons && iconRegistry && (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Degree
                          </label>
                          <RichTextInput
                            value={item.degree}
                            onChange={(value) => handleUpdateItem(index, "degree", value)}
                            placeholder="e.g., Bachelor of Science"
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            School
                          </label>
                          <RichTextInput
                            value={item.school}
                            onChange={(value) => handleUpdateItem(index, "school", value)}
                            placeholder="e.g., University Name"
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) =>
                              handleUpdateItem(index, "year", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">
                            Field of Study
                          </label>
                          <RichTextInput
                            value={item.field_of_study || ""}
                            onChange={(value) => handleUpdateItem(index, "field_of_study", value)}
                            placeholder="e.g., Computer Science"
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
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
        <button
          onClick={handleAddItem}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-4"
        >
          Add Entry
        </button>
      )}
    </div>
  );
};

export default EducationSection;
