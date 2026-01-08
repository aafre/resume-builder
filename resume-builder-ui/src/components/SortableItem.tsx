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
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group rounded-xl
        ${isDragging ? 'opacity-50 shadow-lg z-30 ring-2 ring-blue-300' : 'transition-all duration-200 ease-out'}
        ${className}
      `}
      {...attributes}
    >
      {/* Full-width draggable header bar */}
      {!disabled && (
        <div
          {...listeners}
          className={`
            w-full h-1.5 rounded-t-xl cursor-grab active:cursor-grabbing
            ${isDragging
              ? 'bg-blue-400'
              : 'bg-transparent hover:bg-blue-100 group-hover:bg-blue-50'
            }
            transition-colors duration-150 ease-out
            flex items-center justify-center
          `}
          aria-label="Drag to reorder item"
          title="Drag to reorder item"
        >
          {/* Drag indicator dots (visible on hover) */}
          <div className={`
            flex gap-0.5
            ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
            transition-opacity duration-150
          `}>
            <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
            <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
            <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
          </div>
        </div>
      )}

      {/* Item content */}
      <div className={`${isDragging ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
