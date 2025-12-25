import { useState, useEffect, useRef } from 'react';

interface AnonymousWarningBadgeProps {
  onSignInClick: () => void;
}

/**
 * AnonymousWarningBadge - Header warning badge for anonymous users
 *
 * Features:
 * - Shows "⚠️ Unsaved (Local)" badge in amber styling
 * - Click to reveal popover with warning message + CTA
 * - Responsive: "Local" on mobile, "Unsaved (Local)" on desktop
 * - Closes on outside click
 */
export default function AnonymousWarningBadge({ onSignInClick }: AnonymousWarningBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    }

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPopover]);

  const handleSignInClick = () => {
    setShowPopover(false);
    onSignInClick();
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Warning Badge */}
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="flex items-center gap-2 text-xs px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full hover:bg-amber-100 transition-all"
      >
        <span className="text-amber-600">⚠️</span>
        <span className="text-amber-800 font-medium">
          {/* Mobile: show just "Local", Desktop: show "Unsaved (Local)" */}
          <span className="sm:hidden">Local</span>
          <span className="hidden sm:inline">Unsaved (Local)</span>
        </span>
      </button>

      {/* Popover */}
      {showPopover && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-amber-600">⚠️</span>
            Your work is at risk
          </h3>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Your resume is only saved locally on this device. Clearing your browser data will delete it permanently.
          </p>
          <button
            onClick={handleSignInClick}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-sm hover:shadow-md"
          >
            Create Free Account
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Save securely in the cloud
          </p>
        </div>
      )}
    </div>
  );
}
