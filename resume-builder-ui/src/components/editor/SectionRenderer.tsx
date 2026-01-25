import React, { useCallback } from 'react';
import { Section, IconListItem } from '../../types';
import { EditorContentIconRegistry } from './EditorContent';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import GenericSection from '../GenericSection';
import IconListSection from '../IconListSection';

interface SectionRendererProps {
  section: Section;
  index: number;

  // Stable handlers
  handleUpdateSection: (index: number, updatedSection: Section) => void;
  handleDeleteSection: (index: number) => void;
  handleDeleteEntry: (sectionIndex: number, entryIndex: number) => void;
  handleReorderEntry: (sectionIndex: number, oldIndex: number, newIndex: number) => void;
  handleTitleEdit: (index: number) => void;
  handleTitleSave: (newTitle?: string) => void;
  handleTitleCancel: () => void;

  // State
  isEditingTitle: boolean;
  temporaryTitle: string;
  setTemporaryTitle: React.Dispatch<React.SetStateAction<string>>;

  // Config
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
}

const SectionRenderer: React.FC<SectionRendererProps> = React.memo(({
  section,
  index,
  handleUpdateSection,
  handleDeleteSection,
  handleDeleteEntry,
  handleReorderEntry,
  handleTitleEdit,
  handleTitleSave,
  handleTitleCancel,
  isEditingTitle,
  temporaryTitle,
  setTemporaryTitle,
  supportsIcons,
  iconRegistry,
}) => {
  // Create stable callbacks for this specific section index
  // These use only stable props (handlers and index), so they remain stable across renders

  const onTitleEdit = useCallback(() => handleTitleEdit(index), [handleTitleEdit, index]);
  const onDelete = useCallback(() => handleDeleteSection(index), [handleDeleteSection, index]);

  const onDeleteEntry = useCallback((entryIndex: number) => {
    handleDeleteEntry(index, entryIndex);
  }, [handleDeleteEntry, index]);

  const onReorder = useCallback((oldIndex: number, newIndex: number) => {
    handleReorderEntry(index, oldIndex, newIndex);
  }, [handleReorderEntry, index]);

  const onUpdate = useCallback((updatedContent: any) => {
    // Note: We use the function form of handleUpdateSection if possible, but here we construct the new section
    // 'section' dependency here is necessary.
    // This callback will update when 'section' updates, which is correct (self-update).
    // It will remain stable if 'section' is stable (other sections updating).
    handleUpdateSection(index, { ...section, content: updatedContent } as Section);
  }, [handleUpdateSection, index, section]);

  const onGenericUpdate = useCallback((updatedSection: Section) => {
    handleUpdateSection(index, updatedSection);
  }, [handleUpdateSection, index]);

  if (isExperienceSection(section)) {
    return (
      <ExperienceSection
        sectionName={section.name}
        experiences={section.content}
        onUpdate={onUpdate}
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
        onUpdate={onUpdate}
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
        onUpdate={onUpdate}
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
        onUpdate={onGenericUpdate}
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
