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
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { Strike } from '@tiptap/extension-strike';

/**
 * Get TipTap extensions for single-line input (no line breaks)
 */
export const getSingleLineExtensions = (placeholder: string = '') => {
  return [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    Strike,
    Link.configure({
      openOnClick: false, // We handle click ourselves for double-click edit
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    // Prevent Enter key for single-line input
    Extension.create({
      name: 'customShortcuts',
      addKeyboardShortcuts() {
        return {
          Enter: () => true,
        };
      },
    }),
  ];
};

/**
 * Get TipTap extensions for multi-line input (allows line breaks)
 */
export const getMultiLineExtensions = (placeholder: string = '') => {
  return [
    Document,
    Paragraph,
    Text,
    HardBreak,
    Bold,
    Italic,
    Underline,
    Strike,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];
};

/**
 * Convert markdown text to HTML for TipTap
 * Handles links, bold, italic, underline, and strikethrough
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  let html = markdown;

  // Convert markdown links to HTML
  html = html.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Convert bold (** or __) - must come before italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Convert italic (* or _) - after bold
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Convert strikethrough (~~)
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

  // Convert underline (++) - custom syntax
  html = html.replace(/\+\+(.+?)\+\+/g, '<u>$1</u>');

  // Convert line breaks to <br> for multi-line
  return html.replace(/\n/g, '<br>');
};

/**
 * Convert TipTap HTML to markdown
 * Handles links, bold, italic, underline, and strikethrough
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';

  // Remove paragraph tags
  let markdown = html.replace(/<p>/g, '').replace(/<\/p>/g, '\n');

  // Process HTML tags iteratively from innermost to outermost
  // This handles nested tags like <strong><em>text</em></strong>
  let prevMarkdown = '';
  let iterations = 0;
  const MAX_ITERATIONS = 10; // Safety limit for deeply nested tags

  while (prevMarkdown !== markdown && iterations < MAX_ITERATIONS) {
    prevMarkdown = markdown;
    iterations++;

    // Convert HTML links to markdown - handle complex anchor tags with multiple attributes
    // Use [^<>]* to match only innermost links (no nested tags in link text)
    markdown = markdown.replace(
      /<a\s+[^>]*href="([^"]+)"[^>]*>([^<>]*)<\/a>/g,
      '[$2]($1)'
    );

    // Convert bold (<strong> or <b>) to markdown
    // Use [^<>]* to match only innermost bold tags
    markdown = markdown.replace(/<strong>([^<>]*)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<b>([^<>]*)<\/b>/g, '**$1**');

    // Convert italic (<em> or <i>) to markdown
    markdown = markdown.replace(/<em>([^<>]*)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<i>([^<>]*)<\/i>/g, '*$1*');

    // Convert strikethrough (<s> or <del>)
    markdown = markdown.replace(/<s>([^<>]*)<\/s>/g, '~~$1~~');
    markdown = markdown.replace(/<del>([^<>]*)<\/del>/g, '~~$1~~');

    // Convert underline (<u>) - custom syntax
    markdown = markdown.replace(/<u>([^<>]*)<\/u>/g, '++$1++');
  }

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
