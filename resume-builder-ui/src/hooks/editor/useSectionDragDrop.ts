// src/hooks/editor/useSectionDragDrop.ts
// Section drag-and-drop hook (Layer 2) - manages section reordering

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Section } from '../../types';

/**
 * Props for useSectionDragDrop hook (dependency injection from Layer 1)
 */
export interface UseSectionDragDropProps {
  sections: Section[];
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void;
}

/**
 * Return type for useSectionDragDrop hook
 */
export interface UseSectionDragDropReturn {
  activeId: string | null;
  draggedSection: Section | null;
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

/**
 * useSectionDragDrop Hook
 *
 * Manages drag-and-drop functionality for section reordering including:
 * - Sensor configuration (8px pointer activation distance)
 * - Active drag state tracking
 * - Section reordering with arrayMove
 * - Success toast notifications
 *
 * @param props - Dependency injection props from useEditorState
 * @returns Drag-and-drop state and handlers
 *
 * @example
 * const dragDrop = useSectionDragDrop({ sections, setSections });
 *
 * <DndContext
 *   sensors={dragDrop.sensors}
 *   onDragStart={dragDrop.handleDragStart}
 *   onDragEnd={dragDrop.handleDragEnd}
 *   onDragCancel={dragDrop.handleDragCancel}
 * >
 *   {dragDrop.activeId && dragDrop.draggedSection && (
 *     <DragOverlay>
 *       <SectionComponent section={dragDrop.draggedSection} />
 *     </DragOverlay>
 *   )}
 * </DndContext>
 */
export const useSectionDragDrop = ({
  sections,
  setSections,
}: UseSectionDragDropProps): UseSectionDragDropReturn => {
  // Track the currently dragged section
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);

  /**
   * Configure sensors for drag-and-drop
   * - PointerSensor: 8px activation distance to prevent accidental drags
   * - KeyboardSensor: Keyboard navigation support
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handles the start of a drag operation
   * Captures the dragged section for preview in DragOverlay
   *
   * @param event - DragStartEvent from @dnd-kit
   */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id as string);

      // Parse section index from the active id
      const sectionIndex = parseInt(active.id as string);
      setDraggedSection(sections[sectionIndex] ?? null);
    },
    [sections]
  );

  /**
   * Handles the end of a drag operation
   * Reorders sections if position changed, shows success toast
   *
   * @param event - DragEndEvent from @dnd-kit
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Only process if dropped over a valid target
      if (over && active.id !== over.id) {
        const oldIndex = parseInt(active.id as string);
        const newIndex = parseInt(over.id as string);

        if (!isNaN(oldIndex) && !isNaN(newIndex)) {
          setSections((prevSections) => {
            return arrayMove(prevSections, oldIndex, newIndex);
          });

          // Toast notification for successful reorder
          toast.success('Section reordered successfully!');
        }
      }

      // Clear drag state
      setActiveId(null);
      setDraggedSection(null);
    },
    [setSections]
  );

  /**
   * Handles drag cancellation (e.g., pressing Escape)
   * Clears drag state without reordering
   */
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDraggedSection(null);
  }, []);

  return {
    activeId,
    draggedSection,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
