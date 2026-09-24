import { PlusCircle, Ban, AlertCircle } from 'lucide-react';

interface GhostCardProps {
  isAtLimit: boolean;
  resumeCount: number;
  onCreateNew: () => void;
  onUpgrade: () => void;
}

/** Shared frame so all three states sit in the grid as the same object. */
const SHELL =
  'h-full min-h-[320px] rounded-2xl p-6 flex flex-col items-center justify-center text-center';

export function GhostCard({ isAtLimit, resumeCount, onCreateNew }: GhostCardProps) {
  const isOverLimit = resumeCount > 5;

  if (isAtLimit) {
    // If over limit, show warning message instead of upgrade prompt
    if (isOverLimit) {
      return (
        <div className={`${SHELL} bg-white border border-red-200`}>
          <div className="bg-red-50 rounded-full p-4 mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>

          <h3 className="font-display text-xl font-bold text-ink mb-2">
            Resume Limit Reached
          </h3>

          <div className="font-display text-2xl font-extrabold text-red-600 mb-2 tabular-nums">
            {resumeCount}/5
          </div>

          <p className="text-sm text-ink/60 mb-4 max-w-xs">
            You have {resumeCount - 5} extra resume{resumeCount - 5 > 1 ? 's' : ''} from your anonymous session.
            Please delete {resumeCount - 5} resume{resumeCount - 5 > 1 ? 's' : ''} before creating new ones.
          </p>

          <p className="text-xs text-ink/60">
            Your resumes were preserved when you signed in
          </p>
        </div>
      );
    }

    // At exactly 5 resumes - show limit reached message
    return (
      <div className={`${SHELL} bg-chalk-dark border border-black/[0.06]`}>
        <div className="bg-white rounded-full p-4 mb-4">
          <Ban className="w-12 h-12 text-ink/60" />
        </div>

        <h3 className="font-display text-xl font-bold text-ink mb-2">
          Resume Limit Reached
        </h3>

        <p className="text-sm text-ink/60 mb-4">
          You can create up to 5 resumes per profile
        </p>

        <p className="text-sm font-medium text-ink">
          Delete a resume to create a new one
        </p>
      </div>
    );
  }

  // Create new resume state — the system's "there could be more here"
  // affordance, and the one place a dashed border is permitted.
  return (
    <button
      type="button"
      onClick={onCreateNew}
      className={`${SHELL} w-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-accent/70 hover:bg-accent/[0.06] transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2`}
    >
      <PlusCircle className="w-16 h-16 text-ink/60 mb-4 group-hover:text-accent-text transition-colors duration-200" />

      <h3 className="font-display text-lg font-bold text-ink mb-1 group-hover:text-accent-text transition-colors">
        Create New Resume
      </h3>

      <p className="text-sm text-ink/60">
        Start from a template
      </p>
    </button>
  );
}
