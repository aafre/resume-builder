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
    isOver,
    isSorting,
  } = useSortable({ id, disabled });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  // Show drop indicator when this section is being hovered over during a drag
  const showDropIndicator = isOver && !isDragging && isSorting;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-2xl ${
        isDragging
          ? 'opacity-0 pointer-events-none'
          : 'transition-all duration-200 ease-out'
      } ${showDropIndicator ? 'mt-3' : ''}`}
      {...attributes}
    >
      {/* Drop indicator line - shows where section will be placed */}
      {showDropIndicator && (
        <div className="absolute -top-2 left-0 right-0 flex items-center gap-2 z-40 px-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg flex items-center justify-center">
            <div className="w-2 h-0.5 bg-white rounded-full" />
          </div>
          <div className="flex-1 h-1 bg-blue-500 rounded-full shadow-md" />
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg flex items-center justify-center">
            <div className="w-2 h-0.5 bg-white rounded-full" />
          </div>
        </div>
      )}

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
