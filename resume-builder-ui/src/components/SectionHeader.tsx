// src/components/SectionHeader.tsx

import React, { useState } from "react";
import { EditableTitle } from "./EditableTitle";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
  /** The section title */
  title: string;
  /** Whether the title is currently being edited */
  isEditing: boolean;
  /** Temporary title during editing */
  temporaryTitle: string;
  /** Callback when edit is initiated */
  onTitleEdit: () => void;
  /** Callback when title is saved */
  onTitleSave: () => void;
  /** Callback when title edit is cancelled */
  onTitleCancel: () => void;
  /** Callback when temporary title changes */
  onTitleChange: (newTitle: string) => void;
  /** Callback when delete is confirmed */
  onDelete: () => void;
  /** Whether to show the rename hint */
  showHint?: boolean;
  /** Whether to show delete confirmation */
  showDeleteConfirm?: boolean;
  /** Callback to set delete confirmation state */
  setShowDeleteConfirm?: (show: boolean) => void;
}

/**
 * SectionHeader Component
 *
 * A reusable header component for resume sections that includes:
 * - Editable title with pencil icon
 * - Delete button with confirmation
 * - Consistent styling across all section types
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Work Experience"
 *   isEditing={isEditingTitle}
 *   temporaryTitle={tempTitle}
 *   onTitleEdit={handleStartEdit}
 *   onTitleSave={handleSave}
 *   onTitleCancel={handleCancel}
 *   onTitleChange={setTempTitle}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isEditing,
  temporaryTitle,
  onTitleEdit,
  onTitleSave,
  onTitleCancel,
  onTitleChange,
  onDelete,
  showHint = false,
  showDeleteConfirm: externalShowDeleteConfirm,
  setShowDeleteConfirm: externalSetShowDeleteConfirm,
}) => {
  // Internal delete confirmation state (if not provided externally)
  const [internalShowDeleteConfirm, setInternalShowDeleteConfirm] = useState(false);

  // Use external state if provided, otherwise use internal state
  const showDeleteConfirm = externalShowDeleteConfirm ?? internalShowDeleteConfirm;
  const setShowDeleteConfirm = externalSetShowDeleteConfirm ?? setInternalShowDeleteConfirm;

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <EditableTitle
        title={title}
        isEditing={isEditing}
        temporaryTitle={temporaryTitle}
        onEdit={onTitleEdit}
        onSave={onTitleSave}
        onCancel={onTitleCancel}
        onTitleChange={onTitleChange}
        showHint={showHint}
      />

      <div className="flex items-center gap-2">
        {showDeleteConfirm ? (
          <>
            <span className="text-sm text-gray-600">Delete this section?</span>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
              title="Confirm Delete"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition-colors"
              title="Cancel Delete"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
            title="Remove Section"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
