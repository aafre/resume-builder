/**
 * Component that shows a preview of markdown links below text inputs
 */

import React from 'react';
import { TextSelect } from 'lucide-react';
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
    <div className={`mt-1 text-sm text-ink ${className}`}>
      <div className="flex items-start gap-2">
        <span className="shrink-0 pt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-accent-text">
          Preview
        </span>
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
 * The "select text to format it" affordance for a rich-text field.
 *
 * This used to render an always-on `💡 Tip: …` line under every editable block —
 * eight-plus copies of the same sentence down one page, which is wallpaper, not
 * help. The canonical, always-readable copy of this guidance lives once in
 * `FormattingHelp` ("Edit & Format").
 *
 * What is left here is the in-context reminder, revealed only while the field
 * group it belongs to has focus (`.markdown-hint` in styles.css; the parent is
 * the `:focus-within` subject, so no call site had to change). It keeps its
 * space reserved at rest, so revealing it never shifts the field you are typing
 * in, and it is `aria-hidden` because it is a mouse-selection affordance that
 * the canonical help card already states once for assistive tech.
 */
export const MarkdownHint: React.FC<MarkdownHintProps> = ({
  show = true,
  className = '',
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`markdown-hint ${className}`} aria-hidden="true">
      <TextSelect className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
      <span>Select text to format it</span>
    </div>
  );
};
