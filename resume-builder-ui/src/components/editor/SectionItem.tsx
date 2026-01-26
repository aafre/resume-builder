import React, { memo, useCallback } from 'react';
import { Section, IconListItem } from '../../types';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import GenericSection from '../GenericSection';
import IconListSection from '../IconListSection';
import DragHandle from '../DragHandle';
import { EditorContentSectionManagementProps, EditorContentIconRegistry, EditorContentRefs } from './EditorContent';

export interface SectionItemProps {
  section: Section;
  index: number;
  sectionManagement: EditorContentSectionManagementProps;
  refs: EditorContentRefs;
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
  isLast: boolean;
}

const SectionItem = memo(({
  section,
  index,
  sectionManagement,
  refs,
  supportsIcons,
  iconRegistry,
  isLast
}: SectionItemProps) => {

  // Handlers
  const handleUpdate = useCallback((updatedContent: Section['content']) => {
    sectionManagement.handleUpdateSection(index, {
      ...section,
      content: updatedContent,
    } as Section);
  }, [index, section, sectionManagement]);

  const handleTitleEdit = useCallback(() => sectionManagement.handleTitleEdit(index), [index, sectionManagement]);
  const handleDelete = useCallback(() => sectionManagement.handleDeleteSection(index), [index, sectionManagement]);

  const handleDeleteEntry = useCallback((entryIndex: number) =>
    sectionManagement.handleDeleteEntry(index, entryIndex),
    [index, sectionManagement]);

  const handleReorderEntry = useCallback((oldIndex: number, newIndex: number) =>
    sectionManagement.handleReorderEntry(index, oldIndex, newIndex),
    [index, sectionManagement]);

  const setRef = useCallback((el: HTMLDivElement | null) => {
    refs.sectionRefs.current[index] = el;
    if (isLast) {
      refs.newSectionRef.current = el;
    }
  }, [index, isLast, refs]);

  // Specific update handler for generic section which expects full section object
  const handleGenericUpdate = useCallback((updatedSection: Section) => {
      sectionManagement.handleUpdateSection(index, updatedSection);
  }, [index, sectionManagement]);


  if (isExperienceSection(section)) {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <ExperienceSection
            sectionName={section.name}
            experiences={section.content}
            onUpdate={handleUpdate}
            onTitleEdit={handleTitleEdit}
            onTitleSave={sectionManagement.handleTitleSave}
            onTitleCancel={sectionManagement.handleTitleCancel}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorderEntry}
            isEditingTitle={sectionManagement.editingTitleIndex === index}
            temporaryTitle={sectionManagement.temporaryTitle}
            setTemporaryTitle={sectionManagement.setTemporaryTitle}
            supportsIcons={supportsIcons}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else if (isEducationSection(section)) {
    return (
      <DragHandle id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <EducationSection
            sectionName={section.name}
            education={section.content}
            onUpdate={handleUpdate}
            onTitleEdit={handleTitleEdit}
            onTitleSave={sectionManagement.handleTitleSave}
            onTitleCancel={sectionManagement.handleTitleCancel}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorderEntry}
            isEditingTitle={sectionManagement.editingTitleIndex === index}
            temporaryTitle={sectionManagement.temporaryTitle}
            setTemporaryTitle={sectionManagement.setTemporaryTitle}
            supportsIcons={supportsIcons}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else if (section.type === 'icon-list') {
     return (
        <DragHandle id={`section-${index}`} disabled={false}>
            <div ref={setRef}>
            <IconListSection
                data={section.content as IconListItem[]}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onDeleteEntry={handleDeleteEntry}
                onReorderEntry={handleReorderEntry}
                sectionName={section.name}
                onEditTitle={handleTitleEdit}
                onSaveTitle={sectionManagement.handleTitleSave}
                onCancelTitle={sectionManagement.handleTitleCancel}
                isEditing={sectionManagement.editingTitleIndex === index}
                temporaryTitle={sectionManagement.temporaryTitle}
                setTemporaryTitle={sectionManagement.setTemporaryTitle}
                iconRegistry={iconRegistry}
            />
            </div>
        </DragHandle>
     );
  } else {
      return (
        <DragHandle id={`section-${index}`} disabled={false}>
            <div ref={setRef}>
            <GenericSection
                section={section}
                onUpdate={handleGenericUpdate}
                onEditTitle={handleTitleEdit}
                onSaveTitle={sectionManagement.handleTitleSave}
                onCancelTitle={sectionManagement.handleTitleCancel}
                onDelete={handleDelete}
                onDeleteEntry={handleDeleteEntry}
                onReorderEntry={handleReorderEntry}
                isEditing={sectionManagement.editingTitleIndex === index}
                temporaryTitle={sectionManagement.temporaryTitle}
                setTemporaryTitle={sectionManagement.setTemporaryTitle}
            />
            </div>
        </DragHandle>
      );
  }
});

export default SectionItem;
