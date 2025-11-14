/**
 * TipTap editor configuration and markdown conversion utilities
 */

import { Extension } from '@tiptap/core';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';

/**
 * Get TipTap extensions for single-line input (no line breaks)
 */
export const getSingleLineExtensions = (placeholder: string = '', onLinkShortcut?: () => void) => {
  return [
    Document,
    Paragraph,
    Text,
    Link.configure({
      openOnClick: false, // We handle click ourselves for double-click edit
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    // Keyboard shortcuts extension
    Extension.create({
      name: 'customShortcuts',
      addKeyboardShortcuts() {
        return {
          Enter: () => true, // Prevent Enter key for single-line
          'Mod-k': () => {
            // Ctrl+K (Windows/Linux) or Cmd+K (Mac) for links
            if (onLinkShortcut) {
              onLinkShortcut();
              return true;
            }
            return false;
          },
        };
      },
    }),
  ];
};

/**
 * Get TipTap extensions for multi-line input (allows line breaks)
 */
export const getMultiLineExtensions = (placeholder: string = '', onLinkShortcut?: () => void) => {
  return [
    Document,
    Paragraph,
    Text,
    HardBreak,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    // Keyboard shortcuts extension
    Extension.create({
      name: 'customShortcuts',
      addKeyboardShortcuts() {
        return {
          'Mod-k': () => {
            // Ctrl+K (Windows/Linux) or Cmd+K (Mac) for links
            if (onLinkShortcut) {
              onLinkShortcut();
              return true;
            }
            return false;
          },
        };
      },
    }),
  ];
};

/**
 * Convert markdown text to HTML for TipTap
 * Simple converter that handles [text](url) syntax
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  // Convert markdown links to HTML
  const html = markdown.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Convert line breaks to <br> for multi-line
  return html.replace(/\n/g, '<br>');
};

/**
 * Convert TipTap HTML to markdown
 * Extracts links and converts them back to [text](url) format
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';

  // Remove paragraph tags
  let markdown = html.replace(/<p>/g, '').replace(/<\/p>/g, '\n');

  // Convert HTML links to markdown
  markdown = markdown.replace(
    /<a href="([^"]+)">([^<]+)<\/a>/g,
    '[$2]($1)'
  );

  // Convert <br> to newlines
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');

  // Clean up extra whitespace
  markdown = markdown.trim();

  // Remove trailing newlines
  markdown = markdown.replace(/\n+$/, '');

  return markdown;
};

/**
 * Extract link from TipTap editor at a specific position
 * Used for double-click link editing
 */
export const getLinkAtPosition = (editor: any, pos: number): { text: string; url: string } | null => {
  const { state } = editor;
  const { doc } = state;

  try {
    const resolvedPos = doc.resolve(pos);
    const node = resolvedPos.parent;

    // Check if we're in a text node
    if (node && node.type.name === 'paragraph') {
      let linkNode = null;
      let linkText = '';
      let linkUrl = '';

      // Find the link mark in the current position
      node.forEach((child: any, offset: number) => {
        const childStart = resolvedPos.start() + offset;
        const childEnd = childStart + child.nodeSize;

        if (pos >= childStart && pos <= childEnd) {
          const marks = child.marks || [];
          const linkMark = marks.find((mark: any) => mark.type.name === 'link');

          if (linkMark && child.text) {
            linkNode = child;
            linkText = child.text;
            linkUrl = linkMark.attrs.href;
          }
        }
      });

      if (linkNode && linkUrl) {
        return { text: linkText, url: linkUrl };
      }
    }
  } catch (error) {
    console.error('Error extracting link:', error);
  }

  return null;
};
