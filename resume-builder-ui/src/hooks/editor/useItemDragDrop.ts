// src/hooks/editor/useItemDragDrop.ts
// Item-level drag-and-drop hook for reordering items within sections

import { useState, useCallback, useMemo } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Props for useItemDragDrop hook
 */
export interface UseItemDragDropProps<T> {
  /** Array of items to make sortable */
  items: T[];
  /** Unique identifier for the section (prevents cross-section drops) */
  sectionId: string;
  /** Callback when items are reordered */
  onReorder: (oldIndex: number, newIndex: number) => void;
}

/**
 * Return type for useItemDragDrop hook
 */
export interface UseItemDragDropReturn<T> {
  /** Currently dragged item's ID, null if not dragging */
  activeId: string | null;
  /** Currently dragged item data, null if not dragging */
  draggedItem: T | null;
  /** Configured sensors for DndContext */
  sensors: ReturnType<typeof useSensors>;
  /** Handler for drag start event */
  handleDragStart: (event: DragStartEvent) => void;
  /** Handler for drag end event */
  handleDragEnd: (event: DragEndEvent) => void;
  /** Handler for drag cancel event */
  handleDragCancel: () => void;
  /** Generated item IDs for SortableContext */
  itemIds: string[];
}

/**
 * useItemDragDrop Hook
 *
 * Manages drag-and-drop functionality for item reordering within sections.
 * Includes touch support for mobile devices.
 *
 * Features:
 * - Pointer sensor with 5px activation distance
 * - Touch sensor with 200ms delay (prevents scroll conflicts)
 * - Keyboard sensor for accessibility
 * - Unique item IDs scoped to section
 *
 * @param props - Configuration including items, sectionId, and onReorder callback
 * @returns Drag-and-drop state, handlers, and item IDs
 *
 * @example
 * const { sensors, activeId, draggedItem, handleDragStart, handleDragEnd, handleDragCancel, itemIds } =
 *   useItemDragDrop({
 *     items: experiences,
 *     sectionId: 'experience-work',
 *     onReorder: (oldIndex, newIndex) => handleReorder(oldIndex, newIndex),
 *   });
 */
export const useItemDragDrop = <T>({
  items,
  sectionId,
  onReorder,
}: UseItemDragDropProps<T>): UseItemDragDropReturn<T> => {
  // Track the currently dragged item
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  /**
   * Generate unique item IDs scoped to the section
   * Format: "{sectionId}-item-{index}"
   */
  const itemIds = useMemo(
    () => items.map((_, index) => `${sectionId}-item-${index}`),
    [items.length, sectionId]
  );

  /**
   * Configure sensors for drag-and-drop
   * - PointerSensor: 5px activation distance (slightly less than section's 8px)
   * - TouchSensor: 200ms delay to distinguish from scroll gestures
   * - KeyboardSensor: Keyboard navigation support for accessibility
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Parse item index from item ID
   * @param id - Item ID in format "{sectionId}-item-{index}"
   * @returns The parsed index or -1 if invalid
   */
  const parseItemIndex = useCallback(
    (id: string | number): number => {
      if (typeof id !== 'string') return -1;
      const prefix = `${sectionId}-item-`;
      if (!id.startsWith(prefix)) return -1;
      const index = parseInt(id.slice(prefix.length), 10);
      return isNaN(index) ? -1 : index;
    },
    [sectionId]
  );

  /**
   * Handles the start of a drag operation
   * Captures the dragged item for preview in DragOverlay
   */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id as string);

      const itemIndex = parseItemIndex(active.id as string);
      if (itemIndex >= 0 && itemIndex < items.length) {
        setDraggedItem(items[itemIndex]);
      }
    },
    [items, parseItemIndex]
  );

  /**
   * Handles the end of a drag operation
   * Calls onReorder if position changed
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = parseItemIndex(active.id as string);
        const newIndex = parseItemIndex(over.id as string);

        if (oldIndex >= 0 && newIndex >= 0) {
          onReorder(oldIndex, newIndex);
        }
      }

      // Clear drag state
      setActiveId(null);
      setDraggedItem(null);
    },
    [onReorder, parseItemIndex]
  );

  /**
   * Handles drag cancellation (e.g., pressing Escape)
   * Clears drag state without reordering
   */
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDraggedItem(null);
  }, []);

  return {
    activeId,
    draggedItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    itemIds,
  };
};
