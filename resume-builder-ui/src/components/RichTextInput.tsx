/**
 * Rich text input component with WYSIWYG link editing
 * Replaces plain text inputs with TipTap editor that renders links
 */

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getSingleLineExtensions, markdownToHtml, htmlToMarkdown, getLinkAtPosition } from '../utils/tiptapConfig';
import { LinkInsertionModal } from './LinkInsertionModal';

interface RichTextInputProps {
  value: string; // Markdown format
  onChange: (value: string) => void; // Returns markdown format
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Single-line rich text input with clickable links and markdown mode toggle
 */
export const RichTextInput: React.FC<RichTextInputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [editingLink, setEditingLink] = useState<{ text: string; url: string } | null>(null);
  const [markdownValue, setMarkdownValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Handler for opening link modal (called by Ctrl+K shortcut)
  const handleOpenLinkModal = () => {
    setEditingLink(null);
    setShowLinkModal(true);
  };

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: getSingleLineExtensions(placeholder, handleOpenLinkModal),
    content: markdownToHtml(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
      setMarkdownValue(markdown);
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
      // Handle double-click on links
      handleDOMEvents: {
        dblclick: (view, event) => {
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (pos && editor) {
            const linkData = getLinkAtPosition(editor, pos.pos);
            if (linkData) {
              setEditingLink(linkData);
              setShowLinkModal(true);
              event.preventDefault();
              return true;
            }
          }
          return false;
        },
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && !showMarkdown) {
      const currentContent = htmlToMarkdown(editor.getHTML());
      if (currentContent !== value) {
        editor.commands.setContent(markdownToHtml(value));
        setMarkdownValue(value);
      }
    }
  }, [value, editor, showMarkdown]);

  // Handle link insertion
  const handleLinkInsert = (linkText: string, url: string) => {
    if (!editor) return;

    if (editingLink) {
      // Update existing link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .insertContent(linkText)
        .setLink({ href: url })
        .run();
    } else {
      // Insert new link at cursor
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${linkText}</a> `)
        .run();
    }

    setEditingLink(null);
  };

  // Handle link removal
  const handleLinkRemove = () => {
    if (!editor || !editingLink) return;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run();

    setEditingLink(null);
    setShowLinkModal(false);
  };

  // Handle markdown mode change
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkdown = e.target.value;
    setMarkdownValue(newMarkdown);
    if (editor) {
      editor.commands.setContent(markdownToHtml(newMarkdown));
    }
    onChange(newMarkdown);
  };

  const defaultClassName = "w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 min-h-[44px]";
  const combinedClassName = className || defaultClassName;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 group">
        {showMarkdown ? (
          <input
            type="text"
            value={markdownValue}
            onChange={handleMarkdownChange}
            onBlur={() => setShowMarkdown(false)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={combinedClassName}
            disabled={disabled}
            autoFocus
          />
        ) : (
          <div className={`${combinedClassName} relative`}>
            <EditorContent editor={editor} />
          </div>
        )}

        {/* Buttons container - hidden by default, shown on focus/hover */}
        <div className={`flex items-center gap-2 transition-opacity duration-200 ${
          isFocused || showMarkdown ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {/* Link Button */}
          <button
            type="button"
            onClick={handleOpenLinkModal}
            disabled={disabled}
            title="Insert Link (Ctrl+K)"
            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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

          {/* Markdown Mode Toggle */}
          <button
            type="button"
            onClick={() => setShowMarkdown(!showMarkdown)}
            disabled={disabled}
            title={showMarkdown ? "Switch to Rich Text" : "Switch to Markdown"}
            className={`text-xs font-mono px-2 py-1 rounded transition-all duration-200 flex-shrink-0 ${
              showMarkdown
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            MD
          </button>
        </div>
      </div>

      <LinkInsertionModal
        isOpen={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setEditingLink(null);
        }}
        onInsert={handleLinkInsert}
        onRemove={editingLink ? handleLinkRemove : undefined}
        initialText={editingLink?.text || ''}
        initialUrl={editingLink?.url || ''}
        isEditMode={!!editingLink}
      />
    </div>
  );
};
