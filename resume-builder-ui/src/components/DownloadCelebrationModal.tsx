import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DownloadCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

const DownloadCelebrationModal: React.FC<DownloadCelebrationModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management - auto-focus primary button when modal opens
  useEffect(() => {
    if (isOpen && primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab as any);
    return () => modal.removeEventListener("keydown", handleTab as any);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-modal-title"
          aria-describedby="celebration-modal-description"
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-modal-enter"
        >
          {/* Celebration Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {/* Main checkmark circle with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center animate-scale-in shadow-lg">
              {/* Checkmark SVG */}
              <svg
                className="w-12 h-12 text-white animate-checkmark-draw"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: "24",
                    strokeDashoffset: "0",
                  }}
                />
              </svg>
            </div>

            {/* Pulsing ring effect */}
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
          </div>

          {/* Title */}
          <h2
            id="celebration-modal-title"
            className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900"
          >
            Resume Downloaded Successfully! 🎉
          </h2>

          {/* Success Message */}
          <p className="text-lg text-gray-700 text-center mb-4">
            Your PDF has been saved to your device.
          </p>

          {/* Warning Box */}
          <div
            id="celebration-modal-description"
            className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4"
          >
            <p className="text-sm text-amber-800">
              <span className="font-semibold">⚠️ Warning:</span> Since you are a guest, this
              resume is only saved in your browser's temporary cache. If you clear your cache,
              you will lose this data.
            </p>
          </div>

          {/* Value Proposition */}
          <p className="text-gray-600 text-center mb-6">
            Create a free account to save this version securely to the cloud and edit it
            anytime.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            {/* Secondary Button (Left on desktop) */}
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 font-medium px-8 py-3.5 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              No thanks, I'll risk it
            </button>

            {/* Primary Button (Right on desktop) */}
            <button
              ref={primaryButtonRef}
              onClick={onSignUp}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Save to Cloud (Free)
            </button>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes modal-enter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-checkmark-draw {
          animation: checkmark-draw 0.6s ease-in-out 0.3s forwards;
        }

        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
};

export default DownloadCelebrationModal;
