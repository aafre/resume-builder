import { memo, useCallback } from 'react';
import { Section, IconListItem } from '../../types';
import { isExperienceSection, isEducationSection } from '../../utils/sectionTypeChecker';
import ExperienceSection from '../ExperienceSection';
import EducationSection from '../EducationSection';
import GenericSection from '../GenericSection';
import IconListSection from '../IconListSection';
import DragHandle from '../DragHandle';
import {
  EditorContentSectionManagementProps,
  EditorContentRefs,
  EditorContentIconRegistry
} from './EditorContent';

export interface SectionItemProps {
  section: Section;
  index: number;
  totalSections: number;
  sectionManagement: EditorContentSectionManagementProps;
  refs: EditorContentRefs;
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
}

const SectionItem = memo(({
  section,
  index,
  totalSections,
  sectionManagement,
  refs,
  supportsIcons,
  iconRegistry,
}: SectionItemProps) => {

  // Memoized handlers

  // For sections that update content only
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateContent = useCallback((updatedContent: any) => {
    sectionManagement.handleUpdateSection(index, {
      ...section,
      content: updatedContent,
    } as Section);
  }, [index, section, sectionManagement]);

  // For GenericSection which updates the whole section
  const handleGenericUpdate = useCallback((updatedSection: Section) => {
    sectionManagement.handleUpdateSection(index, updatedSection);
  }, [index, sectionManagement]);

  const handleTitleEdit = useCallback(() => {
    sectionManagement.handleTitleEdit(index);
  }, [index, sectionManagement]);

  const handleTitleSave = sectionManagement.handleTitleSave;
  const handleTitleCancel = sectionManagement.handleTitleCancel;

  const handleDelete = useCallback(() => {
    sectionManagement.handleDeleteSection(index);
  }, [index, sectionManagement]);

  const handleDeleteEntry = useCallback((entryIndex: number) => {
    sectionManagement.handleDeleteEntry(index, entryIndex);
  }, [index, sectionManagement]);

  const handleReorder = useCallback((oldIndex: number, newIndex: number) => {
    sectionManagement.handleReorderEntry(index, oldIndex, newIndex);
  }, [index, sectionManagement]);

  const isEditingTitle = sectionManagement.editingTitleIndex === index;
  const temporaryTitle = sectionManagement.temporaryTitle;
  const setTemporaryTitle = sectionManagement.setTemporaryTitle;

  const setRef = (el: HTMLDivElement | null) => {
    refs.sectionRefs.current[index] = el;
    if (index === totalSections - 1) {
      refs.newSectionRef.current = el;
    }
  };

  if (isExperienceSection(section)) {
    return (
      <DragHandle key={index} id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <ExperienceSection
            sectionName={section.name}
            experiences={section.content}
            onUpdate={handleUpdateContent}
            onTitleEdit={handleTitleEdit}
            onTitleSave={handleTitleSave}
            onTitleCancel={handleTitleCancel}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorder}
            isEditingTitle={isEditingTitle}
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
      <DragHandle key={index} id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <EducationSection
            sectionName={section.name}
            education={section.content}
            onUpdate={handleUpdateContent}
            onTitleEdit={handleTitleEdit}
            onTitleSave={handleTitleSave}
            onTitleCancel={handleTitleCancel}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorder}
            isEditingTitle={isEditingTitle}
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
      <DragHandle key={index} id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <IconListSection
            data={section.content as IconListItem[]}
            onUpdate={handleUpdateContent}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorder}
            sectionName={section.name}
            onEditTitle={handleTitleEdit}
            onSaveTitle={handleTitleSave}
            onCancelTitle={handleTitleCancel}
            isEditing={isEditingTitle}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
            iconRegistry={iconRegistry}
          />
        </div>
      </DragHandle>
    );
  } else {
    return (
      <DragHandle key={index} id={`section-${index}`} disabled={false}>
        <div ref={setRef}>
          <GenericSection
            section={section}
            onUpdate={handleGenericUpdate}
            onEditTitle={handleTitleEdit}
            onSaveTitle={handleTitleSave}
            onCancelTitle={handleTitleCancel}
            onDelete={handleDelete}
            onDeleteEntry={handleDeleteEntry}
            onReorderEntry={handleReorder}
            isEditing={isEditingTitle}
            temporaryTitle={temporaryTitle}
            setTemporaryTitle={setTemporaryTitle}
          />
        </div>
      </DragHandle>
    );
  }
});

SectionItem.displayName = 'SectionItem';

export default SectionItem;
