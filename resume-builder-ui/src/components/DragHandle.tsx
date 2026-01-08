import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragHandleProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  /** When true, drag handles are always visible with blue highlight */
  isReorderModeActive?: boolean;
}

const DragHandle: React.FC<DragHandleProps> = ({ id, children, disabled = false, isReorderModeActive = false }) => {
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
          ? 'opacity-60 scale-105 shadow-2xl z-50' 
          : 'transition-all duration-200 ease-out'
      }`}
      {...attributes}
    >
      {!disabled && (
        <div
          {...listeners}
          className={`absolute left-2 top-6 w-6 h-6 flex items-center justify-center rounded-lg
                     cursor-grab active:cursor-grabbing
                     transition-all duration-150 ease-out z-10
                     ${isReorderModeActive
                       ? 'opacity-100 text-blue-600 bg-blue-50 ring-2 ring-blue-300'
                       : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-blue-600 hover:bg-blue-50/50'
                     }`}
          aria-label="Drag to reorder section"
          title="Drag to reorder section"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            <path d="M6 6a2 2 0 110-4 2 2 0 010 4zM6 12a2 2 0 110-4 2 2 0 010 4zM6 18a2 2 0 110-4 2 2 0 010 4z" />
            <path d="M14 6a2 2 0 110-4 2 2 0 010 4zM14 12a2 2 0 110-4 2 2 0 010 4zM14 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      )}
      
      <div className={`
        ${!disabled ? 'pl-2' : ''} 
        ${isDragging ? 'pointer-events-none' : ''}
        transition-all duration-200 ease-out rounded-2xl
        group-hover:shadow-xl group-hover:border-blue-200/60
      `}>
        {children}
      </div>
    </div>
  );
};

export default DragHandle;