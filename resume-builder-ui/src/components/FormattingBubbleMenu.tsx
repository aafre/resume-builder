/**
 * Floating formatting toolbar that appears on text selection
 * Mobile-friendly bubble menu for rich text editing
 */

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { LinkInsertionModal } from './LinkInsertionModal';
import { getLinkAtPosition } from '../utils/tiptapConfig';

interface FormattingBubbleMenuProps {
  editor: Editor;
}

export const FormattingBubbleMenu: React.FC<FormattingBubbleMenuProps> = ({ editor }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<{ text: string; url: string } | null>(null);

  // Handler for opening link modal
  const handleOpenLinkModal = () => {
    // Check if we're currently on a link
    const { from } = editor.state.selection;
    const linkData = getLinkAtPosition(editor, from);

    if (linkData) {
      setEditingLink(linkData);
    } else {
      setEditingLink(null);
    }

    setShowLinkModal(true);
  };

  // Handle link insertion
  const handleLinkInsert = (linkText: string, url: string) => {
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
      // Insert new link with selected text or custom text
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, ' ');

      if (selectedText) {
        // User selected text - make it a link
        editor
          .chain()
          .focus()
          .setLink({ href: url })
          .run();
      } else {
        // No selection - insert link text
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${url}">${linkText}</a> `)
          .run();
      }
    }

    setEditingLink(null);
    setShowLinkModal(false);
  };

  // Handle link removal
  const handleLinkRemove = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run();

    setEditingLink(null);
    setShowLinkModal(false);
  };

  return (
    <>
      <BubbleMenu
        editor={editor}
        options={{
          placement: 'top',
          offset: 8,
        }}
        id="tour-bubble-menu"
        className="bubble-menu bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex items-center gap-0.5 z-50"
      >
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus:outline-none ${
            editor.isActive('bold') ? 'bg-accent/10 text-ink/80' : 'text-gray-700'
          }`}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
          aria-pressed={editor.isActive('bold')}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus:outline-none ${
            editor.isActive('italic') ? 'bg-accent/10 text-ink/80' : 'text-gray-700'
          }`}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
          aria-pressed={editor.isActive('italic')}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </button>

        {/* Underline Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus:outline-none ${
            editor.isActive('underline') ? 'bg-accent/10 text-ink/80' : 'text-gray-700'
          }`}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
          aria-pressed={editor.isActive('underline')}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
        </button>

        {/* Strikethrough Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus:outline-none ${
            editor.isActive('strike') ? 'bg-accent/10 text-ink/80' : 'text-gray-700'
          }`}
          title="Strikethrough (Ctrl+Shift+S)"
          aria-label="Strikethrough"
          aria-pressed={editor.isActive('strike')}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M17.3 14c0 1.3-.5 2.3-1.6 3-.9.7-2.2 1-3.7 1-2.8 0-4.8-1.2-6-3.6M6.2 9c0-1.3.6-2.3 1.7-3 1-.7 2.2-1 3.6-1 2.7 0 4.7 1.2 5.9 3.6M4 12h16" />
          </svg>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Link Button */}
        <button
          type="button"
          onClick={handleOpenLinkModal}
          className={`p-2 rounded transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus:outline-none ${
            editor.isActive('link') ? 'bg-accent/10 text-ink/80' : 'text-accent'
          }`}
          title="Insert Link (Ctrl+K)"
          aria-label="Insert Link"
          aria-pressed={editor.isActive('link')}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </BubbleMenu>

      {/* Link Modal */}
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
    </>
  );
};
