import React from 'react';

interface DragTooltipProps {
  /** Whether to show the tooltip (typically !isDragging && !isSorting) */
  visible?: boolean;
  /** Tooltip text */
  text?: string;
}

/**
 * DragTooltip Component
 *
 * Polite tooltip that appears after hovering on drag handle for ~700ms.
 * Implements "Helpful on Demand" - only shows when user pauses on handle.
 *
 * Uses `group-hover/handle:opacity-100` to only trigger on handle hover,
 * not the entire item.
 */
const DragTooltip: React.FC<DragTooltipProps> = ({
  visible = true,
  text = 'Drag to reorder',
}) => {
  if (!visible) return null;

  return (
    <span
      className="
        absolute -top-8 left-1/2 -translate-x-1/2 z-50
        px-2 py-1 text-xs text-white bg-slate-800 rounded
        opacity-0 group-hover/handle:opacity-100
        transition-opacity duration-200 delay-700
        pointer-events-none whitespace-nowrap
        after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
        after:border-4 after:border-transparent after:border-t-slate-800
      "
    >
      {text}
    </span>
  );
};

export default DragTooltip;
