// src/components/editor/EditorHeader.tsx
// Header component for Editor with status indicators and idle tooltip

import ReactDOM from 'react-dom';
import { SaveStatus } from '../../types';
import { SaveStatusIndicator } from '../SaveStatusIndicator';

/**
 * Props for EditorHeader component
 */
export interface EditorHeaderProps {
  /** Whether to show the idle tooltip */
  showIdleTooltip: boolean;
  /** Callback to dismiss idle tooltip */
  onDismissIdleTooltip: () => void;
  /** Current save status */
  saveStatus: SaveStatus;
  /** Last saved timestamp */
  lastSaved: Date | null;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Callback to open sign-in modal */
  onSignInClick: () => void;
}

/**
 * EditorHeader Component
 *
 * Displays status indicators and tooltips for the Editor:
 * - Idle nudge tooltip (portal) for anonymous users
 * - Save status indicator for authenticated users
 * - Sign-in CTA for anonymous users
 *
 * @example
 * <EditorHeader
 *   showIdleTooltip={showIdleTooltip}
 *   onDismissIdleTooltip={dismissIdleTooltip}
 *   saveStatus={saveStatus}
 *   lastSaved={lastSaved}
 *   isAnonymous={isAnonymous}
 *   isAuthenticated={isAuthenticated}
 *   onSignInClick={openAuthModal}
 * />
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  showIdleTooltip,
  onDismissIdleTooltip,
  saveStatus,
  lastSaved,
  isAnonymous,
  isAuthenticated,
  onSignInClick,
}) => {
  return (
    <>
      {/* Header Bar - Fixed position at top right */}
      <div className="fixed top-4 right-6 z-[65] flex items-center gap-3">
        {/* Save Status for authenticated users */}
        {isAuthenticated && saveStatus && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200/60">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
        )}

        {/* Sign-in CTA for anonymous users */}
        {isAnonymous && (
          <button
            onClick={onSignInClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign in to save</span>
          </button>
        )}
      </div>

      {/* Idle Nudge Tooltip - Portal to body */}
      {showIdleTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed top-20 right-6 z-[70] bg-blue-600 text-white text-sm px-4 py-3 rounded-lg shadow-xl animate-bounce"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span aria-hidden="true">💡</span>
              <span>Don't forget to save your progress permanently</span>
              <button
                onClick={onDismissIdleTooltip}
                className="ml-2 hover:opacity-75 text-white"
                aria-label="Dismiss reminder"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EditorHeader;
