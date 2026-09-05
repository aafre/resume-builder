import React, { useState, useEffect, useCallback, useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import { MarkdownHint } from "./MarkdownLinkPreview";
import ItemDndContext from "./ItemDndContext";
import { GhostButton } from "./shared/GhostButton";
import { SectionEmptyState } from "./shared/SectionEmptyState";
import EducationItem, { EducationItemData, EducationItemValue, IconRegistryMethods } from "./EducationItem";

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

  // Keep a ref to education data for stable callbacks
  const educationRef = useRef(education);
  educationRef.current = education;

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

  const handleUpdateItemStable = useCallback((
    index: number,
    key: keyof EducationItemData,
    value: EducationItemValue
  ) => {
    const currentEducation = educationRef.current;
    const updatedEducation = [...currentEducation];
    // Cast to any to allow dynamic assignment with union type value
    updatedEducation[index] = { ...updatedEducation[index], [key]: value };
    onUpdate(updatedEducation);
  }, [onUpdate]);

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
    onUpdate([...educationRef.current, newEducation]);
  }, [onUpdate]);

  const handleRemoveItemStable = useCallback((index: number) => {
    if (onDeleteEntry) {
      // Trigger confirmation dialog
      onDeleteEntry(index);
    } else {
      // Fallback: direct delete (backward compatibility)
      const currentEducation = educationRef.current;
      const updatedEducation = [...currentEducation];
      updatedEducation.splice(index, 1);
      onUpdate(updatedEducation);
    }
  }, [onDeleteEntry, onUpdate]);

  // Handle icon changes from IconManager
  const handleIconChangeStable = useCallback((index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const currentEducation = educationRef.current;
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedEducation);
  }, [onUpdate]);

  return (
    <div className="section-card">
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
      {!isCollapsed && education.length > 0 && <MarkdownHint className="mb-4" />}
      {!isCollapsed && education.length === 0 && (
        <SectionEmptyState
          headline="No education yet."
          hint="Add a degree, diploma or course — the school, what you studied, and the year you finished. Still studying? Put your expected year."
          addLabel="Add Entry"
          onAdd={handleAddItem}
        />
      )}
      {!isCollapsed && education.length > 0 && (
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
                <EducationItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  index={index}
                  data={item}
                  onChange={handleUpdateItemStable}
                  onIconChange={handleIconChangeStable}
                  onRemove={handleRemoveItemStable}
                  supportsIcons={supportsIcons}
                  iconRegistry={iconRegistry}
                />
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {/* The empty state carries its own add control, so this one stands down
          while the section is empty — never two "add" buttons on one card. */}
      {!isCollapsed && education.length > 0 && (
        <GhostButton onClick={handleAddItem} className="mt-4">
          Add Entry
        </GhostButton>
      )}
    </div>
  );
};

export default EducationSection;
