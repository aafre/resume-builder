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
 * Implements "Quiet by Default, Helpful on Demand" UX:
 * - Default: Clean, no visible controls
 * - Hover: Subtle spotlight + grip handle reveals
 * - Handle hover (after delay): Polite tooltip appears
 * - Dragging: Ghost placeholder marks landing zone
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
          ? 'border-2 border-dashed border-blue-300 bg-blue-50/50 min-h-[60px]'
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

      {/* Drag handle bar - invisible by default, reveals on item hover */}
      {!disabled && (
        <div
          {...listeners}
          className={`
            group/handle
            w-full h-4 md:h-2 rounded-t-2xl cursor-grab active:cursor-grabbing
            ${isDragging
              ? 'bg-blue-50'
              : 'bg-transparent'
            }
            transition-all duration-150 ease-out
            flex items-center justify-center
            relative
          `}
          aria-label="Drag to reorder section"
        >
          {/* Grip dots - only visible on section hover, hidden by default */}
          <div className={`
            flex gap-1
            ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-50 group-hover/handle:opacity-80'}
            transition-opacity duration-200
          `}>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
          </div>

          {/* Polite tooltip - only appears when hovering on handle after ~800ms delay */}
          {!isDragging && !isSorting && (
            <span className="
              absolute -top-8 left-1/2 -translate-x-1/2 z-50
              px-2 py-1 text-xs text-white bg-slate-800 rounded
              opacity-0 group-hover/handle:opacity-100
              transition-opacity duration-200 delay-700
              pointer-events-none whitespace-nowrap
              after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
              after:border-4 after:border-transparent after:border-t-slate-800
            ">
              Drag to reorder
            </span>
          )}
        </div>
      )}

      {/* Section content - hidden when dragging to show ghost placeholder */}
      <div className={`
        ${isDragging ? 'opacity-0 pointer-events-none' : ''}
        transition-all duration-200 ease-out
      `}>
        {children}
      </div>
    </div>
  );
};

export default DragHandle;
