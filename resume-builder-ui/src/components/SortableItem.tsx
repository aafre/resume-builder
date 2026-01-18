// src/components/SortableItem.tsx
// Reusable sortable item wrapper for drag-and-drop within sections

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
 * Uses a full-width draggable header bar at the top for easy grabbing.
 *
 * Features:
 * - Full-width draggable header bar (consistent with section-level DragHandle)
 * - Visual feedback during drag (opacity, shadow, ring)
 * - Support for disabled state
 * - Touch and keyboard accessible
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
        ${isDragging ? 'opacity-0 pointer-events-none' : 'transition-all duration-200 ease-out'}
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

      {/* Drag handle bar - listeners here, not on wrapper */}
      {!disabled && (
        <div
          {...listeners}
          className={`
            w-full h-3 -mb-1 rounded-t-xl
            cursor-grab active:cursor-grabbing
            ${isDragging ? 'bg-blue-300' : 'bg-transparent hover:bg-gray-100'}
            transition-colors duration-150 ease-out
            flex items-center justify-center
          `}
          aria-label="Drag to reorder item"
          title="Drag to reorder item"
        >
          {/* Drag indicator dots */}
          <div className={`
            flex gap-0.5
            ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
            transition-opacity duration-150
          `}>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
          </div>
        </div>
      )}

      {/* Item content */}
      <div className={`${isDragging ? 'pointer-events-none select-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
