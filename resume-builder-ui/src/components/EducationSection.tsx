import React, { useState, useEffect, useCallback, useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import EducationItemComponent, { EducationItemData } from "./EducationItem";

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationSectionProps {
  sectionName: string; // Custom section title
  education: EducationItemData[];
  onUpdate: (updatedEducation: EducationItemData[]) => void;
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

  // Use a ref for the latest onUpdate to prevent re-creating handleUpdateItem
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Use a ref for the latest education to prevent re-creating handleUpdateItem
  const educationRef = useRef(education);
  useEffect(() => {
    educationRef.current = education;
  }, [education]);

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

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleUpdateItem = useCallback((index: number, updatedItem: EducationItemData) => {
    const updatedEducation = [...educationRef.current];
    updatedEducation[index] = updatedItem;
    onUpdateRef.current(updatedEducation);
  }, []);

  const handleDirectDelete = useCallback((index: number) => {
    const updatedEducation = [...educationRef.current];
    updatedEducation.splice(index, 1);
    onUpdateRef.current(updatedEducation);
  }, []);

  const handleAddItem = useCallback(() => {
    const newEducation: EducationItemData = {
      degree: "",
      school: "",
      year: "",
      field_of_study: "",
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdateRef.current([...educationRef.current, newEducation]);
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
                    education={item}
                    index={index}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                    onUpdate={handleUpdateItem}
                    onDeleteEntry={onDeleteEntry}
                    onDirectDelete={handleDirectDelete}
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
