import React from 'react';
import { Section } from '../../types';
import DragHandle from '../DragHandle';
import SectionRenderer from './SectionRenderer';
import { EditorContentIconRegistry, EditorContentRefs } from './EditorContent';

export interface SectionItemProps {
  section: Section;
  index: number;
  isLast: boolean;
  supportsIcons: boolean;
  iconRegistry: EditorContentIconRegistry;
  refs: EditorContentRefs;

  // Destructured section management handlers
  handleUpdateSection: (index: number, updatedSection: Section) => void;
  handleDeleteSection: (index: number) => void;
  handleDeleteEntry: (sectionIndex: number, entryIndex: number) => void;
  handleReorderEntry: (sectionIndex: number, oldIndex: number, newIndex: number) => void;
  handleTitleEdit: (index: number) => void;
  handleTitleSave: () => void;
  handleTitleCancel: () => void;

  // Section management state (specific to this section or global)
  isEditingTitle: boolean;
  temporaryTitle: string;
  setTemporaryTitle: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * SectionItem Component
 *
 * Memoized wrapper for rendering a single section item in the editor list.
 * Extracts the item rendering from EditorContent to prevent unnecessary re-renders
 * of siblings when one section is updated.
 */
const SectionItem: React.FC<SectionItemProps> = React.memo(({
  section,
  index,
  isLast,
  supportsIcons,
  iconRegistry,
  refs,
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
}) => {
  return (
    <DragHandle id={section.id || `section-${index}`} disabled={false}>
      <div
        ref={(el) => {
          if (refs.sectionRefs.current) {
            refs.sectionRefs.current[index] = el;
          }
          if (isLast && refs.newSectionRef) {
            refs.newSectionRef.current = el;
          }
        }}
      >
        <SectionRenderer
          section={section}
          index={index}
          handleUpdateSection={handleUpdateSection}
          handleDeleteSection={handleDeleteSection}
          handleDeleteEntry={handleDeleteEntry}
          handleReorderEntry={handleReorderEntry}
          handleTitleEdit={handleTitleEdit}
          handleTitleSave={handleTitleSave}
          handleTitleCancel={handleTitleCancel}
          isEditingTitle={isEditingTitle}
          temporaryTitle={isEditingTitle ? temporaryTitle : ''}
          setTemporaryTitle={setTemporaryTitle}
          supportsIcons={supportsIcons}
          iconRegistry={iconRegistry}
        />
      </div>
    </DragHandle>
  );
});

export default SectionItem;
