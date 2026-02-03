import React, { useState, useEffect, useRef, useCallback } from "react";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import EducationItemComponent from "./EducationItem";

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

  // Refs for stable callbacks
  const educationRef = useRef(education);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteEntryRef = useRef(onDeleteEntry);

  // Update refs when props change
  useEffect(() => {
    educationRef.current = education;
  }, [education]);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    onDeleteEntryRef.current = onDeleteEntry;
  }, [onDeleteEntry]);

  const handleUpdateItem = useCallback((
    index: number,
    key: keyof EducationItem,
    value: string | File | null
  ) => {
    const currentEducation = educationRef.current;
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = { ...updatedEducation[index], [key]: value };
    if (onUpdateRef.current) {
      onUpdateRef.current(updatedEducation);
    }
  }, []);

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

  const handleRemoveItem = useCallback((index: number) => {
    if (onDeleteEntryRef.current) {
      // Trigger confirmation dialog
      onDeleteEntryRef.current(index);
    } else {
      // Fallback: direct delete (backward compatibility)
      const currentEducation = educationRef.current;
      const updatedEducation = [...currentEducation];
      updatedEducation.splice(index, 1);
      if (onUpdateRef.current) {
        onUpdateRef.current(updatedEducation);
      }
    }
  }, []);

  // Handle icon changes from IconManager
  const handleIconChange = useCallback((index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const currentEducation = educationRef.current;
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    if (onUpdateRef.current) {
      onUpdateRef.current(updatedEducation);
    }
  }, []);

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
          getItemInfo={(item) => ({
            label: item.school || 'Untitled School',
            sublabel: item.degree || undefined,
            type: 'education' as const,
          })}
        >
          {({ itemIds }) => (
            <>
              {education.map((item, index) => (
                <SortableItem key={itemIds[index]} id={itemIds[index]}>
                  <EducationItemComponent
                    item={item}
                    index={index}
                    onUpdate={handleUpdateItem}
                    onRemove={handleRemoveItem}
                    onIconChange={handleIconChange}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                  />
                </SortableItem>
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {!isCollapsed && (
        <GhostButton onClick={handleAddItem} className="mt-4">
          Add Entry
        </GhostButton>
      )}
    </div>
  );
};

export default EducationSection;
