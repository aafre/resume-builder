import React, { useState, useEffect, useRef, useCallback } from "react";
import { SectionHeader } from "./SectionHeader";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import ExperienceItem, { ExperienceItemData } from "./ExperienceItem";

// Use ExperienceItemData from the component file for consistency
// But alias it to ExperienceItem if needed for props interface compatibility
type ExperienceItemType = ExperienceItemData;

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface ExperienceSectionProps {
  sectionName: string; // Custom section title
  experiences: ExperienceItemType[];
  onUpdate: (updatedExperiences: ExperienceItemType[]) => void;
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

  // Refs for stable callbacks
  const experiencesRef = useRef(experiences);
  experiencesRef.current = experiences;

  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const onDeleteEntryRef = useRef(onDeleteEntry);
  onDeleteEntryRef.current = onDeleteEntry;

  const handleUpdateItem = useCallback((index: number, partial: Partial<ExperienceItemData>) => {
    const currentExperiences = experiencesRef.current;
    const updatedExperiences = [...currentExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      ...partial,
    };
    onUpdateRef.current(updatedExperiences);
  }, []);

  const handleDeleteItem = useCallback((index: number) => {
    if (onDeleteEntryRef.current) {
      onDeleteEntryRef.current(index);
    } else {
      const updatedExperiences = [...experiencesRef.current];
      updatedExperiences.splice(index, 1);
      onUpdateRef.current(updatedExperiences);
    }
  }, []);

  const handleAddExperience = () => {
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
                    data={experience}
                    sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                </SortableItem>
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {!isCollapsed && (
        <GhostButton onClick={handleAddExperience}>
          Add Experience
        </GhostButton>
      )}
    </div>
  );
};

export default ExperienceSection;
