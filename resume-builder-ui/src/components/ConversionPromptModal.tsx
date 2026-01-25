/**
 * Conversion Prompt Modal
 *
 * Modal shown to anonymous users when they attempt actions that create new data.
 * Encourages sign-in while allowing guest continuation.
 *
 * Based on ResumeRecoveryModal pattern for consistency.
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdSecurity, MdPerson, MdInfo } from 'react-icons/md';

export interface ConversionPromptModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when user closes the modal */
  onClose: () => void;
  /** Called when user clicks "Sign In" */
  onSignIn: () => void;
  /** Called when user clicks "Continue as Guest" */
  onContinueAsGuest: () => void;
  /** Description of what action triggered the prompt (e.g., "use this template") */
  actionLabel: string;
  /** Whether the guest action is in progress */
  loading?: boolean;
}

export const ConversionPromptModal: React.FC<ConversionPromptModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onContinueAsGuest,
  actionLabel,
  loading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={loading ? undefined : onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversion-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-white px-6 py-4 rounded-t-2xl border-b border-blue-200/60">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200/40 p-2 rounded-full">
              <MdSecurity className="text-3xl text-blue-600" />
            </div>
            <h2 id="conversion-modal-title" className="text-2xl font-bold text-gray-800">
              Save Your Work
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-lg mb-2">
            You're about to <span className="font-semibold">{actionLabel}</span>.
          </p>
          <p className="text-gray-600 mb-4">
            Sign in to save your resume permanently, or continue as a guest with temporary storage.
          </p>

          {/* Info box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <MdInfo className="text-lg mt-0.5 flex-shrink-0" />
              <span>
                <strong>Why sign in?</strong> Guest data is stored temporarily and may be lost if you clear cookies or switch devices. Signing in keeps your resume safe.
              </span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Primary: Sign In */}
            <button
              type="button"
              onClick={onSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <MdSecurity className="text-xl" />
              Sign In to Save Permanently
            </button>

            {/* Secondary: Continue as Guest */}
            <button
              type="button"
              onClick={onContinueAsGuest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  Creating...
                </>
              ) : (
                <>
                  <MdPerson className="text-xl" />
                  Continue as Guest
                </>
              )}
            </button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Both options are free. Sign in uses Google, LinkedIn, or email.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConversionPromptModal;
