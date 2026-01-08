// src/components/ItemDndContext.tsx
// Higher-order component that encapsulates DnD context setup for item reordering

import React from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useItemDragDrop } from '../hooks/editor/useItemDragDrop';

/**
 * Render props passed to children
 */
interface ItemDndContextRenderProps<T> {
  /** Generated item IDs for SortableContext */
  itemIds: string[];
  /** Currently dragged item's ID, null if not dragging */
  activeId: string | null;
  /** Currently dragged item data, null if not dragging */
  draggedItem: T | null;
}

/**
 * Props for ItemDndContext component
 */
interface ItemDndContextProps<T> {
  /** Array of items to make sortable */
  items: T[];
  /** Unique identifier for the section (prevents cross-section drops) */
  sectionId: string;
  /** Callback when items are reordered */
  onReorder: (oldIndex: number, newIndex: number) => void;
  /** Render function that receives DnD context state */
  children: (props: ItemDndContextRenderProps<T>) => React.ReactNode;
  /** Optional render function for drag overlay preview */
  renderDragOverlay?: (item: T, index: number) => React.ReactNode;
  /** Whether drag is disabled for all items */
  disabled?: boolean;
}

/**
 * ItemDndContext Component
 *
 * A higher-order component that wraps content with DnD context for item reordering.
 * Encapsulates all the @dnd-kit setup needed for item-level drag and drop.
 *
 * Features:
 * - Uses closestCenter collision detection
 * - Restricts dragging to vertical axis within parent element
 * - Provides render props for itemIds, activeId, and draggedItem
 * - Optional drag overlay for visual preview during drag
 * - Touch and keyboard support via useItemDragDrop hook
 *
 * @example
 * <ItemDndContext
 *   items={experiences}
 *   sectionId="experience-work"
 *   onReorder={(oldIndex, newIndex) => handleReorder(oldIndex, newIndex)}
 *   renderDragOverlay={(item, index) => (
 *     <ExperienceCardPreview experience={item} />
 *   )}
 * >
 *   {({ itemIds }) => (
 *     experiences.map((exp, i) => (
 *       <SortableItem key={itemIds[i]} id={itemIds[i]}>
 *         <ExperienceCard experience={exp} />
 *       </SortableItem>
 *     ))
 *   )}
 * </ItemDndContext>
 */
function ItemDndContext<T>({
  items,
  sectionId,
  onReorder,
  children,
  renderDragOverlay,
  disabled = false,
}: ItemDndContextProps<T>): React.ReactElement {
  const {
    sensors,
    activeId,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    itemIds,
  } = useItemDragDrop({
    items,
    sectionId,
    onReorder,
  });

  // Find the index of the dragged item for renderDragOverlay
  const draggedIndex = activeId
    ? itemIds.findIndex((id) => id === activeId)
    : -1;

  return (
    <DndContext
      sensors={disabled ? [] : sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={itemIds}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        {children({ itemIds, activeId, draggedItem })}
      </SortableContext>

      <DragOverlay modifiers={[restrictToVerticalAxis]}>
        {activeId && draggedItem && renderDragOverlay && draggedIndex >= 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-200 p-4">
            {renderDragOverlay(draggedItem, draggedIndex)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default ItemDndContext;
