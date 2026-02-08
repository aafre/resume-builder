/**
 * Utility for rendering markdown-style links [text](url) as clickable HTML links
 */

import React from 'react';

/**
 * Convert markdown links in text to React elements with clickable links
 * Supports markdown syntax: [Link Text](https://example.com)
 *
 * @param text - Text containing markdown links
 * @returns Array of React elements (strings and link elements)
 */
export const renderMarkdownLinks = (text: string | null | undefined): React.ReactNode => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Regex to match markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index;

    // Add text before the link
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Add the link element
    parts.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-ink underline"
      >
        {linkText}
      </a>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no links were found, return original text
  return parts.length > 0 ? parts : text;
};

/**
 * Check if text contains markdown links
 * @param text - Text to check
 * @returns true if text contains markdown link syntax
 */
export const hasMarkdownLinks = (text: string | null | undefined): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return /\[([^\]]+)\]\(([^\)]+)\)/.test(text);
};

/**
 * Extract all URLs from markdown links in text
 * @param text - Text containing markdown links
 * @returns Array of URLs found in markdown links
 */
export const extractMarkdownLinkUrls = (text: string | null | undefined): string[] => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const markdownLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    urls.push(match[2]);
  }

  return urls;
};
