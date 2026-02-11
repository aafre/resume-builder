// src/components/EditableTitle.tsx

import React from "react";

/**
 * Props for the EditableTitle component.
 */
export interface EditableTitleProps {
  /** The current title text */
  title: string;
  /** Whether the title is currently being edited */
  isEditing: boolean;
  /** Temporary title value during editing */
  temporaryTitle: string;
  /** Callback when edit mode is activated */
  onEdit: () => void;
  /** Callback when save is clicked */
  onSave: () => void;
  /** Callback when cancel is clicked */
  onCancel: () => void;
  /** Callback when temporary title changes */
  onTitleChange: (newTitle: string) => void;
  /** Whether to show the rename hint for "New" sections */
  showHint?: boolean;
  /** Custom CSS classes for the title */
  className?: string;
}

/**
 * EditableTitle Component
 *
 * A reusable component for displaying and editing section titles.
 * Supports both view and edit modes with save/cancel actions.
 *
 * @example
 * ```tsx
 * <EditableTitle
 *   title="Work Experience"
 *   isEditing={isEditing}
 *   temporaryTitle={tempTitle}
 *   onEdit={() => setIsEditing(true)}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   onTitleChange={setTempTitle}
 * />
 * ```
 */
export const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  isEditing,
  temporaryTitle,
  onEdit,
  onSave,
  onCancel,
  onTitleChange,
  showHint = false,
  className = "text-xl font-semibold",
}) => {
  // Handle Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={temporaryTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded-lg p-2 w-full text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
          autoFocus
          placeholder="Enter section title..."
        />
        <button
          onClick={onSave}
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Save Title (Enter)"
        >
          ✅
        </button>
        <button
          onClick={onCancel}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Cancel (Esc)"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <h2
      className={`${className} ${
        title.startsWith("New ") ? "text-gray-500 italic" : ""
      }`}
    >
      {title}
      <button
        onClick={onEdit}
        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
        title="Edit Title"
      >
        ✏️
      </button>
      {title.startsWith("New ") && showHint && (
        <span className="ml-2 text-sm text-accent font-normal">
          (Click ✏️ to rename)
        </span>
      )}
    </h2>
  );
};
