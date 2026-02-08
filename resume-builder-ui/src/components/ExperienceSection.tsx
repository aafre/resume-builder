import React, { useState, useEffect, useRef, useCallback } from "react";
import { SectionHeader } from "./SectionHeader";
import ItemDndContext from "./ItemDndContext";
import { GhostButton } from "./shared/GhostButton";
import ExperienceItem from "./ExperienceItem";

interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
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

interface ExperienceSectionProps {
  sectionName: string; // Custom section title
  experiences: ExperienceItem[];
  onUpdate: (updatedExperiences: ExperienceItem[]) => void;
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

  // Keep track of latest experiences in a ref to avoid unstable callbacks
  const experiencesRef = useRef(experiences);
  experiencesRef.current = experiences;

  // Stable callback for updating a single item
  const handleUpdateItem = useCallback((index: number, updatedItem: ExperienceItem) => {
    const currentExperiences = experiencesRef.current;
    const newExperiences = [...currentExperiences];
    newExperiences[index] = updatedItem;
    onUpdate(newExperiences);
  }, [onUpdate]);

  // Stable callback for deleting a single item
  const handleDeleteItem = useCallback((index: number) => {
    if (onDeleteEntry) {
      onDeleteEntry(index);
    } else {
      const currentExperiences = experiencesRef.current;
      const newExperiences = [...currentExperiences];
      newExperiences.splice(index, 1);
      onUpdate(newExperiences);
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
                <ExperienceItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  experience={experience}
                  index={index}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  supportsIcons={supportsIcons}
                  iconRegistry={iconRegistry}
                  sectionId={`experience-${sectionName.replace(/\s+/g, '-').toLowerCase()}`}
                />
              ))}
            </>
          )}
        </ItemDndContext>
      )}
      {!isCollapsed && (
        <GhostButton
          onClick={() => {
            const newExperience: ExperienceItem = {
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
