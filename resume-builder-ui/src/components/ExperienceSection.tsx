import React, { useState, useEffect, useCallback, useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import ExperienceItem, { ExperienceItemData, IconRegistryMethods } from "./ExperienceItem";

interface ExperienceSectionProps {
  sectionName: string; // Custom section title
  experiences: ExperienceItemData[];
  onUpdate: (updatedExperiences: ExperienceItemData[]) => void;
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

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  sectionName,
  experiences,
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

  // Keep a ref to experiences to access latest state in stable callbacks
  const experiencesRef = useRef(experiences);
  useEffect(() => {
    experiencesRef.current = experiences;
  }, [experiences]);

  const handleUpdateItem = useCallback((
    index: number,
    field: keyof ExperienceItemData,
    value: any
  ) => {
    const currentExperiences = experiencesRef.current;
    const updatedExperiences = [...currentExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleIconChange = useCallback((index: number, filename: string | null, file: File | null) => {
    const currentExperiences = experiencesRef.current;
    const updatedExperiences = [...currentExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleRemoveItem = useCallback((index: number) => {
    if (onDeleteEntry) {
      onDeleteEntry(index);
    } else {
      const currentExperiences = experiencesRef.current;
      const updatedExperiences = [...currentExperiences];
      updatedExperiences.splice(index, 1);
      onUpdate(updatedExperiences);
    }
  }, [onDeleteEntry, onUpdate]);

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
      {!isCollapsed && (
        <ItemDndContext
          items={experiences}
          sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
          onReorder={(oldIndex, newIndex) => {
            if (onReorderEntry) {
              onReorderEntry(oldIndex, newIndex);
            }
          }}
          getItemInfo={(item) => ({
            label: item.company || 'Untitled Company',
            sublabel: item.title || undefined,
            type: 'experience' as const,
          })}
        >
          {({ itemIds }) => (
            <>
              {experiences.map((experience, index) => (
                <SortableItem key={itemIds[index]} id={itemIds[index]}>
                  <ExperienceItem
                    index={index}
                    experience={experience}
                    onUpdate={handleUpdateItem}
                    onDelete={handleRemoveItem}
                    onIconChange={handleIconChange}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                    sectionIdPrefix={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                </SortableItem>
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {!isCollapsed && (
        <GhostButton
          onClick={() => {
            const newExperience: ExperienceItemData = {
              company: "",
              title: "",
              dates: "",
              description: [],
              icon: null,
              iconFile: null,
              iconBase64: null,
            };
            onUpdate([...experiences, newExperience]);
          }}
        >
          Add Experience
        </GhostButton>
      )}
    </div>
  );
};

export default ExperienceSection;
