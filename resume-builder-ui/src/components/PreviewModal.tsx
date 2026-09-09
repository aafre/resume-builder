import React, { useState, useEffect, useCallback, useId, lazy, Suspense } from 'react';
import ModalShell from './shared/ModalShell';
import { MdClose, MdRefresh, MdFileDownload, MdWarning } from 'react-icons/md';
import { isMobileDevice } from '../utils/deviceDetection';
import { PhaseLabel, WorkingRail } from "./shared/GenerationPhase";

// Lazy-load PDF.js viewer (only loaded on mobile devices)
const PdfViewerMobile = lazy(() =>
  import('./PdfViewerMobile').then(mod => ({ default: mod.PdfViewerMobile }))
);

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string | null;
  isGenerating: boolean;
  isDownloading: boolean;
  /** What the PDF build is doing right now; null when idle */
  downloadPhase?: string | null;
  isStale: boolean;
  error: string | null;
  onRefresh: () => void;
  onDownload: () => void;
  /**
   * Already-cached thumbnail of this resume, painted on the sheet the instant
   * the modal opens so the paper is never an empty white box while the real PDF
   * builds. `/my-resumes` has one per card; the editor does not.
   */
  posterUrl?: string | null;
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * The print.
 *
 * A single sheet of paper on a studio ground, morphing out of the card that
 * opened it — the card thumbnail and this sheet share `view-transition-name:
 * resume-sheet`, so the browser animates one into the other (the handoff lives
 * in `MyResumes.handlePreview`). Firefox has no View Transitions and simply
 * cuts, which is the correct fallback.
 *
 * The sheet's geometry exists from the first frame regardless of what is inside
 * it, so no state here — generating, error, empty, loaded — moves the layout.
 */
const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  previewUrl,
  isGenerating,
  isDownloading,
  downloadPhase = null,
  isStale,
  error,
  onRefresh,
  onDownload,
  posterUrl = null,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isMobile] = useState(() => isMobileDevice());

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
  }, [isGenerating, error, previewUrl]);

  // Escape is owned by ModalShell's focus trap. Keeping a second window-level
  // listener here would fire onClose twice for one keypress.

  // Iframe load handler for smooth transitions
  // Wrapped in useCallback to prevent unnecessary re-renders
  const handleIframeLoad = useCallback(() => {
    setLoadingState('loaded');
  }, []);

  // PDF.js error handler - stable identity to prevent re-renders
  const titleId = useId();

  const handlePdfError = useCallback(() => {
    setLoadingState('error');
  }, []);

  const showStale = isStale && !isGenerating;
  const pdfVisible = Boolean(previewUrl) && loadingState === 'loaded';

  // Once a print has been seen, a regenerate shows the previous one dimmed
  // under the scan rather than blanking the paper — the sheet keeps saying
  // what the resume looks like while the next version builds.
  const [hasPrinted, setHasPrinted] = useState(false);
  useEffect(() => {
    if (pdfVisible) setHasPrinted(true);
  }, [pdfVisible]);
  useEffect(() => {
    if (!isOpen) setHasPrinted(false);
  }, [isOpen]);

  const iconButton =
    "grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white " +
    "hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink " +
    "transition-colors";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      overlayTestId="preview-modal-container"
      panelTestId="preview-modal-content"
      overlayClassName="fixed inset-0 z-[9999] bg-ink/95 backdrop-blur-sm"
      panelClassName="h-full w-full flex flex-col outline-none"
    >
      {/* Top strip */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/10 flex-shrink-0">
        <h2
          id={titleId}
          className="font-display text-lg sm:text-xl font-extrabold text-white"
        >
          PDF Preview
        </h2>

        {showStale && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 font-mono text-xs tracking-[0.15em] uppercase text-amber-200">
            <MdWarning className="text-sm" aria-hidden="true" />
            Outdated
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          title="Close (ESC)"
          className={`ml-auto ${iconButton}`}
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      {showStale && (
        <p className="flex-shrink-0 border-b border-white/10 px-4 sm:px-6 py-2 text-sm font-extralight text-white/60">
          Your edits aren&apos;t reflected yet — regenerate to print the latest.
        </p>
      )}

      {/* The sheet */}
      <div className="flex-1 min-h-0 grid place-items-center px-4 sm:px-6 py-5">
        <div
          data-testid="preview-sheet"
          /* ponytail: Letter (8.5x11), the page size wkhtmltopdf emits here —
             resume_generator.py passes no explicit page-size, so this tracks
             the toolchain default. If the generator ever pins A4, change this
             to aspect-[210/297] or the sheet will crop the page. */
          style={{ viewTransitionName: 'resume-sheet' }}
          className="relative overflow-clip rounded-lg bg-white shadow-2xl w-full max-h-full aspect-[85/110] sm:w-auto sm:h-full sm:max-w-full"
        >
          {/* Cached thumbnail — the paper is never blank while the PDF builds */}
          {posterUrl && !pdfVisible && (
            <img
              src={posterUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          )}

          {/* Print head, only while the server is actually rendering */}
          {isGenerating && (
            <span
              aria-hidden="true"
              className="sheet-scan pointer-events-none"
            />
          )}

          {/* PDF Viewer - iframe on desktop, PDF.js on mobile */}
          {previewUrl && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                pdfVisible
                  ? 'opacity-100'
                  : hasPrinted && isGenerating
                    ? 'opacity-40'
                    : 'opacity-0'
              }`}
            >
              {isMobile ? (
                <Suspense fallback={null}>
                  <PdfViewerMobile
                    pdfUrl={previewUrl}
                    onLoad={handleIframeLoad}
                    onError={handlePdfError}
                  />
                </Suspense>
              ) : (
                <iframe
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  title="Resume PDF Preview"
                  onLoad={handleIframeLoad}
                  className="h-full w-full border-none"
                  style={{ border: 'none' }}
                />
              )}
            </div>
          )}

          {/* Generating — the paper is already here, so this only names the work */}
          {loadingState === 'loading' && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent p-6 pt-20 text-center">
              <p className="font-display font-medium text-ink">
                Generating PDF preview...
              </p>
              <p className="text-sm text-ink/60">This usually takes 2-5 seconds</p>
            </div>
          )}

          {/* Error State */}
          {loadingState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 p-8 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-50">
                <MdWarning className="text-3xl text-red-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                Preview Generation Failed
              </h3>
              <p className="mb-6 max-w-md text-ink/60">{error}</p>
              <button type="button" onClick={onRefresh} className="btn-primary gap-2 px-6">
                <MdRefresh className="text-lg" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {loadingState === 'idle' && !previewUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent/10">
                <MdFileDownload className="text-3xl text-accent-text" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                No Preview Available
              </h3>
              <p className="mb-6 text-ink/60">
                Click "Generate Preview" to see your resume
              </p>
              <button type="button" onClick={onRefresh} className="btn-primary px-6">
                Generate Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar — floats over the ground rather than sitting under the paper */}
      <div className="flex-shrink-0 px-4 sm:px-6 pb-4">
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:max-w-lg">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isGenerating}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isGenerating ? (
              <WorkingRail className="h-1.5 w-8 shrink-0 !bg-white/25 [&>span]:!bg-white/80" />
            ) : (
              <MdRefresh className="text-xl" />
            )}
            <span className="hidden sm:inline">
              {isStale ? 'Refresh Preview' : 'Regenerate'}
            </span>
            <span className="sm:hidden">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={isGenerating || isDownloading || !previewUrl}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-bold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isDownloading ? (
              <>
                <WorkingRail className="h-1.5 w-8 shrink-0" />
                <PhaseLabel
                  phase={downloadPhase}
                  fallback="Building your PDF"
                  className="truncate"
                />
              </>
            ) : (
              <>
                <MdFileDownload className="text-xl" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
        {/* Safe area padding for devices with notches/home indicators */}
        <div style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }} />
      </div>
    </ModalShell>
  );
};

export default PreviewModal;
