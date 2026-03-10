import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GripDots from './GripDots';
import DragTooltip from './DragTooltip';

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
          ? 'border-2 border-dashed border-accent/30 bg-accent/[0.06] min-h-[60px]'
          : 'transition-all duration-200 ease-out'
      } ${showDropIndicator ? 'mt-3' : ''}`}
    >
      {/* Drop indicator line - shows where section will be placed */}
      {showDropIndicator && (
        <div className="absolute -top-2 left-0 right-0 flex items-center gap-2 z-40 px-2">
          <div className="w-4 h-4 rounded-full bg-accent shadow-lg flex items-center justify-center">
            <div className="w-2 h-0.5 bg-white rounded-full" />
          </div>
          <div className="flex-1 h-1 bg-accent rounded-full shadow-md" />
          <div className="w-4 h-4 rounded-full bg-accent shadow-lg flex items-center justify-center">
            <div className="w-2 h-0.5 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* Drag handle bar - invisible by default, reveals on item hover */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className={`
            group/handle touch-none
            w-full h-4 md:h-2 min-h-[44px] md:min-h-0 rounded-t-2xl cursor-grab active:cursor-grabbing
            ${isDragging
              ? 'bg-accent/[0.06]'
              : 'bg-transparent'
            }
            transition-all duration-150 ease-out
            flex items-center justify-center
            relative
          `}
          aria-label="Drag to reorder section"
          role="button"
          tabIndex={0}
        >
          <GripDots isDragging={isDragging} />
          <DragTooltip visible={!isDragging && !isSorting} />
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
