import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface InlineTextEditorProps {
  /** Current value */
  value: string;
  /** Callback when value is saved */
  onSave: (newValue: string) => void;
  /** Callback when editing starts */
  onStartEdit?: () => void;
  /** Callback when editing is cancelled */
  onCancel?: () => void;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** CSS classes for the text display */
  textClassName?: string;
  /** CSS classes for the input field */
  inputClassName?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Element type for display mode */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

/**
 * InlineTextEditor Component
 *
 * A click-to-edit text component that seamlessly transitions between
 * display and edit modes. Saves on Enter/blur, cancels on Escape.
 *
 * @example
 * ```tsx
 * <InlineTextEditor
 *   value={sectionTitle}
 *   onSave={(newTitle) => updateTitle(newTitle)}
 *   as="h2"
 *   textClassName="text-xl font-semibold"
 * />
 * ```
 */
export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  value,
  onSave,
  onStartEdit,
  onCancel,
  placeholder = 'Click to edit...',
  className = '',
  textClassName = '',
  inputClassName = '',
  disabled = false,
  as: Component = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync editValue when value prop changes (and not editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = useCallback(() => {
    if (disabled) return;
    setEditValue(value);
    setIsEditing(true);
    onStartEdit?.();
  }, [disabled, value, onStartEdit]);

  const handleSave = useCallback(() => {
    const trimmedValue = editValue.trim();
    // Don't allow empty values - revert to original
    // (useEffect will sync editValue when isEditing becomes false)
    if (trimmedValue === '') {
      setIsEditing(false);
      return;
    }
    // Only call onSave if value actually changed
    if (trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    // useEffect will sync editValue when isEditing becomes false
    setIsEditing(false);
    onCancel?.();
  }, [onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          bg-white border border-accent/70 rounded px-2 py-1
          focus:outline-none focus:ring-2 focus:ring-accent
          ${textClassName}
          ${inputClassName}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        aria-label="Edit text"
      />
    );
  }

  return (
    <Component
      onClick={handleStartEdit}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartEdit();
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Edit: ${value || placeholder}`}
      className={`
        cursor-pointer rounded px-2 py-1 -mx-2 -my-1
        border border-transparent
        hover:border-gray-300 hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
        transition-colors duration-150
        ${disabled ? 'cursor-default hover:border-transparent hover:bg-transparent' : ''}
        ${!value ? 'text-gray-400 italic' : ''}
        ${textClassName}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {value || placeholder}
    </Component>
  );
};

export default InlineTextEditor;
