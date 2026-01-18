// src/components/ItemDndContext.tsx
// Higher-order component that provides SortableContext for item reordering
// Works with the unified DndContext at the EditorContent level

import React, { useEffect, useMemo, useState } from 'react';
import { useDndMonitor } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useOptionalUnifiedDndContext, DraggedItemInfo } from '../contexts/UnifiedDndContext';
import { parseDragId } from '../hooks/editor/useUnifiedDragDrop';

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
  /** Whether items are subitems (use -subitem- ID pattern) */
  isSubitem?: boolean;
  /** Optional function to extract drag preview info from an item */
  getItemInfo?: (item: T, index: number) => DraggedItemInfo;
}

/**
 * ItemDndContext Component
 *
 * A higher-order component that wraps content with SortableContext for item reordering.
 * Registers with the unified DndContext at the EditorContent level.
 *
 * Features:
 * - Uses unified DndContext (no nested DndContext)
 * - Registers handlers with parent context for proper event routing
 * - Provides render props for itemIds, activeId, and draggedItem
 * - Touch and keyboard support via parent context
 *
 * @example
 * <ItemDndContext
 *   items={experiences}
 *   sectionId="experience-work"
 *   onReorder={(oldIndex, newIndex) => handleReorder(oldIndex, newIndex)}
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
  disabled = false,
  isSubitem = false,
  getItemInfo,
}: ItemDndContextProps<T>): React.ReactElement {
  const unifiedContext = useOptionalUnifiedDndContext();

  // Track active drag state for this context's items
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  /**
   * Generate unique item IDs scoped to the section
   * Format: "{sectionId}-item-{index}" or "{sectionId}-subitem-{index}"
   */
  const itemIds = useMemo(
    () => items.map((_, index) =>
      isSubitem
        ? `${sectionId}-subitem-${index}`
        : `${sectionId}-item-${index}`
    ),
    [items.length, sectionId, isSubitem]
  );

  /**
   * Register the reorder handler with the unified context
   */
  useEffect(() => {
    if (unifiedContext && !disabled) {
      unifiedContext.registerItemHandler(sectionId, onReorder);
      return () => {
        unifiedContext.unregisterItemHandler(sectionId);
      };
    }
  }, [unifiedContext, sectionId, onReorder, disabled]);

  /**
   * Monitor drag events to track active state for this context's items
   */
  useDndMonitor({
    onDragStart(event) {
      const id = String(event.active.id);
      const parsed = parseDragId(id);

      // Check if this drag belongs to our context
      const belongsToUs = isSubitem
        ? parsed.level === 'subitem' && id.startsWith(sectionId)
        : parsed.level === 'item' && parsed.sectionId === sectionId;

      if (belongsToUs) {
        setActiveId(id);
        const itemIndex = isSubitem ? parsed.subitemIndex : parsed.itemIndex;
        if (itemIndex !== undefined && itemIndex >= 0 && itemIndex < items.length) {
          const item = items[itemIndex];
          setDraggedItem(item);

          // Report item info to the unified context for drag overlay preview
          if (unifiedContext && getItemInfo) {
            unifiedContext.setDraggedItemInfo(getItemInfo(item, itemIndex));
          }
        }
      }
    },
    onDragEnd() {
      setActiveId(null);
      setDraggedItem(null);
    },
    onDragCancel() {
      setActiveId(null);
      setDraggedItem(null);
    },
  });

  return (
    <SortableContext
      items={itemIds}
      strategy={verticalListSortingStrategy}
      disabled={disabled}
    >
      {children({ itemIds, activeId, draggedItem })}
    </SortableContext>
  );
}

export default ItemDndContext;
