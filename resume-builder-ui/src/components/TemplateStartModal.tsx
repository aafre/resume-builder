import React, { useState, useEffect, useId, useRef } from "react";
import ModalShell from "./shared/ModalShell";
import { MdEditNote, MdPreview, MdClose, MdArrowForward } from "react-icons/md";
import { DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useResumeParser } from "../hooks/useResumeParser";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api-client";

interface TemplateStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmpty: () => void;
  onSelectExample: () => void;
  onSelectImport: (yaml: string, confidence: number, warnings: string[]) => void;
  templateName: string;
  /** Thumbnail of the chosen template, shown beside the heading on sm+. */
  templateImageUrl?: string;
}

const OPTION_CARD =
  "group flex items-start gap-3 w-full min-h-11 p-4 text-left bg-white rounded-xl border border-gray-200 " +
  "hover:border-gray-300 hover:shadow-md transition-all duration-200 active:scale-[0.98] " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

export const TemplateStartModal: React.FC<TemplateStartModalProps> = ({
  isOpen,
  onClose,
  onSelectEmpty,
  onSelectExample,
  onSelectImport,
  templateName,
  templateImageUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const titleId = useId();
  const descId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLButtonElement>(null);
  // Pending high-confidence auto-import; cancelled by any manual choice,
  // close, or unmount so it can't fire a second create behind the user's back.
  const autoImportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelAutoImport = () => {
    if (autoImportTimer.current) clearTimeout(autoImportTimer.current);
    autoImportTimer.current = null;
  };

  const { parseResume, parsing, progress, progressMessage, error, errorKind, clearError } = useResumeParser();
  const { session } = useAuth();
  const navigate = useNavigate();
  // Most recent saved resume, looked up only once the daily import cap is hit.
  // undefined = still looking, null = none.
  const [latestResume, setLatestResume] = useState<{ id: string; title: string } | null | undefined>();

  useEffect(() => {
    if (errorKind !== 'rate_limit') return;
    let cancelled = false;
    setLatestResume(undefined);
    apiClient
      .get('/api/resumes?limit=50', { session })
      .then((data: any) => {
        const resumes: any[] = data?.resumes || [];
        const latest = resumes.reduce<any>(
          (a, b) => (!a || new Date(b.updated_at) > new Date(a.updated_at) ? b : a),
          null
        );
        if (!cancelled) setLatestResume(latest ? { id: latest.id, title: latest.title } : null);
      })
      .catch(() => {
        if (!cancelled) setLatestResume(null);
      });
    return () => {
      cancelled = true;
    };
  }, [errorKind, session]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      cancelAutoImport();
      setIsDragging(false);
      setParseResult(null);
      clearError();
    }
  }, [isOpen, clearError]);

  useEffect(() => cancelAutoImport, []);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseResume(file);
      setParseResult(result);

      // Auto-redirect on high confidence
      if (result.confidence >= 0.9) {
        cancelAutoImport();
        autoImportTimer.current = setTimeout(() => {
          autoImportTimer.current = null;
          onSelectImport(result.yaml, result.confidence, result.warnings);
        }, 1500);
      }
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleContinueWithImport = () => {
    cancelAutoImport();
    if (parseResult) {
      onSelectImport(parseResult.yaml, parseResult.confidence, parseResult.warnings);
    }
  };

  // Escape belongs to ModalShell's focus trap; every option here is a one-click
  // action, so there is no pending selection for Enter to confirm.
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descId}
      panelTestId="template-start-modal"
      initialFocusRef={dropzoneRef}
      panelClassName="bg-white p-6 sm:p-8 rounded-xl max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink/60 hover:text-ink hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text"
        aria-label="Close"
      >
        <MdClose className="text-2xl" aria-hidden="true" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 pr-10 mb-6">
        {templateImageUrl && (
          <img
            src={templateImageUrl}
            alt=""
            width={44}
            height={58}
            className="hidden sm:block w-11 h-[58px] shrink-0 rounded-md border border-black/[0.06] object-cover object-top bg-chalk-dark"
          />
        )}
        <div>
          <h2 id={titleId} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mb-1">
            How would you like to start?
          </h2>
          <p id={descId} className="text-base font-extralight text-ink/60">
            Every path opens your{" "}
            <span className="font-semibold text-ink">{templateName}</span> resume in the same editor.
          </p>
        </div>
      </div>

      {/* Hero: import */}
      {!parsing && !parseResult && !error && (
        <button
          ref={dropzoneRef}
          type="button"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`group w-full rounded-xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
            isDragging
              ? 'border-accent/70 bg-accent/[0.06]'
              : 'border-gray-300 bg-chalk-dark/60 hover:border-accent/70 hover:bg-accent/[0.06]'
          }`}
        >
          <DocumentArrowUpIcon
            className={`w-12 h-12 mx-auto mb-3 transition-colors ${
              isDragging ? 'text-accent-text' : 'text-ink/40 group-hover:text-accent-text'
            }`}
            aria-hidden="true"
          />
          <p className="text-lg font-semibold text-ink mb-1">
            <span className="sm:hidden">Upload your PDF or DOCX</span>
            <span className="hidden sm:inline">Drop your PDF or DOCX here</span>
          </p>
          <p className="text-sm font-extralight text-ink/60 mb-5">
            We'll pull your details straight into this template
          </p>
          <span className="btn-primary px-6 py-2.5 text-sm">Browse files</span>
          <p className="text-xs text-ink/60 mt-4">PDF or DOCX · up to 10 MB</p>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleFileInput}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Parsing */}
      {parsing && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8" aria-live="polite">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-chalk-dark border-t-accent-text" aria-hidden="true" />
          </div>
          <p className="text-center text-base font-semibold text-ink mb-3">
            Reading your resume…
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Import progress"
            className="w-full bg-chalk-dark rounded-full h-2 overflow-clip"
          >
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-ink/60 mt-3">
            {progressMessage || 'Processing…'}
          </p>
        </div>
      )}

      {/* Success */}
      {parseResult && !parsing && (
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-6" aria-live="polite">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="w-7 h-7 text-accent-text shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-base text-ink">Import successful</h3>
                {parseResult.cached && (
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink/60 bg-chalk-dark rounded-full px-2 py-0.5">
                    Previously imported
                  </span>
                )}
              </div>
              <p className="text-sm font-extralight text-ink/60">
                {parseResult.confidence >= 0.9
                  ? 'Loading your resume…'
                  : 'Please review your details carefully before continuing.'}
              </p>
            </div>
          </div>

          {parseResult.confidence < 0.9 && (
            <button
              type="button"
              onClick={handleContinueWithImport}
              className="btn-primary w-full mt-5 py-3"
            >
              Continue to Editor
            </button>
          )}
        </div>
      )}

      {/* Daily import cap: a limit, not a failure, so no alarm colors and no retry */}
      {error && !parsing && errorKind === 'rate_limit' && (
        <div className="rounded-xl border border-black/[0.06] bg-chalk-dark p-6" role="status">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-6 h-6 text-ink/60 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-ink mb-1">You've used today's imports</h3>
              <p className="text-sm font-extralight text-ink/60">
                {latestResume
                  ? 'Imports reset tomorrow. Meanwhile, you can keep working on your latest resume.'
                  : latestResume === null
                    ? 'Imports reset tomorrow. Meanwhile, start from scratch or with example content below.'
                    : 'Imports reset tomorrow.'}
              </p>
            </div>
          </div>
          {latestResume !== null && (
            <button
              type="button"
              disabled={!latestResume}
              onClick={() => latestResume && navigate(`/editor/${latestResume.id}`)}
              className="btn-primary w-full mt-5 py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {latestResume ? (
                <>
                  <span className="truncate">Open {latestResume.title || 'your latest resume'}</span>
                  <MdArrowForward className="text-lg shrink-0" aria-hidden="true" />
                </>
              ) : (
                'Checking your resumes…'
              )}
            </button>
          )}
        </div>
      )}

      {/* Bot check: a refresh gets a fresh Turnstile token */}
      {error && !parsing && errorKind === 'bot_check' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6" role="alert">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-700 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-amber-900 mb-1">We couldn't verify your browser</h3>
              <p className="text-sm text-amber-800">Refreshing the page usually fixes this. Then drop your file in again.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-secondary w-full mt-5 py-3"
          >
            Refresh Page
          </button>
        </div>
      )}

      {/* Bad file or server failure: retrying (with another file) can help */}
      {error && !parsing && (errorKind === 'invalid_file' || errorKind === 'generic') && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6" role="alert">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-red-900 mb-1">
                {errorKind === 'invalid_file' ? "We couldn't import this file" : 'Upload failed'}
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearError();
              setParseResult(null);
              fileInputRef.current?.click();
            }}
            className="btn-secondary w-full mt-5 py-3"
          >
            {errorKind === 'invalid_file' ? 'Choose Another File' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-6" aria-hidden="true">
        <span className="flex-1 border-t border-black/[0.06]" />
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink/60">
          or start without a file
        </span>
        <span className="flex-1 border-t border-black/[0.06]" />
      </div>

      {/* Peers: one click each */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onClick={() => { cancelAutoImport(); onSelectEmpty(); }} disabled={parsing} className={OPTION_CARD}>
          <span className="p-2 rounded-lg bg-chalk-dark text-ink shrink-0" aria-hidden="true">
            <MdEditNote className="text-2xl" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold text-base text-ink mb-0.5">Start from Scratch</span>
            <span className="block text-xs text-ink/60">Blank sections, full control</span>
          </span>
          <MdArrowForward
            className="text-xl text-ink/30 shrink-0 self-center transition-all duration-200 group-hover:text-ink group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>

        <button type="button" onClick={() => { cancelAutoImport(); onSelectExample(); }} disabled={parsing} className={OPTION_CARD}>
          <span className="p-2 rounded-lg bg-chalk-dark text-ink shrink-0" aria-hidden="true">
            <MdPreview className="text-2xl" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold text-base text-ink mb-0.5">Use Example Content</span>
            <span className="block text-xs text-ink/60">Pre-written text to replace</span>
          </span>
          <MdArrowForward
            className="text-xl text-ink/30 shrink-0 self-center transition-all duration-200 group-hover:text-ink group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </ModalShell>
  );
};

export default TemplateStartModal;
