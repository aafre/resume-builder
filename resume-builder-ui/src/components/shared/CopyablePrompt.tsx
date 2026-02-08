/**
 * Copyable Prompt Component
 * Displays a prompt box with a copy-to-clipboard button
 * Used on blog pages for AI prompt examples
 */

import { useState, type ReactNode } from 'react';

interface CopyablePromptProps {
  /** The prompt title (e.g., "Prompt #1: Standard Professional Summary") */
  title: string;
  /** The prompt content to display and copy */
  children: ReactNode;
  /** The text that will be copied (if different from children) */
  copyText?: string;
  /** Optional "Best for" description */
  bestFor?: string;
}

export default function CopyablePrompt({
  title,
  children,
  copyText,
  bestFor
}: CopyablePromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Get text to copy - either explicit copyText or extract from children
    const textToCopy = copyText || extractTextFromChildren(children);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h4 className="font-bold text-gray-900 mb-3">{title}</h4>
      <div
        className="group relative bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm cursor-pointer hover:border-accent/30 hover:bg-accent/[0.06] transition-colors"
        onClick={handleCopy}
      >
        <div className="pr-16">
          {children}
        </div>

        {/* Copy Button */}
        <div className="absolute right-3 top-3">
          {copied ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400 group-hover:text-accent text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden group-hover:inline">Copy</span>
            </span>
          )}
        </div>
      </div>
      {bestFor && (
        <p className="text-gray-600 mt-3 text-sm">
          <strong>Best for:</strong> {bestFor}
        </p>
      )}
    </div>
  );
}

/** Block-level elements that should have newlines after their content */
const BLOCK_ELEMENTS = ['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr', 'blockquote'];

/**
 * Extract plain text from React children for copying
 * Handles <br /> elements by converting them to newlines
 * Handles block-level elements by adding newlines after their content
 */
function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }

  if (children && typeof children === 'object' && 'type' in children) {
    // Handle <br /> elements - convert to newline
    if (children.type === 'br') {
      return '\n';
    }

    const elementType = typeof children.type === 'string' ? children.type : null;
    const isBlockElement = elementType && BLOCK_ELEMENTS.includes(elementType);

    const props = children.props as { children?: ReactNode };
    const innerText = props?.children ? extractTextFromChildren(props.children) : '';

    // Add newline after block-level elements
    return isBlockElement ? innerText.trimEnd() + '\n' : innerText;
  }

  return '';
}
