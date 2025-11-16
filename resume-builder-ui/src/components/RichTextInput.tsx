/**
 * Rich text input component with floating toolbar on selection
 * Clean, clutter-free design with formatting via bubble menu
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getSingleLineExtensions, markdownToHtml, htmlToMarkdown } from '../utils/tiptapConfig';
import { FormattingBubbleMenu } from './FormattingBubbleMenu';

interface RichTextInputProps {
  value: string; // Markdown format
  onChange: (value: string) => void; // Returns markdown format
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Single-line rich text input with floating formatting toolbar
 */
export const RichTextInput: React.FC<RichTextInputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
}) => {
  // Initialize TipTap editor with bubble menu support
  const editor = useEditor({
    extensions: getSingleLineExtensions(placeholder),
    content: markdownToHtml(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
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

  const defaultClassName = "w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 min-h-[44px]";
  const combinedClassName = className || defaultClassName;

  return (
    <div className="relative">
      <div className={`${combinedClassName} relative`}>
        <EditorContent editor={editor} />

        {/* Floating toolbar appears on text selection */}
        {editor && <FormattingBubbleMenu editor={editor} />}
      </div>
    </div>
  );
};
