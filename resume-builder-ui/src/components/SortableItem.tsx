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
  /** Position of the drag handle */
  dragHandlePosition?: 'left' | 'right';
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * SortableItem Component
 *
 * A reusable wrapper that makes items draggable within a SortableContext.
 * Uses a compact drag handle (6-dot grip icon) that appears on hover.
 *
 * Features:
 * - Compact drag handle for items (smaller than section handle)
 * - Visual feedback during drag (opacity, scale, shadow)
 * - Configurable handle position (left or right)
 * - Support for disabled state
 * - Touch and keyboard accessible
 *
 * @example
 * <SortableItem id="experience-work-item-0" dragHandlePosition="left">
 *   <ExperienceCard experience={experience} />
 * </SortableItem>
 */
const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  disabled = false,
  dragHandlePosition = 'left',
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

  // 6-dot grip icon for drag handle (compact version)
  const DragHandleIcon = () => (
    <svg
      className="w-3.5 h-3.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      <path d="M13 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM13 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM13 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );

  const dragHandle = !disabled && (
    <div
      {...listeners}
      className={`
        flex items-center justify-center w-5 h-5 rounded
        text-gray-300 hover:text-blue-600 hover:bg-blue-50/50
        cursor-grab active:cursor-grabbing
        opacity-0 group-hover:opacity-100
        transition-all duration-150 ease-out
        touch-manipulation
        ${dragHandlePosition === 'right' ? 'order-last' : 'order-first'}
      `}
      aria-label="Drag to reorder item"
      title="Drag to reorder"
    >
      <DragHandleIcon />
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? 'opacity-50 scale-[1.02] shadow-lg z-30' : 'transition-all duration-200 ease-out'}
        ${className}
      `}
      {...attributes}
    >
      <div className={`flex items-start gap-1 ${dragHandlePosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
        {dragHandle}
        <div className={`flex-1 ${isDragging ? 'pointer-events-none' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
