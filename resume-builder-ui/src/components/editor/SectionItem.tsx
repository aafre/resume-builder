import React, { memo, useCallback } from 'react';
import { Section, IconListItem } from '../../types';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import GenericSection from '../GenericSection';
import IconListSection from '../IconListSection';
import DragHandle from '../DragHandle';
import { EditorContentIconRegistry, EditorContentSectionManagementProps } from '../../types/editor';

export interface SectionItemProps {
  section: Section;
  index: number;
  sectionManagement: EditorContentSectionManagementProps;
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
  setSectionRef: (index: number, el: HTMLDivElement | null) => void;
}

const SectionItem: React.FC<SectionItemProps> = memo(({
  section,
  index,
  sectionManagement,
  setSectionRef,
  supportsIcons,
  iconRegistry
}) => {
  const {
    editingTitleIndex,
    temporaryTitle,
    setTemporaryTitle,
    handleUpdateSection,
    handleDeleteSection,
    handleDeleteEntry,
    handleReorderEntry,
    handleTitleEdit,
    handleTitleSave,
    handleTitleCancel
  } = sectionManagement;

  // Memoized handlers
  const onUpdate = useCallback((updatedContent: Section['content']) => {
    handleUpdateSection(index, { ...section, content: updatedContent } as Section);
  }, [handleUpdateSection, index, section]);

  const onUpdateGeneric = useCallback((updatedSection: Section) => {
    handleUpdateSection(index, updatedSection);
  }, [handleUpdateSection, index]);

  const onDelete = useCallback(() => {
    handleDeleteSection(index);
  }, [handleDeleteSection, index]);

  const onDeleteEntryCallback = useCallback((entryIndex: number) => {
    handleDeleteEntry(index, entryIndex);
  }, [handleDeleteEntry, index]);

  const onReorderEntryCallback = useCallback((oldIndex: number, newIndex: number) => {
    handleReorderEntry(index, oldIndex, newIndex);
  }, [handleReorderEntry, index]);

  const onTitleEditCallback = useCallback(() => {
    handleTitleEdit(index);
  }, [handleTitleEdit, index]);


  if (isExperienceSection(section)) {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={(el) => setSectionRef(index, el)}>
          <ExperienceSection
            sectionName={section.name}
            experiences={section.content}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUpdate={onUpdate as any}
            onTitleEdit={onTitleEditCallback}
            onTitleSave={handleTitleSave}
            onTitleCancel={handleTitleCancel}
            onDelete={onDelete}
            onDeleteEntry={onDeleteEntryCallback}
            onReorderEntry={onReorderEntryCallback}
            isEditingTitle={editingTitleIndex === index}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
            supportsIcons={supportsIcons}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else if (isEducationSection(section)) {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={(el) => setSectionRef(index, el)}>
          <EducationSection
            sectionName={section.name}
            education={section.content}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUpdate={onUpdate as any}
            onTitleEdit={onTitleEditCallback}
            onTitleSave={handleTitleSave}
            onTitleCancel={handleTitleCancel}
            onDelete={onDelete}
            onDeleteEntry={onDeleteEntryCallback}
            onReorderEntry={onReorderEntryCallback}
            isEditingTitle={editingTitleIndex === index}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
            supportsIcons={supportsIcons}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else if (section.type === 'icon-list') {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={(el) => setSectionRef(index, el)}>
          <IconListSection
            data={section.content as IconListItem[]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUpdate={onUpdate as any}
            onDelete={onDelete}
            onDeleteEntry={onDeleteEntryCallback}
            onReorderEntry={onReorderEntryCallback}
            sectionName={section.name}
            onEditTitle={onTitleEditCallback}
            onSaveTitle={handleTitleSave}
            onCancelTitle={handleTitleCancel}
            isEditing={editingTitleIndex === index}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={(el) => setSectionRef(index, el)}>
          <GenericSection
            section={section}
            onUpdate={onUpdateGeneric}
            onEditTitle={onTitleEditCallback}
            onSaveTitle={handleTitleSave}
            onCancelTitle={handleTitleCancel}
            onDelete={onDelete}
            onDeleteEntry={onDeleteEntryCallback}
            onReorderEntry={onReorderEntryCallback}
            isEditing={editingTitleIndex === index}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
          />
        </div>
      </DragHandle>
    );
  }
});

export default SectionItem;
