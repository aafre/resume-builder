// src/components/SortableItem.tsx
// Reusable sortable item wrapper for drag-and-drop within sections

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GripDots from './GripDots';
import DragTooltip from './DragTooltip';

interface SortableItemProps {
  /** Unique ID for the sortable item */
  id: string;
  /** Content to render inside the sortable wrapper */
  children: React.ReactNode;
  /** Whether drag is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * SortableItem Component
 *
 * A reusable wrapper that makes items draggable within a SortableContext.
 * Implements "Quiet by Default, Helpful on Demand" UX:
 * - Default: Clean, no visible controls
 * - Hover: Subtle spotlight + grip handle reveals on that item only
 * - Handle hover (after delay): Polite tooltip appears
 * - Dragging: Ghost placeholder marks landing zone
 *
 * @example
 * <SortableItem id="experience-work-item-0">
 *   <ExperienceCard experience={experience} />
 * </SortableItem>
 */
const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  disabled = false,
  className = '',
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    isSorting,
  } = useSortable({ id, disabled });

  // When isDragging is true, don't transform the original item
  // It stays in place as a placeholder while other items shift around it
  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  // Show drop indicator when this item is being hovered over during a drag
  const showDropIndicator = isOver && !isDragging && isSorting;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? 'border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl min-h-[40px]' : 'transition-all duration-200 ease-out'}
        ${showDropIndicator ? 'mt-2' : ''}
        ${className}
      `}
      {...attributes}
    >
      {/* Drop indicator line - shows where item will be placed */}
      {showDropIndicator && (
        <div className="absolute -top-1 left-0 right-0 flex items-center gap-2 z-40">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-md" />
          <div className="flex-1 h-0.5 bg-blue-500 rounded-full shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-md" />
        </div>
      )}

      {/* Drag handle bar - invisible by default, reveals on item hover */}
      {!disabled && (
        <div
          {...listeners}
          style={{ touchAction: 'none' }}
          className={`
            group/handle
            w-full h-5 md:h-3 min-h-[44px] md:min-h-0 -mb-1 rounded-t-xl
            cursor-grab active:cursor-grabbing
            ${isDragging ? 'bg-blue-50' : 'bg-transparent'}
            transition-all duration-150 ease-out
            flex items-center justify-center
            relative
          `}
          aria-label="Drag to reorder item"
        >
          <GripDots isDragging={isDragging} />
          <DragTooltip visible={!isDragging && !isSorting} />
        </div>
      )}

      {/* Item content - hidden when dragging to show ghost placeholder */}
      <div className={`${isDragging ? 'opacity-0 pointer-events-none select-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
