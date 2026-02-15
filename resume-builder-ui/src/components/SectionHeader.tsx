// src/components/SectionHeader.tsx

import React, { useCallback } from "react";
import { MdExpandMore, MdExpandLess, MdDeleteOutline } from "react-icons/md";
import { InlineTextEditor } from "./shared/InlineTextEditor";

/**
 * Props for the SectionHeader component.
 * Supports both legacy controlled API and new simplified API.
 */
export interface SectionHeaderProps {
  /** The section title */
  title: string;

  // === New Simplified API ===
  /** Callback when title is saved (new API - receives new title directly) */
  onTitleSave?: ((newTitle: string) => void) | (() => void);

  // === Legacy Controlled API (for backwards compatibility) ===
  /** @deprecated Use onTitleSave with newTitle parameter instead */
  isEditing?: boolean;
  /** @deprecated Use onTitleSave with newTitle parameter instead */
  temporaryTitle?: string;
  /** @deprecated Use onTitleSave with newTitle parameter instead */
  onTitleEdit?: () => void;
  /** @deprecated Use onTitleSave with newTitle parameter instead */
  onTitleCancel?: () => void;
  /** @deprecated Use onTitleSave with newTitle parameter instead */
  onTitleChange?: (newTitle: string) => void;
  /** @deprecated No longer needed */
  showHint?: boolean;
  /** @deprecated Managed internally */
  showDeleteConfirm?: boolean;
  /** @deprecated Managed internally */
  setShowDeleteConfirm?: (show: boolean) => void;

  // === Common Props ===
  /** Callback when delete is requested (optional - button hidden if not provided) */
  onDelete?: () => void;
  /** Whether the section is collapsed */
  isCollapsed?: boolean;
  /** Callback when collapse is toggled */
  onToggleCollapse?: () => void;
}

/**
 * SectionHeader Component
 *
 * A clean header component for resume sections that includes:
 * - Inline editable title (click to edit, blur/enter to save)
 * - Optional delete button
 * - Optional collapse/expand toggle
 *
 * Supports both new simplified API and legacy controlled API for backwards compatibility.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onTitleSave,
  // Legacy props (kept for backwards compatibility)
  isEditing: legacyIsEditing,
  temporaryTitle: legacyTemporaryTitle,
  onTitleEdit: legacyOnTitleEdit,
  onTitleCancel: legacyOnTitleCancel,
  onTitleChange: _legacyOnTitleChange,
  // Common props
  onDelete,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Detect if using legacy API
  const isLegacyMode = legacyIsEditing !== undefined || legacyOnTitleEdit !== undefined;

  // Handle title save - pass the new title directly to bypass async state update issues
  const handleTitleSave = useCallback((newTitle: string) => {
    if (!onTitleSave) {
      return;
    }

    // Always pass the new title directly to avoid async state timing issues
    // The onTitleSave handler now accepts an optional newTitle parameter
    (onTitleSave as (newTitle: string) => void)(newTitle);
  }, [onTitleSave]);

  // Determine the displayed/editable value
  const displayValue = isLegacyMode && legacyIsEditing && legacyTemporaryTitle !== undefined
    ? legacyTemporaryTitle
    : title;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Collapse/Expand Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 text-gray-600 hover:text-accent hover:bg-accent/[0.06] rounded-lg transition-colors flex-shrink-0"
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            title={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? (
              <MdExpandMore className="text-2xl" />
            ) : (
              <MdExpandLess className="text-2xl" />
            )}
          </button>
        )}

        <InlineTextEditor
          value={displayValue}
          onSave={handleTitleSave}
          onStartEdit={isLegacyMode ? legacyOnTitleEdit : undefined}
          onCancel={isLegacyMode ? legacyOnTitleCancel : undefined}
          as="h2"
          textClassName="text-xl font-semibold text-gray-900"
          placeholder="Section title..."
        />
      </div>

      {onDelete && (
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
            title="Remove Section"
            aria-label={`Remove ${title || 'Section'}`}
          >
            <MdDeleteOutline className="text-lg" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};
