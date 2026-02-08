/**
 * Rich text area component with floating toolbar on selection
 * Clean, clutter-free multi-line editor with formatting via bubble menu
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getMultiLineExtensions, markdownToHtml, htmlToMarkdown } from '../utils/tiptapConfig';
import { FormattingBubbleMenu } from './FormattingBubbleMenu';

interface RichTextAreaProps {
  value: string; // Markdown format
  onChange: (value: string) => void; // Returns markdown format
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

/**
 * Multi-line rich text area with floating formatting toolbar
 */
export const RichTextArea: React.FC<RichTextAreaProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  rows = 4,
  disabled = false,
}) => {
  // Initialize TipTap editor with bubble menu support
  const editor = useEditor({
    extensions: getMultiLineExtensions(placeholder),
    content: markdownToHtml(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
        role: 'textbox',
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor) {
      const currentContent = htmlToMarkdown(editor.getHTML());
      if (currentContent !== value) {
        editor.commands.setContent(markdownToHtml(value));
      }
    }
  }, [value, editor]);

  const defaultClassName = "w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all duration-200";
  const combinedClassName = className || defaultClassName;
  const minHeight = `${rows * 24 + 24}px`; // Approximate height based on rows

  return (
    <div className="relative">
      <div
        className={`${combinedClassName} relative`}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />

        {/* Floating toolbar appears on text selection */}
        {editor && <FormattingBubbleMenu editor={editor} />}
      </div>
    </div>
  );
};
