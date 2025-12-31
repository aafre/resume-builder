import { useNavigate } from 'react-router-dom';

interface StorageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StorageLimitModal({ isOpen, onClose }: StorageLimitModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleManageResumes = () => {
    onClose();
    navigate('/my-resumes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Storage Full</h2>
              <p className="text-sm text-gray-500 mt-1">You've reached the 5-resume limit</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            You've reached the 5-resume limit for free accounts.
            Delete an old resume to create a new one.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleManageResumes}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Manage Resumes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
