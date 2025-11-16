/**
 * Component that shows a preview of markdown links below text inputs
 */

import React from 'react';
import { renderMarkdownLinks, hasMarkdownLinks } from '../utils/markdownLinks';

interface MarkdownLinkPreviewProps {
  text: string;
  className?: string;
}

/**
 * Displays a preview of text with rendered markdown links
 * Only shows when markdown links are detected in the text
 */
export const MarkdownLinkPreview: React.FC<MarkdownLinkPreviewProps> = ({
  text,
  className = '',
}) => {
  if (!text || !hasMarkdownLinks(text)) {
    return null;
  }

  return (
    <div className={`mt-1 text-sm text-gray-600 ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-gray-500 shrink-0">Preview:</span>
        <div className="flex-1">{renderMarkdownLinks(text)}</div>
      </div>
    </div>
  );
};

interface MarkdownHintProps {
  show?: boolean;
  className?: string;
}

/**
 * Shows a helpful hint about link insertion and editing
 */
export const MarkdownHint: React.FC<MarkdownHintProps> = ({
  show = true,
  className = '',
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`text-xs text-gray-500 mt-1 ${className}`}>
      💡 Tip: Select text to see formatting options. Click 🔗 to add links, or type markdown syntax directly.
    </div>
  );
};
