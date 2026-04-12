/**
 * Template Preview Modal
 *
 * Lightbox/preview modal for viewing resume templates in detail.
 * Provides a rich preview experience before committing to use a template.
 *
 * Features:
 * - Portal-based rendering to document.body
 * - Desktop: side-by-side layout (60% image, 40% info panel)
 * - Mobile (< 768px): full-screen overlay with bottom sheet for info
 * - Smooth entrance/exit animations via data-state attribute
 * - Keyboard navigation: ArrowLeft/ArrowRight for prev/next, Escape to close
 * - Touch swipe on mobile for prev/next
 * - Focus trap with restore on close
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Array<{
    id: string;
    name: string;
    description: string;
    image_url: string;
    tags?: string[];
    supports_icons?: boolean;
  }>;
  initialTemplateIndex: number;
  onUseTemplate: (templateId: string) => void;
  isLoading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Decision-support taglines for each template (matches TemplateCard) */
const TEMPLATE_BEST_FOR: Record<string, string> = {
  'modern-with-icons': 'Best for tech, startups & creative roles',
  'modern-no-icons': 'Best for any industry — clean and versatile',
  'ats-optimized': 'Best for large employers with ATS screening',
  'student': 'Best for students & first-time job seekers',
  'executive': 'Best for senior leaders & C-suite',
  'classic-alex-rivera': 'Best for corporate, finance & law',
  'classic-jane-doe': 'Best for creative professionals',
  'two-column': 'Best for tech roles with many skills',
};

const SWIPE_THRESHOLD = 50;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templates,
  initialTemplateIndex,
  onUseTemplate,
  isLoading = false,
}) => {
  /* ----- state ----- */
  const [currentIndex, setCurrentIndex] = useState(initialTemplateIndex);
  const [animState, setAnimState] = useState<'open' | 'closed'>('closed');
  const [imageKey, setImageKey] = useState(0); // triggers cross-fade on nav
  const [swipeOffset, setSwipeOffset] = useState(0);

  /* ----- refs ----- */
  const modalRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<number>(0);
  const closingRef = useRef(false);

  const total = templates.length;
  const current = templates[currentIndex] ?? null;

  /* ---------------------------------------------------------------- */
  /*  Navigation helpers                                               */
  /* ---------------------------------------------------------------- */

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((i) => (i + 1) % total);
    setImageKey((k) => k + 1);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((i) => (i - 1 + total) % total);
    setImageKey((k) => k + 1);
  }, [total]);

  /* ---------------------------------------------------------------- */
  /*  Open / close lifecycle                                           */
  /* ---------------------------------------------------------------- */

  // Sync initialTemplateIndex when it changes externally
  useEffect(() => {
    setCurrentIndex(initialTemplateIndex);
  }, [initialTemplateIndex]);

  // Entrance animation
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      closingRef.current = false;
      // Force a frame so the closed styles render first
      requestAnimationFrame(() => {
        setAnimState('open');
      });
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  // Focus the modal once it opens
  useEffect(() => {
    if (isOpen && animState === 'open') {
      // Focus whichever modal container is visible
      modalRef.current?.focus();
      mobileModalRef.current?.focus();
    }
  }, [isOpen, animState]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setAnimState('closed');
    // Wait for exit animation before unmounting
    setTimeout(() => {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
      onClose();
    }, 300);
  }, [onClose]);

  /* ---------------------------------------------------------------- */
  /*  Keyboard                                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case 'Enter':
          // If focus is on the CTA button, the browser handles it.
          // This catches Enter anywhere else in the modal.
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, goNext, goPrev]);

  /* ---------------------------------------------------------------- */
  /*  Focus trap                                                       */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // Find the currently visible modal container
      const container = modalRef.current?.offsetParent
        ? modalRef.current
        : mobileModalRef.current;
      if (!container) return;

      const focusableEls = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen, currentIndex]);

  /* ---------------------------------------------------------------- */
  /*  Touch swipe (mobile)                                             */
  /* ---------------------------------------------------------------- */

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchMoveRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    touchMoveRef.current = dx;
    setSwipeOffset(dx * 0.4); // dampen the visual offset
  }, []);

  const handleTouchEnd = useCallback(() => {
    const dx = touchMoveRef.current;
    setSwipeOffset(0);
    touchStartRef.current = null;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  /* ---------------------------------------------------------------- */
  /*  CTA handler                                                      */
  /* ---------------------------------------------------------------- */

  const handleUseTemplate = useCallback(() => {
    if (current) onUseTemplate(current.id);
  }, [current, onUseTemplate]);

  /* ---------------------------------------------------------------- */
  /*  Early return                                                     */
  /* ---------------------------------------------------------------- */

  if (!isOpen) return null;
  if (!current) return null;

  const bestFor = TEMPLATE_BEST_FOR[current.id] ?? '';
  const counter = `${currentIndex + 1} of ${total}`;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const modal = (
    <>
      <div
        data-state={animState}
        className={`
          fixed inset-0 z-[10000] flex items-center justify-center
          transition-all duration-300
          data-[state=open]:opacity-100 data-[state=closed]:opacity-0
        `}
        role="dialog"
        aria-modal="true"
        aria-label={`Template preview: ${current.name}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* ========================================================== */}
        {/* DESKTOP MODAL (hidden below md)                             */}
        {/* ========================================================== */}
        <div
          ref={modalRef}
          tabIndex={-1}
          data-state={animState}
          className={`
            hidden md:flex
            relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden
            w-[80vw] max-w-6xl max-h-[85vh]
            flex-row
            outline-none
            transition-all duration-300 ease-out
            data-[state=open]:scale-100 data-[state=open]:opacity-100
            data-[state=closed]:scale-95 data-[state=closed]:opacity-0
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* --- Left: Image area (60%) --- */}
          <div className="relative w-[60%] bg-chalk-dark flex items-center justify-center min-h-0">
            <img
              key={imageKey}
              src={current.image_url}
              alt={`Preview of ${current.name} template`}
              className="w-full h-full object-contain p-6 tpm-img-fade"
              draggable={false}
            />

            {/* Prev arrow */}
            {total > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous template"
              >
                <ChevronLeftIcon className="w-5 h-5 text-ink" />
              </button>
            )}

            {/* Next arrow */}
            {total > 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next template"
              >
                <ChevronRightIcon className="w-5 h-5 text-ink" />
              </button>
            )}
          </div>

          {/* --- Right: Info panel (40%) --- */}
          <div className="w-[40%] flex flex-col min-h-0">
            {/* Close button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                type="button"
                onClick={handleClose}
                className="text-stone-warm hover:text-ink rounded-full p-1.5 hover:bg-chalk-dark transition-all duration-300"
                aria-label="Close preview"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 pb-6 pt-2">
              {/* Tags */}
              {current.tags && current.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-chalk-dark px-3 py-1 text-xs text-stone-warm"
                    >
                      {tag}
                    </span>
                  ))}
                  {current.supports_icons && (
                    <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent font-medium">
                      Icon support
                    </span>
                  )}
                </div>
              )}

              {/* Template name */}
              <h2 className="font-display text-2xl font-bold text-ink mb-2">
                {current.name}
              </h2>

              {/* Best for tagline */}
              {bestFor && (
                <p className="text-accent font-medium text-sm mb-4">{bestFor}</p>
              )}

              {/* Description */}
              <p className="text-stone-warm font-extralight leading-relaxed text-base mb-6">
                {current.description}
              </p>

              {/* Counter */}
              <p className="text-mist text-sm mb-6">{counter}</p>

              {/* CTA */}
              <button
                type="button"
                onClick={handleUseTemplate}
                disabled={isLoading}
                className="w-full btn-primary py-3.5 px-8 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Use This Template'}
              </button>
            </div>

            {/* Keyboard hint */}
            <div className="px-8 pb-4 pt-2 border-t border-black/[0.06]">
              <p className="text-xs text-mist text-center">
                &larr; &rarr; to navigate &middot; Esc to close
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* MOBILE MODAL (hidden at md+)                                */}
        {/* ========================================================== */}
        <div
          ref={mobileModalRef}
          tabIndex={-1}
          data-state={animState}
          className={`
            md:hidden
            fixed inset-0 z-10 flex flex-col bg-white
            outline-none
            transition-all duration-300 ease-out
            data-[state=open]:opacity-100 data-[state=open]:translate-y-0
            data-[state=closed]:opacity-0 data-[state=closed]:translate-y-4
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-black/[0.06]">
            <button
              type="button"
              onClick={goPrev}
              className="p-2 rounded-full hover:bg-chalk-dark transition-all duration-300"
              aria-label="Previous template"
            >
              <ChevronLeftIcon className="w-5 h-5 text-ink" />
            </button>
            <span className="text-sm text-stone-warm font-medium">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-chalk-dark transition-all duration-300"
              aria-label="Close preview"
            >
              <XMarkIcon className="w-5 h-5 text-ink" />
            </button>
          </div>

          {/* Image area with touch swipe */}
          <div
            className="flex-1 bg-chalk-dark flex items-center justify-center overflow-hidden min-h-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={imageKey}
              src={current.image_url}
              alt={`Preview of ${current.name} template`}
              className="max-w-full max-h-full object-contain p-4 tpm-img-fade"
              style={{
                transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
                transition: swipeOffset ? 'none' : 'transform 0.3s ease-out',
              }}
              draggable={false}
            />
          </div>

          {/* Bottom sheet */}
          <div
            className="bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] relative"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-black/10" />
            </div>

            <div className="px-5 pb-2">
              {/* Template name */}
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                {current.name}
              </h2>

              {/* Best for tagline */}
              {bestFor && (
                <p className="text-accent font-medium text-sm mb-3">{bestFor}</p>
              )}

              {/* Tags */}
              {current.tags && current.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-chalk-dark px-2.5 py-0.5 text-xs text-stone-warm"
                    >
                      {tag}
                    </span>
                  ))}
                  {current.supports_icons && (
                    <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent font-medium">
                      Icon support
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={handleUseTemplate}
                disabled={isLoading}
                className="w-full btn-primary py-3.5 px-8 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Use This Template'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
};

export default TemplatePreviewModal;
