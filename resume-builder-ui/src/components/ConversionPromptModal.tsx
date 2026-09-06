/**
 * Conversion Prompt Modal
 *
 * Modal shown to anonymous users when they attempt actions that create new data.
 * Encourages sign-in while allowing guest continuation.
 *
 * Based on ResumeRecoveryModal pattern for consistency.
 */

import React, { useId } from 'react';
import ModalShell from './shared/ModalShell';
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
  // ModalShell owns focus-in, focus-restore and Escape. The hand-rolled
  // versions here did focus-in but never restored focus to the opener.
  const titleId = useId();

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      closeOnBackdrop={!loading}
      overlayClassName="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      panelClassName="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative"
    >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-ink/60 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-chalk-dark disabled:opacity-50"
          aria-label="Close modal"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className="bg-accent/10 px-6 py-4 rounded-t-2xl border-b border-accent/20">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-full">
              <MdSecurity className="text-3xl text-accent-text" />
            </div>
            <h2 id={titleId} className="text-2xl font-bold text-ink">
              Save Your Work
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-ink/60 text-lg mb-2">
            You're about to <span className="font-semibold">{actionLabel}</span>.
          </p>
          <p className="text-gray-600 mb-4">
            Sign in to save your resume permanently, or continue as a guest with temporary storage.
          </p>

          {/* Info box */}
          <div className="bg-accent/[0.06] border-2 border-accent/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-ink flex items-start gap-2">
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
              className="w-full flex items-center justify-center gap-2 bg-accent text-ink font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <MdSecurity className="text-xl" />
              Sign In to Save Permanently
            </button>

            {/* Secondary: Continue as Guest */}
            <button
              type="button"
              onClick={onContinueAsGuest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-ink font-semibold px-6 py-3 rounded-xl hover:border-ink/60 hover:bg-chalk transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink"></div>
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
          <p className="text-xs text-ink/60 text-center mt-4">
            Both options are free. Sign in uses Google, LinkedIn, or email.
          </p>
        </div>
    </ModalShell>
  );
};

export default ConversionPromptModal;
