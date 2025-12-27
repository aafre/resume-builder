import { PlusCircle, Ban, AlertCircle } from 'lucide-react';

interface GhostCardProps {
  isAtLimit: boolean;
  resumeCount: number;
  onCreateNew: () => void;
  onUpgrade: () => void;
}

export function GhostCard({ isAtLimit, resumeCount, onCreateNew }: GhostCardProps) {
  const isOverLimit = resumeCount > 5;

  if (isAtLimit) {
    // If over limit, show warning message instead of upgrade prompt
    if (isOverLimit) {
      return (
        <div className="h-full min-h-[320px] bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-400 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Resume Limit Reached
          </h3>

          <div className="text-2xl font-bold text-red-600 mb-2">
            {resumeCount}/5
          </div>

          <p className="text-sm text-gray-700 mb-4 text-center max-w-xs">
            You have {resumeCount - 5} extra resume{resumeCount - 5 > 1 ? 's' : ''} from your anonymous session.
            Please delete {resumeCount - 5} resume{resumeCount - 5 > 1 ? 's' : ''} before creating new ones.
          </p>

          <p className="text-xs text-gray-500 text-center">
            Your resumes were preserved when you signed in
          </p>
        </div>
      );
    }

    // At exactly 5 resumes - show limit reached message
    return (
      <div
        className="h-full min-h-[320px] bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 border-2 border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center"
      >
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Ban className="w-12 h-12 text-gray-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Resume Limit Reached
        </h3>

        <p className="text-sm text-gray-600 mb-4 text-center">
          You can create up to 5 resumes per profile
        </p>

        <p className="text-sm text-gray-700 font-medium text-center">
          Delete a resume to create a new one
        </p>

        <p className="text-xs text-gray-500 mt-3">
          Maximum 5 resumes per profile
        </p>
      </div>
    );
  }

  // Create new resume state
  return (
    <div
      onClick={onCreateNew}
      className="h-full min-h-[320px] border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all duration-200 group"
    >
      <PlusCircle className="w-16 h-16 text-gray-400 mb-4 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200" />

      <h3 className="text-lg font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
        Create New Resume
      </h3>

      <p className="text-sm text-gray-500">
        Start from a template
      </p>
    </div>
  );
}
