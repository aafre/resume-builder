import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragHandleProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * DragHandle Component
 *
 * Wraps sections with drag-and-drop functionality.
 * Features a full-width draggable header bar at the top for easy grabbing.
 */
const DragHandle: React.FC<DragHandleProps> = ({ id, children, disabled = false }) => {
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
      className={`relative group rounded-2xl ${
        isDragging
          ? 'opacity-60 shadow-2xl z-50'
          : 'transition-all duration-200 ease-out'
      }`}
      {...attributes}
    >
      {/* Full-width draggable header bar */}
      {!disabled && (
        <div
          {...listeners}
          className={`
            w-full h-2 rounded-t-2xl cursor-grab active:cursor-grabbing
            ${isDragging
              ? 'bg-blue-400'
              : 'bg-transparent hover:bg-blue-100 group-hover:bg-blue-50'
            }
            transition-colors duration-150 ease-out
            flex items-center justify-center
          `}
          aria-label="Drag to reorder section"
          title="Drag to reorder section"
        >
          {/* Drag indicator dots (visible on hover) */}
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

      {/* Section content */}
      <div className={`
        ${isDragging ? 'pointer-events-none' : ''}
        transition-all duration-200 ease-out
      `}>
        {children}
      </div>
    </div>
  );
};

export default DragHandle;
