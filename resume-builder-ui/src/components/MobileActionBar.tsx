import React from "react";
import { MdMenu, MdFileDownload, MdVisibility, MdRefresh } from "react-icons/md";

interface MobileActionBarProps {
  onNavigationClick: () => void;
  onPreviewClick?: () => void;
  onDownloadClick: () => void;
  isSaving?: boolean;
  isGenerating?: boolean;
  /** Whether the preview button is being clicked (saving, validating) */
  isOpeningPreview?: boolean;
  /** Whether the preview is being generated */
  isGeneratingPreview?: boolean;
  previewIsStale?: boolean;
  lastSaved?: Date | null;
  saveError?: boolean;
  /** Whether user is authenticated - save status only shows when true */
  isAuthenticated?: boolean;
}

/**
 * Mobile-first action bar. Download is the conversion event and is the only
 * filled accent control on the surface; Menu and Preview are secondary.
 */
const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onNavigationClick,
  onPreviewClick,
  onDownloadClick,
  isSaving = false,
  isGenerating = false,
  isOpeningPreview = false,
  isGeneratingPreview = false,
  previewIsStale = false,
  lastSaved = null,
  saveError = false,
  isAuthenticated = false,
}) => {
  // Show loading on button when either opening (save/validate) or generating
  const isPreviewLoading = isOpeningPreview || isGeneratingPreview;
  const previewStale = previewIsStale && !isPreviewLoading;
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

  const buttonBase =
    "flex flex-col items-center justify-center min-h-11 px-3 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-sm">
      {/* Auto-save status bar (subtle, above buttons) - only for authenticated users */}
      {isAuthenticated && (isSaving || lastSaved || saveError) && (
        <div className="px-4 py-1 bg-chalk border-b border-gray-200/60">
          <div className="flex items-center justify-center gap-2 text-xs">
            {isSaving && (
              <>
                <div className="h-2 w-8 overflow-clip rounded-full bg-chalk-dark">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
                </div>
                <span className="text-stone-warm">Saving...</span>
              </>
            )}
            {!isSaving && lastSaved && !saveError && (
              <>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-stone-warm">Saved {getLastSavedText()}</span>
              </>
            )}
            {saveError && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <span className="text-red-700">Save failed - retrying...</span>
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
          className={`${buttonBase} border border-gray-200 bg-white text-ink hover:bg-chalk-dark active:bg-chalk-dark`}
          aria-label="Open navigation menu"
        >
          <MdMenu className="text-2xl mb-1.5" aria-hidden="true" />
          <span className="text-xs font-medium">Menu</span>
        </button>

        {/* Preview Button — secondary. When the preview is behind the user's
            edits the icon, the label and the colour all change; the previous
            unlabelled pulsing dot carried that state on colour alone. */}
        {onPreviewClick && (
          <button
            onClick={onPreviewClick}
            disabled={isPreviewLoading || isGenerating}
            className={`${buttonBase} border ${
              previewStale
                ? "border-amber-600 bg-amber-50 text-amber-900 active:bg-amber-100"
                : "border-gray-200 bg-white text-ink hover:bg-chalk-dark active:bg-chalk-dark"
            }`}
            aria-label={
              previewStale
                ? "Refresh preview — the preview is out of date and does not include your latest edits"
                : "Preview resume PDF"
            }
          >
            {isPreviewLoading ? (
              <>
                <span className="mb-1.5 h-2 w-10 overflow-clip rounded-full bg-ink/15">
                  <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
                </span>
                <span className="text-xs font-semibold">Loading...</span>
              </>
            ) : previewStale ? (
              <>
                <MdRefresh className="text-2xl mb-1.5" aria-hidden="true" />
                <span className="text-xs font-semibold">Refresh</span>
              </>
            ) : (
              <>
                <MdVisibility className="text-2xl mb-1.5" aria-hidden="true" />
                <span className="text-xs font-semibold">Preview</span>
              </>
            )}
          </button>
        )}

        {/* Download PDF Button — the conversion action, the only accent fill */}
        <button
          onClick={onDownloadClick}
          disabled={isGenerating || isGeneratingPreview}
          className={`${buttonBase} bg-accent text-ink shadow-sm hover:shadow-md`}
          aria-label="Download resume as PDF"
        >
          {isGenerating ? (
            <>
              <span className="mb-1.5 h-2 w-10 overflow-clip rounded-full bg-ink/15">
                <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
              </span>
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

    </div>
  );
};

export default MobileActionBar;
