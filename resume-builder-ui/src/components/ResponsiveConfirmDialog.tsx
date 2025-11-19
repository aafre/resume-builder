import React from "react";
import { MdWarning, MdClose } from "react-icons/md";

interface ResponsiveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

/**
 * Responsive confirmation dialog
 * - Mobile/Tablet: Bottom sheet that slides up
 * - Desktop: Center modal
 *
 * Prevents accidental destructive actions with clear confirmations
 */
const ResponsiveConfirmDialog: React.FC<ResponsiveConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass,
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Default button styles based on action type
  const defaultConfirmClass = isDestructive
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  const confirmClass = confirmButtonClass || defaultConfirmClass;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container - Bottom sheet on mobile, center modal on desktop */}
      <div
        className="fixed z-[9999]
          bottom-0 left-0 right-0
          lg:inset-0 lg:flex lg:items-center lg:justify-center
          animate-slide-up lg:animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Dialog Content */}
        <div
          className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl
            w-full lg:max-w-md
            max-h-[85vh] lg:max-h-[90vh]
            flex flex-col
            transform transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-start gap-3 flex-1">
              {isDestructive && (
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <MdWarning className="text-red-600 text-xl" aria-hidden="true" />
                </div>
              )}
              <div className="flex-1">
                <h2
                  id="dialog-title"
                  className={`text-lg font-bold ${
                    isDestructive ? "text-red-900" : "text-gray-900"
                  }`}
                >
                  {title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
              aria-label="Close dialog"
              disabled={isLoading}
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <p
              id="dialog-description"
              className="text-gray-700 leading-relaxed"
            >
              {message}
            </p>
          </div>

          {/* Actions - Mobile: Stack vertically, Desktop: Side by side */}
          <div className="p-6 border-t border-gray-200 space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full lg:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700
                hover:bg-gray-50 active:bg-gray-100
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[48px] lg:min-h-[44px]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`w-full lg:w-auto px-6 py-3 rounded-lg font-medium
                shadow-md hover:shadow-lg active:scale-95
                transition-all disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[48px] lg:min-h-[44px]
                ${confirmClass}`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @media (min-width: 1024px) {
          .lg\\:animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
        }
      `}} />
    </>
  );
};

export default ResponsiveConfirmDialog;
