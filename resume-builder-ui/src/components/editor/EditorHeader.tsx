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
  /** Whether user is authenticated */
  isAuthenticated: boolean;
}

/**
 * EditorHeader Component
 *
 * Displays status indicators and tooltips for the Editor:
 * - Idle nudge tooltip (portal) for anonymous users
 * - Save status indicator for authenticated users (desktop only)
 *
 * @example
 * <EditorHeader
 *   showIdleTooltip={showIdleTooltip}
 *   onDismissIdleTooltip={dismissIdleTooltip}
 *   saveStatus={saveStatus}
 *   lastSaved={lastSaved}
 *   isAuthenticated={isAuthenticated}
 * />
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  showIdleTooltip,
  onDismissIdleTooltip,
  saveStatus,
  lastSaved,
  isAuthenticated,
}) => {
  return (
    <>
      {/* Header Bar - Fixed position at top right, hidden on mobile (mobile has MobileActionBar) */}
      <div className="fixed top-4 right-6 z-[65] hidden lg:flex items-center gap-3">
        {/* Save Status for authenticated users */}
        {isAuthenticated && saveStatus && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200/60">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
        )}
      </div>

      {/* Idle Nudge Tooltip - Portal to body */}
      {showIdleTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed top-20 right-6 z-[70] bg-accent text-ink text-sm px-4 py-3 rounded-lg shadow-xl animate-bounce"
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
