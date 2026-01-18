import React from 'react';

interface GripDotsProps {
  /** Hide dots when item is being dragged */
  isDragging?: boolean;
}

/**
 * GripDots Component
 *
 * Visual indicator for drag handles. Shows 3 subtle dots that reveal on hover.
 * Implements "Quiet by Default" - invisible until user hovers on item.
 *
 * Uses Tailwind group modifiers:
 * - `group-hover:opacity-50` - subtle reveal on item hover
 * - `group-hover/handle:opacity-80` - stronger on handle hover
 */
const GripDots: React.FC<GripDotsProps> = ({ isDragging = false }) => {
  return (
    <div
      className={`
        flex gap-1
        ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-50 group-hover/handle:opacity-80'}
        transition-opacity duration-200
      `}
    >
      <div className="w-1 h-1 rounded-full bg-gray-400" />
      <div className="w-1 h-1 rounded-full bg-gray-400" />
      <div className="w-1 h-1 rounded-full bg-gray-400" />
    </div>
  );
};

export default GripDots;
