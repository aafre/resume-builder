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
 * The entire item is draggable with subtle hover/drag visual feedback.
 *
 * Features:
 * - Entire item is draggable (click anywhere to drag)
 * - Subtle ring effect on hover (ring-1 ring-blue-200)
 * - Visual feedback during drag (opacity, shadow, ring-2 ring-blue-300)
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
        relative group rounded-xl overflow-hidden
        ${isDragging
          ? 'opacity-50 shadow-lg z-30 ring-2 ring-blue-300'
          : 'transition-all duration-200 ease-out hover:ring-1 hover:ring-blue-200'
        }
        ${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}
        ${className}
      `}
      {...attributes}
      {...(disabled ? {} : listeners)}
    >
      {/* Item content */}
      <div className={`${isDragging ? 'pointer-events-none select-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
