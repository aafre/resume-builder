import React, { useMemo } from 'react';
import { Section, IconListItem } from '../../types';
import { EditorContentIconRegistry } from './EditorContent';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import GenericSection from '../GenericSection';
import IconListSection from '../IconListSection';

interface SectionManagementProps {
  editingTitleIndex: number | null;
  temporaryTitle: string;
  setTemporaryTitle: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateSection: (index: number, updatedSection: Section) => void;
  handleDeleteSection: (index: number) => void;
  handleDeleteEntry: (sectionIndex: number, entryIndex: number) => void;
  handleReorderEntry: (sectionIndex: number, oldIndex: number, newIndex: number) => void;
  handleTitleEdit: (index: number) => void;
  handleTitleSave: () => void;
  handleTitleCancel: () => void;
}

interface SectionRendererProps {
  section: Section;
  index: number;
  sectionManagement: SectionManagementProps;
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
}

const SectionRenderer: React.FC<SectionRendererProps> = React.memo(({
  section,
  index,
  sectionManagement,
  supportsIcons,
  iconRegistry,
}) => {
  // Create stable callbacks for this specific section index
  const {
    handleUpdateSection,
    handleTitleEdit,
    handleTitleSave,
    handleTitleCancel,
    handleDeleteSection,
    handleDeleteEntry,
    handleReorderEntry,
    editingTitleIndex,
    temporaryTitle,
    setTemporaryTitle,
  } = sectionManagement;

  // Stable callbacks using the stable functions from sectionManagement
  const onTitleEdit = useMemo(() => () => handleTitleEdit(index), [handleTitleEdit, index]);
  const onDelete = useMemo(() => () => handleDeleteSection(index), [handleDeleteSection, index]);
  const onDeleteEntry = useMemo(() => (entryIndex: number) => handleDeleteEntry(index, entryIndex), [handleDeleteEntry, index]);
  const onReorder = useMemo(() => (oldIndex: number, newIndex: number) => handleReorderEntry(index, oldIndex, newIndex), [handleReorderEntry, index]);

  const isEditingTitle = editingTitleIndex === index;

  if (isExperienceSection(section)) {
    return (
      <ExperienceSection
        sectionName={section.name}
        experiences={section.content}
        onUpdate={(updatedExperiences) =>
          handleUpdateSection(index, {
            ...section,
            content: updatedExperiences,
          } as Section)
        }
        onTitleEdit={onTitleEdit}
        onTitleSave={handleTitleSave}
        onTitleCancel={handleTitleCancel}
        onDelete={onDelete}
        onDeleteEntry={onDeleteEntry}
        onReorderEntry={onReorder}
        isEditingTitle={isEditingTitle}
        temporaryTitle={temporaryTitle}
        setTemporaryTitle={setTemporaryTitle}
        supportsIcons={supportsIcons}
        iconRegistry={iconRegistry}
      />
    );
  } else if (isEducationSection(section)) {
    return (
      <EducationSection
        sectionName={section.name}
        education={section.content}
        onUpdate={(updatedEducation) =>
          handleUpdateSection(index, {
            ...section,
            content: updatedEducation,
          } as Section)
        }
        onTitleEdit={onTitleEdit}
        onTitleSave={handleTitleSave}
        onTitleCancel={handleTitleCancel}
        onDelete={onDelete}
        onDeleteEntry={onDeleteEntry}
        onReorderEntry={onReorder}
        isEditingTitle={isEditingTitle}
        temporaryTitle={temporaryTitle}
        setTemporaryTitle={setTemporaryTitle}
        supportsIcons={supportsIcons}
        iconRegistry={iconRegistry}
      />
    );
  } else if (section.type === 'icon-list') {
    return (
      <IconListSection
        data={section.content as IconListItem[]}
        onUpdate={(updatedContent) =>
          handleUpdateSection(index, {
            ...section,
            content: updatedContent,
          } as Section)
        }
        onDelete={onDelete}
        onDeleteEntry={onDeleteEntry}
        onReorderEntry={onReorder}
        sectionName={section.name}
        onEditTitle={onTitleEdit}
        onSaveTitle={handleTitleSave}
        onCancelTitle={handleTitleCancel}
        isEditing={isEditingTitle}
        temporaryTitle={temporaryTitle}
        setTemporaryTitle={setTemporaryTitle}
        iconRegistry={iconRegistry}
      />
    );
  } else {
    return (
      <GenericSection
        section={section}
        onUpdate={(updatedSection) =>
          handleUpdateSection(index, updatedSection)
        }
        onEditTitle={onTitleEdit}
        onSaveTitle={handleTitleSave}
        onCancelTitle={handleTitleCancel}
        onDelete={onDelete}
        onDeleteEntry={onDeleteEntry}
        onReorderEntry={onReorder}
        isEditing={isEditingTitle}
        temporaryTitle={temporaryTitle}
        setTemporaryTitle={setTemporaryTitle}
      />
    );
  }
});

export default SectionRenderer;
