/**
 * Modal component for inserting markdown-style links in a user-friendly way
 */

import React, { useState, useEffect, useId } from 'react';
import ModalShell from './shared/ModalShell';

interface LinkInsertionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (linkText: string, url: string) => void;
  onRemove?: () => void;
  initialText?: string;
  initialUrl?: string;
  isEditMode?: boolean;
}

/**
 * Simple modal for inserting/editing links without knowing markdown syntax
 * Users enter link text and URL separately, and the component generates [text](url)
 */
export const LinkInsertionModal: React.FC<LinkInsertionModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  onRemove,
  initialText = '',
  initialUrl = '',
  isEditMode = false,
}) => {
  const titleId = useId();
  const [linkText, setLinkText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [urlError, setUrlError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLinkText(initialText);
      setUrl(initialUrl);
      setUrlError('');
    }
  }, [isOpen, initialText, initialUrl]);

  // Validate URL format
  const validateUrl = (urlToValidate: string): boolean => {
    if (!urlToValidate.trim()) {
      setUrlError('URL is required');
      return false;
    }

    // Basic URL validation - check for common patterns
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    const isValid = urlPattern.test(urlToValidate);

    if (!isValid) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }

    setUrlError('');
    return true;
  };

  const handleInsert = () => {
    if (!validateUrl(url)) {
      return;
    }

    // Add https:// if no protocol specified
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    onInsert(linkText.trim() || finalUrl, finalUrl);
    onClose();
  };

  // Enter only. Escape is owned by ModalShell's focus trap - handling it here
  // too would fire onClose twice for one keypress.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    }
  };

  // Preview markdown
  const previewMarkdown = linkText.trim() && url.trim()
    ? `[${linkText.trim()}](${url.trim()})`
    : '';

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      panelClassName="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full"
    >
      <div onKeyDown={handleKeyDown}>
        <h3 id={titleId} className="text-xl font-semibold mb-4 text-ink">
          {isEditMode ? 'Edit Link' : 'Insert Link'}
        </h3>

        <div className="space-y-4">
          {/* Link Text Input */}
          <div>
            <label htmlFor="link-text" className="block text-sm font-medium text-ink mb-1">
              Link Text
              <span className="text-mist font-normal ml-1">(what users will see)</span>
            </label>
            <input
              id="link-text"
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="e.g., Visit our website"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-accent-text focus:border-accent transition-all"
              autoFocus
            />
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="link-url" className="block text-sm font-medium text-ink mb-1">
              URL
              <span className="text-red-500">*</span>
            </label>
            <input
              id="link-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="e.g., https://example.com"
              className={`w-full border ${
                urlError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg p-3 focus:ring-2 focus:ring-accent-text focus:border-accent transition-all`}
              aria-invalid={!!urlError}
              aria-describedby={urlError ? "url-error" : undefined}
            />
            {urlError && (
              <p id="url-error" className="text-red-500 text-sm mt-1">{urlError}</p>
            )}
          </div>

          {/* Preview */}
          {previewMarkdown && (
            <div className="bg-chalk rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Preview (markdown):</p>
              <code className="text-sm text-ink break-all">
                {previewMarkdown}
              </code>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleInsert}
            className="flex-1 bg-accent text-ink px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            {isEditMode ? 'Update Link' : 'Insert Link'}
          </button>
          {isEditMode && onRemove && (
            <button
              onClick={() => {
                onRemove();
                onClose();
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              title="Remove Link"
            >
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-ink hover:bg-chalk transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
