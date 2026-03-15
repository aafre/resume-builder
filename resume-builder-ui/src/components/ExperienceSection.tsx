import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import ItemDndContext from "./ItemDndContext";
import SortableItem from "./SortableItem";
import { GhostButton } from "./shared/GhostButton";
import ExperienceItem, { ExperienceItemData, IconRegistryMethods } from "./ExperienceItem";
import { arrayMove } from "@dnd-kit/sortable";

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

  // Use ref to hold the latest experiences so callbacks don't need to change
  const experiencesRef = useRef(experiences);
  useLayoutEffect(() => {
    experiencesRef.current = experiences;
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

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleUpdateField = useCallback((index: number, field: keyof ExperienceItemData, value: string) => {
    const updatedExperiences = [...experiencesRef.current];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleIconChange = useCallback((index: number, filename: string | null, file: File | null) => {
    const updatedExperiences = [...experiencesRef.current];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      icon: filename,
      iconFile: file,
      iconBase64: null,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleDeleteEntryCallback = useCallback((index: number) => {
    if (onDeleteEntry) {
      onDeleteEntry(index);
    } else {
      const updatedExperiences = [...experiencesRef.current];
      updatedExperiences.splice(index, 1);
      onUpdate(updatedExperiences);
    }
  }, [onDeleteEntry, onUpdate]);

  const handleReorderDescription = useCallback((index: number, oldDescIndex: number, newDescIndex: number) => {
    const updatedExperiences = [...experiencesRef.current];
    const reorderedDescriptions = arrayMove(
      updatedExperiences[index].description,
      oldDescIndex,
      newDescIndex
    );
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      description: reorderedDescriptions,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleUpdateDescription = useCallback((index: number, descIndex: number, value: string) => {
    const updatedExperiences = [...experiencesRef.current];
    const newDescription = [...updatedExperiences[index].description];
    newDescription[descIndex] = value;
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      description: newDescription,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleDeleteDescription = useCallback((index: number, descIndex: number) => {
    const updatedExperiences = [...experiencesRef.current];
    const newDescription = [...updatedExperiences[index].description];
    newDescription.splice(descIndex, 1);
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      description: newDescription,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

  const handleAddDescription = useCallback((index: number) => {
    const updatedExperiences = [...experiencesRef.current];
    const newDescription = [...updatedExperiences[index].description, ""];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      description: newDescription,
    };
    onUpdate(updatedExperiences);
  }, [onUpdate]);

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
                    experience={experience}
                    index={index}
                    sectionName={sectionName}
                    supportsIcons={supportsIcons}
                    iconRegistry={iconRegistry}
                    onUpdateField={handleUpdateField}
                    onIconChange={handleIconChange}
                    onDeleteEntry={handleDeleteEntryCallback}
                    onReorderDescription={handleReorderDescription}
                    onUpdateDescription={handleUpdateDescription}
                    onDeleteDescription={handleDeleteDescription}
                    onAddDescription={handleAddDescription}
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
