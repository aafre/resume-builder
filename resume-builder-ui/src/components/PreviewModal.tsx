import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdRefresh, MdFileDownload, MdWarning } from 'react-icons/md';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string | null;
  isGenerating: boolean;
  isStale: boolean;
  error: string | null;
  onRefresh: () => void;
  onDownload: () => void;
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  previewUrl,
  isGenerating,
  isStale,
  error,
  onRefresh,
  onDownload,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update loading state when generation status or error changes
  useEffect(() => {
    if (isGenerating) {
      setLoadingState('loading');
    } else if (error) {
      setLoadingState('error');
    } else if (!previewUrl) {
      setLoadingState('idle');
    }
    // Note: 'loaded' state is set by iframe onLoad event
    // previewUrl removed from deps to prevent flashing when URL updates
  }, [isGenerating, error]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Iframe load handler for smooth transitions
  const handleIframeLoad = () => {
    setLoadingState('loaded');
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container - Bottom sheet on mobile, centered on desktop */}
      <div className="fixed z-[9999] inset-0 flex items-end lg:items-center lg:justify-center animate-fade-in">
        <div
          className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl w-full lg:max-w-5xl lg:mx-4 h-[95vh] lg:h-[90vh] flex flex-col animate-slide-up lg:animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                PDF Preview
              </h2>
              {isStale && !isGenerating && (
                <span className="flex items-center gap-1 text-xs lg:text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  <MdWarning className="text-sm" />
                  Outdated
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* Staleness Warning Banner */}
          {isStale && !isGenerating && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 text-amber-800">
                <MdWarning className="text-lg flex-shrink-0" />
                <span className="text-sm">
                  Your edits aren't reflected yet. Click "Refresh Preview" to see latest changes.
                </span>
              </div>
              <button
                onClick={onRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                <MdRefresh className="text-base" />
                Refresh
              </button>
            </div>
          )}

          {/* PDF Viewer Area - fills remaining space */}
          <div className="flex-1 overflow-auto bg-gray-100 relative">
            {/* Skeleton Loader - fades out when PDF loaded */}
            {loadingState === 'loading' && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-gray-700 font-medium mb-2">Generating PDF preview...</p>
                <p className="text-gray-500 text-sm">This usually takes 2-5 seconds</p>
              </div>
            )}

            {/* Error State */}
            {loadingState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdWarning className="text-3xl text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Preview Generation Failed
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                  <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <MdRefresh className="text-lg" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {loadingState === 'idle' && !previewUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdFileDownload className="text-3xl text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Preview Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click "Generate Preview" to see your resume
                  </p>
                  <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mx-auto"
                  >
                    Generate Preview
                  </button>
                </div>
              </div>
            )}

            {/* PDF Iframe - fills entire container, fades in when loaded */}
            {previewUrl && (
              <iframe
                ref={iframeRef}
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                title="Resume PDF Preview"
                onLoad={handleIframeLoad}
                className={`w-full h-full border-none transition-opacity duration-300 ${
                  loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ border: 'none' }}
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-white flex-shrink-0">
            {/* Action Buttons */}
            <div className="p-4 lg:p-6 grid grid-cols-2 gap-3 lg:flex lg:justify-end">
              <button
                onClick={onRefresh}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] min-h-[52px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                ) : (
                  <MdRefresh className="text-xl" />
                )}
                <span className="hidden sm:inline">{isStale ? 'Refresh Preview' : 'Regenerate'}</span>
                <span className="sm:hidden">Refresh</span>
              </button>
              <button
                onClick={onDownload}
                disabled={isGenerating || !previewUrl}
                className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all active:scale-[0.98] min-h-[52px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <MdFileDownload className="text-xl" />
                <span>Download</span>
              </button>
            </div>
            {/* Safe area padding for devices with notches/home indicators */}
            <div style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewModal;
