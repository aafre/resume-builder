// src/hooks/editor/useSectionManagement.ts
// Hook for managing section CRUD operations and title editing

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Section } from '../../types';
import { DeleteTarget, UseSectionManagementReturn } from '../../types/editor';
import { createDefaultSection, deleteSectionItem, reorderSectionItems, SectionType } from '../../services/sectionService';
import { InsertPosition } from '../../components/SectionTypeModal';

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
  // Title editing state
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
  const [temporaryTitle, setTemporaryTitle] = useState<string>('');

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
      const newSection = createDefaultSection(type, sections);
      let insertedIndex = 0;

      setSections((prevSections) => {
        if (position === 'top') {
          insertedIndex = 0;
          return [newSection, ...prevSections];
        } else if (position === 'bottom') {
          insertedIndex = prevSections.length;
          return [...prevSections, newSection];
        } else if (typeof position === 'number') {
          // Insert at specific index
          insertedIndex = Math.min(Math.max(0, position), prevSections.length);
          const result = [...prevSections];
          result.splice(insertedIndex, 0, newSection);
          return result;
        }
        // Fallback to top
        insertedIndex = 0;
        return [newSection, ...prevSections];
      });
      closeSectionTypeModal();

      // Call onSectionAdded callback after a short delay to allow render
      if (onSectionAdded) {
        setTimeout(() => onSectionAdded(insertedIndex), 100);
      }
    },
    [sections, setSections, closeSectionTypeModal, onSectionAdded]
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
   */
  const handleDeleteSection = useCallback(
    (index: number) => {
      openDeleteConfirm({
        type: 'section',
        sectionIndex: index,
        sectionName: sections[index]?.name,
      });
    },
    [sections, openDeleteConfirm]
  );

  /**
   * Request deletion of an entry within a section (shows confirmation dialog).
   */
  const handleDeleteEntry = useCallback(
    (sectionIndex: number, entryIndex: number) => {
      openDeleteConfirm({
        type: 'entry',
        sectionIndex,
        entryIndex,
        sectionName: sections[sectionIndex]?.name,
      });
    },
    [sections, openDeleteConfirm]
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
      // Delete entire section
      setSections((currentSections) =>
        currentSections.filter((_, i) => i !== deleteTarget.sectionIndex)
      );
      toast.success(deleteTarget.sectionName ? `Section "${deleteTarget.sectionName}" deleted` : 'Section deleted');
    } else if (deleteTarget.type === 'entry' && deleteTarget.entryIndex !== undefined) {
      // Delete entry from section using sectionService
      setSections((currentSections) => {
        const section = currentSections[deleteTarget.sectionIndex];
        if (!section) return currentSections;

        const updatedSection = deleteSectionItem(section, deleteTarget.entryIndex!);
        const newSections = [...currentSections];
        newSections[deleteTarget.sectionIndex] = updatedSection;
        return newSections;
      });
      toast.success(deleteTarget.sectionName ? `Entry deleted from "${deleteTarget.sectionName}"` : 'Entry deleted');
    }

    closeDeleteConfirm();
  }, [deleteTarget, setSections, closeDeleteConfirm]);

  /**
   * Start editing a section title.
   */
  const handleTitleEdit = useCallback(
    (index: number) => {
      setEditingTitleIndex(index);
      setTemporaryTitle(sections[index]?.name || '');
    },
    [sections]
  );

  /**
   * Save the edited section title.
   */
  const handleTitleSave = useCallback(() => {
    if (editingTitleIndex === null) return;

    setSections((currentSections) => {
      if (editingTitleIndex < 0 || editingTitleIndex >= currentSections.length) {
        console.warn(`Attempted to save title for out-of-bounds index: ${editingTitleIndex}`);
        return currentSections;
      }
      const newSections = [...currentSections];
      newSections[editingTitleIndex] = {
        ...newSections[editingTitleIndex],
        name: temporaryTitle,
      };
      return newSections;
    });

    setEditingTitleIndex(null);
    setTemporaryTitle('');
  }, [editingTitleIndex, temporaryTitle, setSections]);

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
