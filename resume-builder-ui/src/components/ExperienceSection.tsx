import React, { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import { SectionEmptyState } from "./shared/SectionEmptyState";
import ExperienceItem, { ExperienceItemData } from "./ExperienceItem";

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

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

  const experiencesRef = React.useRef(experiences);
  React.useEffect(() => {
    experiencesRef.current = experiences;
  }, [experiences]);

  const handleUpdateItem = React.useCallback((index: number, updatedItem: ExperienceItemData) => {
    const updatedExperiences = [...experiencesRef.current];
    updatedExperiences[index] = updatedItem;
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleDeleteItem = React.useCallback((index: number) => {
    if (onDeleteEntry) {
      onDeleteEntry(index);
    } else {
      const updatedExperiences = [...experiencesRef.current];
      updatedExperiences.splice(index, 1);
      onUpdate(updatedExperiences);
    }
  }, [onUpdate, onDeleteEntry]);

  const handleAddItem = React.useCallback(() => {
    const newExperience: ExperienceItemData = {
      company: "",
      title: "",
      dates: "",
      description: [],
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdate([...experiencesRef.current, newExperience]);
  }, [onUpdate]);

  const isEmpty = experiences.length === 0;

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
      {!isCollapsed && isEmpty && (
        <SectionEmptyState
          headline="No roles yet."
          hint="Add a job, internship, placement or volunteer role. Each one takes a company, a title, dates, and a few bullet points on what you actually did."
          addLabel="Add Experience"
          onAdd={handleAddItem}
        />
      )}
      {!isCollapsed && !isEmpty && (
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
                    item={experience}
                    index={index}
                    sectionName={sectionName}
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
      {/* The empty state carries its own add control, so this one stands down
          while the section is empty — never two "add" buttons on one card. */}
      {!isCollapsed && !isEmpty && (
        <GhostButton onClick={handleAddItem}>Add Experience</GhostButton>
      )}
    </div>
  );
};

export default ExperienceSection;
