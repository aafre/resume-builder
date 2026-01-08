// src/components/shared/ReorderableItemControls.tsx
// Reusable move up/down controls for items within sections during reorder mode

import React from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

export interface ReorderableItemControlsProps {
  /** Index of the item in the list */
  index: number;
  /** Total number of items in the list */
  total: number;
  /** Callback when move up is clicked */
  onMoveUp: () => void;
  /** Callback when move down is clicked */
  onMoveDown: () => void;
  /** Whether controls should be visible (typically when reorder mode is active) */
  isVisible: boolean;
}

/**
 * ReorderableItemControls Component
 *
 * Displays compact up/down buttons for reordering items within a section.
 * Only visible when reorder mode is active.
 *
 * Features:
 * - Compact vertical button layout
 * - Disabled state at boundaries (first/last item)
 * - Amber theme matching reorder mode UI
 * - Touch-friendly sizing
 *
 * @example
 * <ReorderableItemControls
 *   index={itemIndex}
 *   total={items.length}
 *   onMoveUp={() => moveItemUp(sectionIndex, itemIndex)}
 *   onMoveDown={() => moveItemDown(sectionIndex, itemIndex)}
 *   isVisible={isReorderModeActive}
 * />
 */
const ReorderableItemControls: React.FC<ReorderableItemControlsProps> = ({
  index,
  total,
  onMoveUp,
  onMoveDown,
  isVisible,
}) => {
  if (!isVisible) return null;

  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  return (
    <div className="flex flex-col items-center mr-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        disabled={!canMoveUp}
        className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move item up"
        title="Move up"
      >
        <MdKeyboardArrowUp className="text-lg" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        disabled={!canMoveDown}
        className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move item down"
        title="Move down"
      >
        <MdKeyboardArrowDown className="text-lg" />
      </button>
    </div>
  );
};

export default ReorderableItemControls;
