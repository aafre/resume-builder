/**
 * Wrapper component that adds a link insertion button to any text input or textarea
 */

import React, { useState, useRef } from 'react';
import { LinkInsertionModal } from './LinkInsertionModal';

interface InputWithLinkButtonProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'input' | 'textarea';
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

/**
 * Wraps a text input or textarea with a link insertion button
 * Handles cursor position and inserts markdown links at the correct location
 */
export const InputWithLinkButton: React.FC<InputWithLinkButtonProps> = ({
  value,
  onChange,
  type = 'input',
  placeholder = '',
  className = '',
  rows = 3,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Track cursor position when input is focused
  const handleInputClick = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
  };

  const handleInputKeyUp = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
  };

  // Get selected text to pre-fill link text
  const getSelectedText = (): string => {
    if (!inputRef.current) return '';

    const start = inputRef.current.selectionStart || 0;
    const end = inputRef.current.selectionEnd || 0;

    if (start !== end) {
      return value.substring(start, end);
    }

    return '';
  };

  // Insert link at cursor position or append
  const handleLinkInsert = (linkText: string, url: string) => {
    const markdown = `[${linkText}](${url})`;

    // If text was selected, replace it
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;

      if (start !== end) {
        const newValue = value.substring(0, start) + markdown + value.substring(end);
        onChange(newValue);

        // Set cursor after inserted link
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPos = start + markdown.length;
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            inputRef.current.focus();
          }
        }, 0);
        return;
      }
    }

    // Otherwise, insert at cursor position or append
    if (cursorPosition !== null && cursorPosition >= 0) {
      const before = value.substring(0, cursorPosition);
      const after = value.substring(cursorPosition);
      const newValue = before + markdown + after;
      onChange(newValue);

      // Set cursor after inserted link
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = cursorPosition + markdown.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    } else {
      // Append at end with space
      const newValue = value + (value && !value.endsWith(' ') ? ' ' : '') + markdown;
      onChange(newValue);

      // Focus input at end
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newValue.length, newValue.length);
        }
      }, 0);
    }
  };

  const handleLinkButtonClick = () => {
    // Update cursor position right before opening modal
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
    setShowModal(true);
  };

  const defaultInputClassName = "flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200";
  const combinedClassName = className || defaultInputClassName;

  return (
    <>
      <div className="flex items-center gap-2">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={handleInputClick}
            onKeyUp={handleInputKeyUp}
            placeholder={placeholder}
            className={combinedClassName}
            rows={rows}
            disabled={disabled}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={handleInputClick}
            onKeyUp={handleInputKeyUp}
            placeholder={placeholder}
            className={combinedClassName}
            disabled={disabled}
          />
        )}

        <button
          type="button"
          onClick={handleLinkButtonClick}
          disabled={disabled}
          title="Insert Link"
          className="text-accent hover:text-ink/80 p-2 hover:bg-accent/[0.06] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </div>

      <LinkInsertionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInsert={handleLinkInsert}
        initialText={getSelectedText()}
      />
    </>
  );
};
