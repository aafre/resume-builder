import { useState, useEffect } from 'react';
import { ResumeListItem } from '../types';

interface DuplicateResumeModalProps {
  resume: ResumeListItem | null;
  isOpen: boolean;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
  isDuplicating?: boolean;
}

export function DuplicateResumeModal({
  resume,
  isOpen,
  onConfirm,
  onCancel,
  isDuplicating = false
}: DuplicateResumeModalProps) {
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (resume) {
      setNewTitle(`Copy of ${resume.title}`);
    }
  }, [resume]);

  if (!isOpen || !resume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onConfirm(newTitle.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="duplicate-modal-title"
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 id="duplicate-modal-title" className="text-xl font-bold text-gray-900">Duplicate Resume</h2>
              <p className="text-sm text-gray-500 mt-1">Create a copy with a new name</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700 mb-2">
                New Resume Title
              </label>
              <input
                type="text"
                id="newTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={isDuplicating}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter new title"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                Original: <span className="font-medium">{resume.title}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isDuplicating || !newTitle.trim()}
                className="flex-1 flex justify-center items-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/80 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
              >
                {isDuplicating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Duplicating...
                  </>
                ) : (
                  'Duplicate'
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isDuplicating}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
