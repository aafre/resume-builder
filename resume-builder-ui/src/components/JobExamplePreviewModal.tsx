/**
 * Job Example Preview Modal
 *
 * Image lightbox for browsing job example previews from the unified templates
 * page. Mirrors TemplatePreviewModal's keyboard, focus, and swipe behaviour.
 * Primary CTA routes to /examples/{slug} where the full flow lives.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { JobExampleInfo } from '../data/jobExamples';

const PREVIEW_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
  : '';

const SWIPE_THRESHOLD = 50;

export interface JobExamplePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobExampleInfo[];
  initialIndex: number;
}

export const JobExamplePreviewModal: React.FC<JobExamplePreviewModalProps> = ({
  isOpen,
  onClose,
  jobs,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [animState, setAnimState] = useState<'open' | 'closed'>('closed');
  const [imageKey, setImageKey] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<number>(0);
  const closingRef = useRef(false);

  const total = jobs.length;
  const current = jobs[currentIndex] ?? null;

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

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      closingRef.current = false;
      requestAnimationFrame(() => {
        setAnimState('open');
      });
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && animState === 'open') {
      modalRef.current?.focus();
      mobileModalRef.current?.focus();
    }
  }, [isOpen, animState]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setAnimState('closed');
    setTimeout(() => {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
      onClose();
    }, 300);
  }, [onClose]);

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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, goNext, goPrev]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

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
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen, currentIndex]);

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
    setSwipeOffset(dx * 0.4);
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

  if (!isOpen) return null;
  if (!current) return null;

  const imgSrc = `${PREVIEW_BASE_URL}/${current.slug}.webp`;
  const fullExampleHref = `/examples/${current.slug}`;
  const counter = `${currentIndex + 1} of ${total}`;

  const modal = (
    <div
      data-state={animState}
      className="fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
      role="dialog"
      aria-modal="true"
      aria-label={`Example preview: ${current.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Desktop */}
      <div
        ref={modalRef}
        tabIndex={-1}
        data-state={animState}
        className="hidden md:flex relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden w-[80vw] max-w-6xl max-h-[85vh] flex-row outline-none transition-all duration-300 ease-out data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[60%] bg-chalk-dark flex items-center justify-center min-h-0">
          <img
            key={imageKey}
            src={imgSrc}
            alt={`Preview of ${current.title} example`}
            className="w-full h-full object-contain p-6 tpm-img-fade"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.onerror = null;
              img.src = '/docs/templates/modern-no-icons.png';
            }}
            draggable={false}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous example"
              >
                <ChevronLeftIcon className="w-5 h-5 text-ink" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next example"
              >
                <ChevronRightIcon className="w-5 h-5 text-ink" />
              </button>
            </>
          )}
        </div>

        <div className="w-[40%] flex flex-col min-h-0">
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

          <div className="flex-1 overflow-y-auto px-8 pb-6 pt-2">
            <span className="inline-block rounded-full bg-chalk-dark px-3 py-1 text-xs text-stone-warm mb-4">
              Resume example
            </span>

            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              {current.title}
            </h2>

            <p className="text-stone-warm font-extralight leading-relaxed text-base mb-6">
              {current.metaDescription}
            </p>

            <p className="text-mist text-sm mb-6">{counter}</p>

            <Link
              to={fullExampleHref}
              onClick={handleClose}
              className="w-full btn-primary py-3.5 px-8 text-base font-semibold inline-flex items-center justify-center gap-2"
            >
              See Full Example →
            </Link>

            <p className="text-xs text-mist mt-4">
              Includes the full resume, bullet-point bank, and FAQs.
            </p>
          </div>

          <div className="px-8 pb-4 pt-2 border-t border-black/[0.06]">
            <p className="text-xs text-mist text-center">
              &larr; &rarr; to navigate &middot; Esc to close
            </p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        ref={mobileModalRef}
        tabIndex={-1}
        data-state={animState}
        className="md:hidden fixed inset-0 z-10 flex flex-col bg-white outline-none transition-all duration-300 ease-out data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=closed]:opacity-0 data-[state=closed]:translate-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-black/[0.06]">
          <button
            type="button"
            onClick={goPrev}
            className="p-2 rounded-full hover:bg-chalk-dark transition-all duration-300"
            aria-label="Previous example"
            disabled={total <= 1}
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

        <div
          className="flex-1 bg-chalk-dark flex items-center justify-center overflow-hidden min-h-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={imageKey}
            src={imgSrc}
            alt={`Preview of ${current.title} example`}
            className="max-w-full max-h-full object-contain p-4 tpm-img-fade"
            style={{
              transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
              transition: swipeOffset ? 'none' : 'transform 0.3s ease-out',
            }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.onerror = null;
              img.src = '/docs/templates/modern-no-icons.png';
            }}
            draggable={false}
          />
        </div>

        <div
          className="bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] relative"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-black/10" />
          </div>

          <div className="px-5 pb-2">
            <h2 className="font-display text-xl font-bold text-ink mb-2">
              {current.title}
            </h2>

            <p className="text-stone-warm font-extralight text-sm leading-relaxed mb-4">
              {current.metaDescription}
            </p>

            <Link
              to={fullExampleHref}
              onClick={handleClose}
              className="w-full btn-primary py-3.5 px-8 text-base font-semibold inline-flex items-center justify-center gap-2"
            >
              See Full Example →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default JobExamplePreviewModal;
