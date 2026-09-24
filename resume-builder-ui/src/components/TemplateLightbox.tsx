import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/solid";
import ModalShell from "./shared/ModalShell";
import { withViewTransition } from "../lib/viewTransition";

export interface LightboxTemplate {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface TemplateLightboxProps {
  templates: LightboxTemplate[];
  /** Index of the template on show, or null when the reader is closed. */
  activeIndex: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onStart: (templateId: string) => void;
  busy?: boolean;
}

/**
 * Full-bleed reader for a template preview.
 *
 * The card image and the sheet here share `view-transition-name:
 * template-sheet`, so opening and closing morphs one into the other. Exactly
 * one element may carry that name at a time — the carousel drops it from every
 * card while the reader is open.
 *
 * The source previews are ~930px wide, so the sheet is never scaled past 1:1:
 * "full size" means native pixels, not an upscale that would just look soft.
 */
export default function TemplateLightbox({
  templates,
  activeIndex,
  onIndexChange,
  onClose,
  onStart,
  busy = false,
}: TemplateLightboxProps) {
  const titleId = useId();
  const startRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [fullSize, setFullSize] = useState(false);

  const isOpen = activeIndex !== null;
  const active = isOpen ? templates[activeIndex] : null;

  // Fit-to-screen again whenever the reader opens or the sheet changes.
  useEffect(() => {
    setFullSize(false);
  }, [activeIndex]);

  if (!isOpen || !active) return null;

  const step = (delta: number) => {
    const next = (activeIndex + delta + templates.length) % templates.length;
    withViewTransition(() => onIndexChange(next));
  };

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    withViewTransition(() => onIndexChange(index));
  };

  const arrowButton =
    "grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white " +
    "hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink " +
    "transition-colors disabled:opacity-40";

  return (
    <ModalShell
      isOpen
      onClose={onClose}
      labelledBy={titleId}
      initialFocusRef={startRef}
      overlayClassName="fixed inset-0 z-[9999] bg-ink/95 backdrop-blur-sm"
      panelClassName="h-full w-full flex flex-col outline-none"
      panelTestId="template-lightbox"
    >
      <div
        className="h-full flex flex-col"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        {/* Template strip */}
        <div className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10">
          <nav
            aria-label="Templates"
            className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none"
          >
            {templates.map((template, index) => (
              <button
                key={template.id}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === activeIndex ? "true" : undefined}
                ref={
                  index === activeIndex
                    ? (el) =>
                        // jsdom has no scrollIntoView, and neither do some
                        // older embedded webviews.
                        el?.scrollIntoView?.({ inline: "center", block: "nearest" })
                    : undefined
                }
                className={`font-mono text-xs tracking-[0.15em] uppercase whitespace-nowrap px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  index === activeIndex
                    ? "text-accent bg-white/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {template.name}
              </button>
            ))}
          </nav>

          <span className="hidden sm:block font-mono text-xs tracking-[0.15em] text-white/60 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(templates.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className={arrowButton}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* The sheet */}
        <div className="flex-1 flex items-center gap-4 px-4 sm:px-6 py-6 min-h-0">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous template"
            className={`hidden md:grid ${arrowButton}`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <div
            className={`flex-1 h-full min-h-0 flex items-start justify-center ${
              fullSize ? "overflow-auto sheet-pan" : "overflow-clip items-center"
            }`}
            onPointerDown={(event) => {
              swipeStart.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              const from = swipeStart.current;
              swipeStart.current = null;
              if (!from || fullSize) return;
              const dx = event.clientX - from.x;
              const dy = event.clientY - from.y;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                step(dx < 0 ? 1 : -1);
              }
            }}
          >
            <img
              src={active.image_url}
              alt={`${active.name} resume template preview`}
              draggable={false}
              style={{ viewTransitionName: "template-sheet" }}
              className={
                fullSize
                  ? "w-auto max-w-none rounded-lg shadow-2xl bg-white"
                  : "max-h-full max-w-full w-auto object-contain rounded-lg shadow-2xl bg-white"
              }
            />
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next template"
            className={`hidden md:grid ${arrowButton}`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Footer bar */}
        <div className="border-t border-white/10 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2
              id={titleId}
              className="font-display text-xl md:text-2xl font-extrabold text-white"
            >
              {active.name}
            </h2>
            <p className="text-sm font-extralight text-white/60 leading-relaxed">
              {active.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFullSize((v) => !v)}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-lg font-mono text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {fullSize ? (
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              ) : (
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              )}
              {fullSize ? "Fit to screen" : "Full size"}
            </button>

            <button
              ref={startRef}
              type="button"
              onClick={() => onStart(active.id)}
              disabled={busy}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-accent text-ink font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {busy ? "Starting…" : "Start with this template"}
              {!busy && <ArrowRightIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
