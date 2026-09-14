import React, { useState, useEffect, useId, useRef } from "react";
import ModalShell from "./shared/ModalShell";
import { MdEditNote, MdPreview, MdClose, MdArrowForward } from "react-icons/md";
import { DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useResumeParser } from "../hooks/useResumeParser";

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

  const { parseResume, parsing, progress, progressMessage, error, clearError } = useResumeParser();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
      setParseResult(null);
      clearError();
    }
  }, [isOpen, clearError]);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseResume(file);
      setParseResult(result);

      // Auto-redirect on high confidence
      if (result.confidence >= 0.9) {
        setTimeout(() => {
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

      {/* Error */}
      {error && !parsing && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6" role="alert">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-red-900 mb-1">Upload failed</h3>
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
            Try Again
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
        <button type="button" onClick={onSelectEmpty} disabled={parsing} className={OPTION_CARD}>
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

        <button type="button" onClick={onSelectExample} disabled={parsing} className={OPTION_CARD}>
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
