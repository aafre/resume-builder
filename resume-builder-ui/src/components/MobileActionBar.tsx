import React from "react";
import { MdMenu, MdFileDownload, MdVisibility } from "react-icons/md";

interface MobileActionBarProps {
  onNavigationClick: () => void;
  onPreviewClick?: () => void;
  onDownloadClick: () => void;
  isSaving?: boolean;
  isGenerating?: boolean;
  isGeneratingPreview?: boolean;
  previewIsStale?: boolean;
  lastSaved?: Date | null;
  saveError?: boolean;
  /** Whether user is authenticated - save status only shows when true */
  isAuthenticated?: boolean;
}

/**
 * Mobile-first action bar with large touch targets (48x48px minimum)
 * Sticky to bottom on mobile/tablet, hidden on desktop
 */
const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onNavigationClick,
  onPreviewClick,
  onDownloadClick,
  isSaving = false,
  isGenerating = false,
  isGeneratingPreview = false,
  previewIsStale = false,
  lastSaved = null,
  saveError = false,
  isAuthenticated = false,
}) => {
  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return "";

    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      {/* Auto-save status bar (subtle, above buttons) - only for authenticated users */}
      {isAuthenticated && (isSaving || lastSaved || saveError) && (
        <div className="px-4 py-1 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs">
            {isSaving && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Saving...</span>
              </>
            )}
            {!isSaving && lastSaved && !saveError && (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Saved {getLastSavedText()}</span>
              </>
            )}
            {saveError && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-red-600">Save failed - retrying...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main action buttons - Grid layout for consistent spacing */}
      <div className="grid grid-cols-3 gap-3 px-4 py-3 safe-area-inset-bottom">
        {/* Navigation Button */}
        <button
          onClick={onNavigationClick}
          disabled={isGenerating || isGeneratingPreview}
          className="flex flex-col items-center justify-center min-h-[60px] px-3 py-2 rounded-xl transition-all disabled:opacity-50 hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] border border-gray-200"
          aria-label="Open navigation menu"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <MdMenu className="text-2xl text-gray-700 mb-1.5" aria-hidden="true" />
          <span className="text-xs text-gray-600 font-medium">Menu</span>
        </button>

        {/* Preview Button */}
        {onPreviewClick && (
          <button
            onClick={onPreviewClick}
            disabled={isGeneratingPreview || isGenerating}
            className="flex flex-col items-center justify-center min-h-[60px] px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative"
            aria-label="Preview resume PDF"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Staleness indicator */}
            {previewIsStale && !isGeneratingPreview && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
            )}
            {isGeneratingPreview ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-1.5"></div>
                <span className="text-xs font-semibold">Loading...</span>
              </>
            ) : (
              <>
                <MdVisibility className="text-2xl mb-1.5" aria-hidden="true" />
                <span className="text-xs font-semibold">Preview</span>
              </>
            )}
          </button>
        )}

        {/* Download PDF Button */}
        <button
          onClick={onDownloadClick}
          disabled={isGenerating || isGeneratingPreview}
          className="flex flex-col items-center justify-center min-h-[60px] px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Download resume as PDF"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-1.5"></div>
              <span className="text-xs font-semibold">Creating...</span>
            </>
          ) : (
            <>
              <MdFileDownload className="text-2xl mb-1.5" aria-hidden="true" />
              <span className="text-xs font-semibold">Download</span>
            </>
          )}
        </button>
      </div>

      {/* Safe area padding for devices with notches/home indicators */}
      <style dangerouslySetInnerHTML={{__html: `
        .safe-area-inset-bottom {
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
      `}} />
    </div>
  );
};

export default MobileActionBar;
