/**
 * Template Selection Modal
 *
 * Modal for selecting a resume template style before editing.
 * Used in the "Edit This Template" flow on job example pages.
 *
 * Features:
 * - Responsive layout: single column on mobile, 2x2 grid on desktop
 * - Visual selection feedback with checkmark
 * - "Best for..." decision support tags
 * - Keyboard accessible (Escape to close)
 * - Touch-friendly with sticky action bar on mobile
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdCheck } from 'react-icons/md';
import { fetchTemplates } from '../services/templates';

/** Decision support taglines for each template */
const TEMPLATE_BEST_FOR: Record<string, string> = {
  modern: 'Best for tech & startups',
  professional: 'Best for corporate & finance',
  elegant: 'Best for creative & design',
  minimalist: 'Best for academia & research',
};

export interface Template {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface TemplateSelectionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when user closes the modal */
  onClose: () => void;
  /** Called when user selects a template and clicks Continue */
  onSelect: (templateId: string) => void;
  /** Pre-selected template ID (optional) */
  initialTemplateId?: string;
  /** For testing: inject templates instead of fetching */
  _testTemplates?: Template[];
}

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialTemplateId,
  _testTemplates,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<Template[]>(_testTemplates || []);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    initialTemplateId || null
  );
  const [loading, setLoading] = useState(!_testTemplates);
  const [error, setError] = useState<string | null>(null);

  // Memoized template loading function
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTemplates();
      setTemplates(data);
      // Select first template by default if none selected
      setSelectedTemplateId((current) => {
        if (!current && data.length > 0) {
          return data[0].id;
        }
        return current;
      });
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch templates when modal opens (skip if test templates provided)
  useEffect(() => {
    if (!isOpen || _testTemplates) return;
    loadTemplates();
  }, [isOpen, _testTemplates, loadTemplates]);

  // Handle test templates
  useEffect(() => {
    if (_testTemplates && _testTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(_testTemplates[0].id);
    }
  }, [_testTemplates, selectedTemplateId]);

  // Reset selection when initialTemplateId changes
  useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplateId(initialTemplateId);
    }
  }, [initialTemplateId]);

  // Auto-focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleContinue = () => {
    if (selectedTemplateId) {
      onSelect(selectedTemplateId);
    }
  };

  const handleRetry = () => {
    loadTemplates();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-selection-modal-title"
      data-testid="template-selection-modal-backdrop"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        data-testid="template-selection-modal"
      >
        {/* Header - compact with inline close button */}
        <div className="px-4 py-3 lg:py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2
              id="template-selection-modal-title"
              className="text-lg lg:text-xl font-bold text-gray-800"
            >
              Choose Your Style
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 hidden lg:block">
              Select a template that matches your professional image
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 -mr-2"
            aria-label="Close modal"
            data-testid="template-selection-close"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div
              className="flex items-center justify-center py-12"
              data-testid="template-selection-loading"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading templates...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12" data-testid="template-selection-error">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
              data-testid="template-selection-grid"
            >
              {templates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                const bestFor = TEMPLATE_BEST_FOR[template.id] || '';
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`group relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 text-left active:scale-[0.98] flex flex-row lg:flex-col ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    data-testid={`template-option-${template.id}`}
                    aria-pressed={isSelected}
                  >
                    {/* Template Preview Image - fixed width on mobile, full width on desktop */}
                    <div className="relative w-28 sm:w-32 lg:w-full aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
                      <img
                        src={template.image_url}
                        alt={template.name}
                        className="w-full h-full object-contain p-2 lg:p-3 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Selection indicator */}
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg"
                          data-testid={`template-selected-${template.id}`}
                        >
                          <MdCheck size={16} />
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="flex-1 p-3 lg:p-4 flex flex-col justify-center">
                      <h3
                        className={`font-semibold text-sm lg:text-base ${
                          isSelected ? 'text-blue-600' : 'text-gray-800'
                        }`}
                      >
                        {template.name}
                      </h3>
                      {bestFor && (
                        <p
                          className="text-xs text-gray-500 mt-1"
                          data-testid={`template-bestfor-${template.id}`}
                        >
                          {bestFor}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 hidden lg:block">
                        {template.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - sticky on mobile with safe-area padding */}
        <div
          className="sticky bottom-0 lg:relative border-t border-gray-200 bg-white px-4 py-3 lg:py-4"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedTemplateId || loading}
            className="w-full lg:w-auto lg:ml-auto lg:block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            data-testid="template-selection-continue"
          >
            Use This Style
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TemplateSelectionModal;
