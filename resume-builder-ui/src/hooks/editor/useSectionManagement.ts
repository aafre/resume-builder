// src/hooks/editor/useSectionManagement.ts
// Hook for managing section CRUD operations and title editing

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Section } from '../../types';
import { DeleteTarget, UseSectionManagementReturn } from '../../types/editor';
import { createDefaultSection, deleteSectionItem, reorderSectionItems, SectionType } from '../../services/sectionService';
import { InsertPosition } from '../../components/SectionTypeModal';
import { toastUndo } from '../../utils/undoToast';

/**
 * What to call the thing that was removed, so the undo toast names it.
 * Anything not listed is a plain list item ("Item removed from Skills").
 */
const ENTRY_LABEL: Record<string, string> = {
  experience: 'Experience entry',
  education: 'Education entry',
  'icon-list': 'Certification',
};

/**
 * Props for useSectionManagement hook
 */
export interface UseSectionManagementProps {
  /** Current sections array */
  sections: Section[];
  /** Function to update sections */
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  /** Current delete target from modal manager */
  deleteTarget: DeleteTarget | null;
  /** Function to open delete confirmation dialog */
  openDeleteConfirm: (target: DeleteTarget) => void;
  /** Function to close delete confirmation dialog */
  closeDeleteConfirm: () => void;
  /** Function to close section type modal after adding */
  closeSectionTypeModal: () => void;
  /** Optional callback when section is added (e.g., for scrolling). Receives the index where the section was inserted. */
  onSectionAdded?: (insertedIndex: number) => void;
}

/**
 * Hook for managing section CRUD operations and title editing.
 *
 * Extracted from Editor.tsx to improve component organization and testability.
 * Handles:
 * - Adding new sections with unique names
 * - Updating existing sections
 * - Deleting sections with confirmation
 * - Deleting entries within sections with confirmation
 * - Title editing (edit, save, cancel)
 *
 * @param props - Configuration including sections state and modal controls
 * @returns Object with section management functions and title editing state
 *
 * @example
 * const {
 *   handleAddSection,
 *   handleDeleteSection,
 *   handleTitleEdit,
 *   editingTitleIndex,
 * } = useSectionManagement({
 *   sections,
 *   setSections,
 *   deleteTarget,
 *   openDeleteConfirm,
 *   closeDeleteConfirm,
 *   closeSectionTypeModal,
 * });
 */
export const useSectionManagement = ({
  sections,
  setSections,
  deleteTarget,
  openDeleteConfirm,
  closeDeleteConfirm,
  closeSectionTypeModal,
  onSectionAdded,
}: UseSectionManagementProps): UseSectionManagementReturn => {
  // Keep track of latest sections in a ref to avoid unstable callbacks
  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // Title editing state
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [temporaryTitle, setTemporaryTitle] = useState<string>('');

  // Keep track of editing state in a ref for stable callbacks
  const titleStateRef = useRef({ editingTitleIndex, temporaryTitle });
  useEffect(() => {
    titleStateRef.current = { editingTitleIndex, temporaryTitle };
  }, [editingTitleIndex, temporaryTitle]);

  /**
   * Add a new section of the specified type at the specified position.
   * Uses sectionService to generate unique name and default content.
   * Closes the section type modal and optionally scrolls to the new section.
   *
   * @param type - The type of section to create
   * @param position - Where to insert: 'top', 'bottom', or a specific index
   */
  const handleAddSection = useCallback(
    (type: SectionType, position: InsertPosition = 'top') => {
      const currentSections = sectionsRef.current;
      const newSection = createDefaultSection(type, currentSections);

      // Calculate inserted index outside the state updater to avoid side effects
      let insertedIndex: number;
      if (position === 'bottom') {
        insertedIndex = currentSections.length;
      } else if (typeof position === 'number') {
        insertedIndex = Math.min(Math.max(0, position), currentSections.length);
      } else {
        // 'top' or fallback
        insertedIndex = 0;
      }

      setSections((prevSections) => {
        if (position === 'bottom') {
          return [...prevSections, newSection];
        } else if (typeof position === 'number') {
          const index = Math.min(Math.max(0, position), prevSections.length);
          const result = [...prevSections];
          result.splice(index, 0, newSection);
          return result;
        }
        // 'top' or fallback
        return [newSection, ...prevSections];
      });
      closeSectionTypeModal();

      // Call onSectionAdded callback after a short delay to allow render
      if (onSectionAdded) {
        setTimeout(() => onSectionAdded(insertedIndex), 100);
      }
    },
    [setSections, closeSectionTypeModal, onSectionAdded]
  );

  /**
   * Update a section at the specified index.
   */
  const handleUpdateSection = useCallback(
    (index: number, updatedSection: Section) => {
      setSections((currentSections) => {
        if (index < 0 || index >= currentSections.length) {
          console.warn(`Attempted to update section at out-of-bounds index: ${index}`);
          return currentSections;
        }
        const newSections = [...currentSections];
        newSections[index] = updatedSection;
        return newSections;
      });
    },
    [setSections]
  );

  /**
   * Request deletion of a section (shows confirmation dialog).
   *
   * The confirmation is kept on purpose, even now that undo exists. An entry
   * delete loses one row; a section delete loses every role, bullet and date
   * inside it, and the only thing standing between that and permanence is a
   * five-second toast that the mobile action bar can sit on top of and that a
   * mid-application interruption will outlast. Undo beats confirmation when the
   * two costs are comparable; here they are not.
   */
  const handleDeleteSection = useCallback(
    (index: number) => {
      openDeleteConfirm({
        type: 'section',
        sectionIndex: index,
        sectionName: sectionsRef.current[index]?.name,
      });
    },
    [openDeleteConfirm]
  );

  /**
   * Delete an entry within a section immediately, with a 5-second undo toast.
   *
   * Every entry delete in the editor routes through here — experience roles,
   * education entries, certifications, and every list item. Putting the undo
   * here rather than at the buttons means the next section type that calls
   * `handleDeleteEntry` is protected without doing anything.
   *
   * No confirmation dialog: an entry is one row, the toast reverses it, and a
   * modal per bullet is forty minutes of interruption on a workbench.
   */
  const deleteEntryWithUndo = useCallback(
    (sectionIndex: number, entryIndex: number) => {
      const section = sectionsRef.current[sectionIndex];
      if (!section || !Array.isArray(section.content)) return;

      const removed = (section.content as unknown[])[entryIndex];
      if (removed === undefined) return;

      setSections((currentSections) => {
        const current = currentSections[sectionIndex];
        if (!current) return currentSections;
        const newSections = [...currentSections];
        newSections[sectionIndex] = deleteSectionItem(current, entryIndex);
        return newSections;
      });

      const typeLabel = ENTRY_LABEL[section.type ?? ''];
      const message = typeLabel
        ? `${typeLabel} removed`
        : `Item removed from "${section.name}"`;

      toastUndo(message, () => {
        // Re-insert into whatever the section looks like now, so an edit made
        // to a sibling entry inside the undo window is not thrown away.
        setSections((currentSections) => {
          const current = currentSections[sectionIndex];
          if (!current || !Array.isArray(current.content)) return currentSections;
          const content = [...(current.content as unknown[])];
          content.splice(Math.min(entryIndex, content.length), 0, removed);
          const newSections = [...currentSections];
          newSections[sectionIndex] = { ...current, content } as Section;
          return newSections;
        });
      });
    },
    [setSections]
  );

  /**
   * Request deletion of an entry within a section.
   * Deletes immediately and offers undo — see `deleteEntryWithUndo`.
   */
  const handleDeleteEntry = useCallback(
    (sectionIndex: number, entryIndex: number) => {
      deleteEntryWithUndo(sectionIndex, entryIndex);
    },
    [deleteEntryWithUndo]
  );

  /**
   * Reorder an entry within a section (for drag-and-drop).
   * Uses sectionService to handle all section types consistently.
   */
  const handleReorderEntry = useCallback(
    (sectionIndex: number, oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;

      setSections((currentSections) => {
        const section = currentSections[sectionIndex];
        if (!section) {
          console.warn(`Attempted to reorder entry in non-existent section: ${sectionIndex}`);
          return currentSections;
        }

        const reorderedSection = reorderSectionItems(section, oldIndex, newIndex);
        const newSections = [...currentSections];
        newSections[sectionIndex] = reorderedSection;
        return newSections;
      });
    },
    [setSections]
  );

  /**
   * Confirm and execute the pending delete operation.
   * Handles both section deletion and entry deletion within sections.
   */
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'section') {
      // A section delete takes every entry and every bullet inside it with it,
      // so it keeps its confirmation *and* gets an undo. Both, deliberately:
      // see the note on handleDeleteSection.
      const at = deleteTarget.sectionIndex;
      const removed = sectionsRef.current[at];
      setSections((currentSections) => currentSections.filter((_, i) => i !== at));

      const message = deleteTarget.sectionName
        ? `Section "${deleteTarget.sectionName}" removed`
        : 'Section removed';

      if (removed) {
        toastUndo(message, () => {
          setSections((currentSections) => {
            const newSections = [...currentSections];
            newSections.splice(Math.min(at, newSections.length), 0, removed);
            return newSections;
          });
        });
      } else {
        toast.success(message);
      }
    } else if (deleteTarget.type === 'entry' && deleteTarget.entryIndex !== undefined) {
      // Nothing in the UI opens an entry confirmation any more, but the modal
      // still accepts the target shape — route it through the same undo path.
      deleteEntryWithUndo(deleteTarget.sectionIndex, deleteTarget.entryIndex);
    }

    closeDeleteConfirm();
  }, [deleteTarget, setSections, closeDeleteConfirm, deleteEntryWithUndo]);

  /**
   * Start editing a section title.
   */
  const handleTitleEdit = useCallback(
    (index: number) => {
      setEditingTitleIndex(index);
      setTemporaryTitle(sectionsRef.current[index]?.name || '');
    },
    []
  );

  /**
   * Save the edited section title.
   * @param newTitle - Optional title to save. If provided, takes precedence over temporaryTitle state.
   *                   This allows callers to pass the title directly, avoiding async state update issues.
   */
  const handleTitleSave = useCallback((newTitle?: string) => {
    const { editingTitleIndex: currentIndex, temporaryTitle: currentTitle } = titleStateRef.current;

    if (currentIndex === null) return;

    // Use passed value if provided, otherwise fall back to temporaryTitle state
    const titleToSave = (newTitle ?? currentTitle).trim();

    if (!titleToSave) {
      // Don't save empty titles; cancel edit instead
      setEditingTitleIndex(null);
      setTemporaryTitle('');
      return;
    }

    setSections((currentSections) => {
      if (currentIndex < 0 || currentIndex >= currentSections.length) {
        console.warn(`Attempted to save title for out-of-bounds index: ${currentIndex}`);
        return currentSections;
      }
      const newSections = [...currentSections];
      newSections[currentIndex] = {
        ...newSections[currentIndex],
        name: titleToSave,
      };
      return newSections;
    });

    setEditingTitleIndex(null);
    setTemporaryTitle('');
  }, [setSections]);

  /**
   * Cancel title editing without saving changes.
   */
  const handleTitleCancel = useCallback(() => {
    setTemporaryTitle('');
    setEditingTitleIndex(null);
  }, []);

  // Return stable object with useMemo
  return useMemo(
    () => ({
      // Section operations
      handleAddSection,
      handleUpdateSection,
      handleDeleteSection,
      handleDeleteEntry,
      handleReorderEntry,
      confirmDelete,

      // Title editing
      editingTitleIndex,
      temporaryTitle,
      setTemporaryTitle,
      handleTitleEdit,
      handleTitleSave,
      handleTitleCancel,
    }),
    [
      handleAddSection,
      handleUpdateSection,
      handleDeleteSection,
      handleDeleteEntry,
      handleReorderEntry,
      confirmDelete,
      editingTitleIndex,
      temporaryTitle,
      handleTitleEdit,
      handleTitleSave,
      handleTitleCancel,
    ]
  );
};
