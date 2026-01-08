// src/hooks/editor/useReorderMode.ts
// Reorder mode hook - manages section/item reordering with undo capability

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { arrayMove } from '@dnd-kit/sortable';
import { Section } from '../../types';

/**
 * Props for useReorderMode hook (dependency injection from parent)
 */
export interface UseReorderModeProps {
  sections: Section[];
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void;
}

/**
 * Return type for useReorderMode hook
 */
export interface UseReorderModeReturn {
  // State
  isReorderModeActive: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  enterReorderMode: () => void;
  cancelReorderMode: () => void;
  commitReorderMode: () => void;

  // Section move operations
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;

  // Item move operations (within a section)
  moveItemUp: (sectionIndex: number, itemIndex: number) => void;
  moveItemDown: (sectionIndex: number, itemIndex: number) => void;

  // Helpers
  canMoveUp: (index: number) => boolean;
  canMoveDown: (index: number, total: number) => boolean;
}

/**
 * Deep clone utility for creating section snapshots
 * Uses JSON parse/stringify for simplicity (sufficient for Section structure)
 */
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * Compare two section arrays for equality
 * Used to detect if changes have been made
 */
const sectionsEqual = (a: Section[], b: Section[]): boolean => {
  if (a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * useReorderMode Hook
 *
 * Manages a dedicated "Reorder Mode" for intuitive section reorganization.
 * Provides both button-based controls (critical for mobile/accessibility)
 * and supports drag-and-drop integration.
 *
 * Key behaviors:
 * - Enter: Snapshots current sections for potential cancel
 * - Cancel: Restores original order from snapshot
 * - Commit: Clears snapshot, shows success toast
 * - Move operations use arrayMove from @dnd-kit/sortable
 *
 * @param props - Dependency injection props from useEditorState
 * @returns Reorder mode state, actions, and helpers
 *
 * @example
 * const reorderMode = useReorderMode({ sections, setSections });
 *
 * // Enter reorder mode
 * <button onClick={reorderMode.enterReorderMode}>Reorder</button>
 *
 * // Move buttons
 * <button
 *   onClick={() => reorderMode.moveSectionUp(index)}
 *   disabled={!reorderMode.canMoveUp(index)}
 * >↑</button>
 *
 * // Done/Cancel
 * <button onClick={reorderMode.commitReorderMode}>Done</button>
 * <button onClick={reorderMode.cancelReorderMode}>Cancel</button>
 */
export const useReorderMode = ({
  sections,
  setSections,
}: UseReorderModeProps): UseReorderModeReturn => {
  // Track whether reorder mode is active
  const [isReorderModeActive, setIsReorderModeActive] = useState(false);

  // Snapshot of sections when reorder mode was entered (for cancel)
  const [originalSections, setOriginalSections] = useState<Section[] | null>(null);

  /**
   * Computed: Check if sections have changed from original
   */
  const hasUnsavedChanges = useMemo(() => {
    if (!isReorderModeActive || !originalSections) return false;
    return !sectionsEqual(sections, originalSections);
  }, [isReorderModeActive, originalSections, sections]);

  /**
   * Enter reorder mode
   * Creates a deep clone snapshot of current sections for potential cancel
   */
  const enterReorderMode = useCallback(() => {
    if (isReorderModeActive) return; // Already in reorder mode

    setOriginalSections(deepClone(sections));
    setIsReorderModeActive(true);
  }, [isReorderModeActive, sections]);

  /**
   * Cancel reorder mode
   * Restores sections to their original order from snapshot
   */
  const cancelReorderMode = useCallback(() => {
    if (!isReorderModeActive) return;

    // Restore original order if we have a snapshot
    if (originalSections) {
      setSections(originalSections);
    }

    // Clear state
    setOriginalSections(null);
    setIsReorderModeActive(false);
  }, [isReorderModeActive, originalSections, setSections]);

  /**
   * Commit reorder mode
   * Keeps current order, clears snapshot, shows success toast
   */
  const commitReorderMode = useCallback(() => {
    if (!isReorderModeActive) return;

    // Show success feedback if changes were made
    if (hasUnsavedChanges) {
      toast.success('Section order saved!');
    }

    // Clear state (keep current sections order)
    setOriginalSections(null);
    setIsReorderModeActive(false);
  }, [isReorderModeActive, hasUnsavedChanges]);

  /**
   * Move a section up (decrease index)
   * @param index - Current index of section to move
   */
  const moveSectionUp = useCallback(
    (index: number) => {
      if (!isReorderModeActive) return;
      if (index <= 0) return; // Already at top

      setSections((prev) => arrayMove(prev, index, index - 1));
    },
    [isReorderModeActive, setSections]
  );

  /**
   * Move a section down (increase index)
   * @param index - Current index of section to move
   */
  const moveSectionDown = useCallback(
    (index: number) => {
      if (!isReorderModeActive) return;
      if (index >= sections.length - 1) return; // Already at bottom

      setSections((prev) => arrayMove(prev, index, index + 1));
    },
    [isReorderModeActive, sections.length, setSections]
  );

  /**
   * Move an item up within a section (decrease index)
   * @param sectionIndex - Index of the section containing the item
   * @param itemIndex - Current index of the item to move
   */
  const moveItemUp = useCallback(
    (sectionIndex: number, itemIndex: number) => {
      if (!isReorderModeActive) return;
      if (itemIndex <= 0) return; // Already at top

      setSections((prev) => {
        const newSections = [...prev];
        const section = newSections[sectionIndex];

        // Handle different section content types
        if (Array.isArray(section.content)) {
          const newContent = arrayMove(section.content as unknown[], itemIndex, itemIndex - 1);
          newSections[sectionIndex] = { ...section, content: newContent as typeof section.content };
        }

        return newSections;
      });
    },
    [isReorderModeActive, setSections]
  );

  /**
   * Move an item down within a section (increase index)
   * @param sectionIndex - Index of the section containing the item
   * @param itemIndex - Current index of the item to move
   */
  const moveItemDown = useCallback(
    (sectionIndex: number, itemIndex: number) => {
      if (!isReorderModeActive) return;

      setSections((prev) => {
        const section = prev[sectionIndex];

        // Handle different section content types
        if (Array.isArray(section.content)) {
          const contentArray = section.content as unknown[];
          if (itemIndex >= contentArray.length - 1) return prev; // Already at bottom

          const newSections = [...prev];
          const newContent = arrayMove(contentArray, itemIndex, itemIndex + 1);
          newSections[sectionIndex] = { ...section, content: newContent as typeof section.content };
          return newSections;
        }

        return prev;
      });
    },
    [isReorderModeActive, setSections]
  );

  /**
   * Check if a section can be moved up
   * @param index - Index to check
   * @returns true if section is not at the top
   */
  const canMoveUp = useCallback((index: number): boolean => {
    return index > 0;
  }, []);

  /**
   * Check if a section can be moved down
   * @param index - Index to check
   * @param total - Total number of sections
   * @returns true if section is not at the bottom
   */
  const canMoveDown = useCallback((index: number, total: number): boolean => {
    return index < total - 1;
  }, []);

  return {
    // State
    isReorderModeActive,
    hasUnsavedChanges,

    // Actions
    enterReorderMode,
    cancelReorderMode,
    commitReorderMode,

    // Section move operations
    moveSectionUp,
    moveSectionDown,

    // Item move operations
    moveItemUp,
    moveItemDown,

    // Helpers
    canMoveUp,
    canMoveDown,
  };
};
