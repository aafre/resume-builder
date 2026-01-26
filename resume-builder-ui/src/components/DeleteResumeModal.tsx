import { ResumeListItem } from '../types';
import { useEffect, useRef } from 'react';

interface DeleteResumeModalProps {
  resume: ResumeListItem | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteResumeModal({
  resume,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false
}: DeleteResumeModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus cancel button on open for safety
      // Small timeout to ensure DOM is ready and transition has started
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !resume) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h2 id="delete-modal-title" className="text-xl font-bold text-gray-900">Delete Resume?</h2>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
            </div>
          </div>

          <p id="delete-modal-desc" className="text-gray-700 mb-6">
            Are you sure you want to delete <strong className="text-gray-900">{resume.title}</strong>?
            This will permanently remove the resume and all its data.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
