import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MdWarning, MdClose, MdSecurity, MdPerson } from 'react-icons/md';

interface ResumeRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeTitle: string;
  resumeId: string;
  onContinueAsGuest: () => void;
  onSignInToContinue: () => void;
  onCreateNew?: () => void;
  templateName: string;
  isAnonymous: boolean;
}

export const ResumeRecoveryModal: React.FC<ResumeRecoveryModalProps> = ({
  isOpen,
  onClose,
  resumeTitle,
  onContinueAsGuest,
  onSignInToContinue,
  onCreateNew,
  templateName,
  isAnonymous,
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
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>

        {/* Header with warning icon */}
        <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white px-6 py-4 rounded-t-2xl border-b border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="bg-amber-200/40 p-2 rounded-full">
              <MdWarning className="text-3xl text-amber-600" />
            </div>
            <h2 id="recovery-modal-title" className="text-2xl font-bold text-gray-800">
              {isAnonymous ? 'Unsaved Work Found' : 'Resume Found'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAnonymous ? (
            // Anonymous user copy (conversion-focused)
            <>
              <p className="text-gray-700 text-lg mb-2">
                We noticed you were working on a resume <span className="font-semibold">"{resumeTitle}"</span>.
              </p>
              <p className="text-gray-600 mb-4">
                It is currently stored in a temporary session. You are at risk of losing it.
              </p>

              {/* Warning box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <MdWarning className="text-lg mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Why sign in?</strong> Your work is stored temporarily and will be lost if you clear cookies or use a different device.
                  </span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {/* Primary: Sign In to Secure */}
                <button
                  onClick={onSignInToContinue}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  <MdSecurity className="text-xl" />
                  Sign In to Secure & Continue
                </button>

                {/* Secondary: Continue as Guest */}
                <button
                  onClick={onContinueAsGuest}
                  className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <MdPerson className="text-xl" />
                  Continue as Guest
                </button>
              </div>
            </>
          ) : (
            // Authenticated user copy (de-duplication-focused)
            <>
              <p className="text-gray-700 text-lg mb-2">
                We noticed you already have a resume <span className="font-semibold">"{resumeTitle}"</span> using the <span className="font-semibold">{templateName}</span> template.
              </p>
              <p className="text-gray-600 mb-6">
                Would you like to edit that one or start fresh?
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                {/* Primary: Continue Editing */}
                <button
                  onClick={onContinueAsGuest}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Continue Editing
                </button>

                {/* Secondary: Create New Resume */}
                {onCreateNew && (
                  <button
                    onClick={onCreateNew}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Create New Resume
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ResumeRecoveryModal;
