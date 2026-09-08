// src/components/editor/DocumentSpine.tsx
//
// A live silhouette of the resume as a printed document.
//
// The editor knew everything about the user's data and nothing about the
// artifact it was producing. A resume is one page, read in six seconds, and
// "will this still fit on one page?" is the question people actually ask while
// writing one -- but answering it meant generating a PDF and looking. This puts
// the answer on screen continuously, for free.
//
// Restraint is the point. It is a workbench instrument, not an ornament:
// paper-coloured pages, an ink wash for used space, and Signal Green spent on
// exactly one thing -- the "it fits on one page" state, which is precisely what
// DESIGN.md says green means (live, passing, actionable). No green anywhere
// else in it, so the 10% Rule holds and the signal keeps its meaning.

import React from 'react';
import { FileText } from 'lucide-react';
import type { ResumeLengthEstimate } from '../../utils/resumeLength';

/** A4 is 1:1.414. These are the on-screen page chips, not the real document.
 *  Kept small on purpose: this rail's primary job is jumping between sections,
 *  and every pinned pixel here is taken from that scroll region. */
const PAGE_W = 26;
const PAGE_H = Math.round(PAGE_W * 1.414);

/** Beyond this we stop drawing chips and just state the number. */
const MAX_RENDERED_PAGES = 4;

export interface DocumentSpineProps {
  estimate: ResumeLengthEstimate;
  /** Collapsed rail renders the count only -- there is no room for the chips. */
  isCollapsed?: boolean;
}

/** How much of page `index` (0-based) is used, 0-1. */
function fillFor(index: number, estimate: ResumeLengthEstimate): number {
  const lastIndex = estimate.pageCount - 1;
  if (index < lastIndex) return 1;
  if (index > lastIndex) return 0;
  return estimate.lastPageFill;
}

/**
 * Plain-language summary. Deliberately never claims precision it does not have:
 * until a real PDF has calibrated the model, it says "about".
 */
export function describeLength(estimate: ResumeLengthEstimate): string {
  const { pageCount, lastPageFill, calibrated } = estimate;
  const hedge = calibrated ? '' : 'about ';

  if (pageCount === 1) {
    return lastPageFill > 0.92 ? `${hedge}one full page` : `${hedge}one page`;
  }
  // How far onto the final page the content runs, in whole lines, so the
  // number means something a writer can act on.
  const linesOver = Math.max(1, Math.round((lastPageFill * 1027) / 23));
  if (pageCount === 2 && lastPageFill < 0.25) {
    return `${hedge}2 pages — ${linesOver} ${linesOver === 1 ? 'line' : 'lines'} onto the second`;
  }
  return `${hedge}${pageCount} pages`;
}

export const DocumentSpine: React.FC<DocumentSpineProps> = ({ estimate, isCollapsed = false }) => {
  const { pageCount } = estimate;
  const fitsOnePage = pageCount === 1;
  const summary = describeLength(estimate);
  const rendered = Math.min(pageCount, MAX_RENDERED_PAGES);

  if (isCollapsed) {
    return (
      <div
        className="flex flex-col items-center gap-1 py-2.5"
        title={`Resume length: ${summary}`}
      >
        <FileText
          className={`h-4 w-4 ${fitsOnePage ? 'text-accent-text' : 'text-ink/60'}`}
          aria-hidden="true"
        />
        <span className="text-[10px] font-medium leading-tight text-ink/60 tabular-nums">
          {pageCount}p
        </span>
        <span className="sr-only" aria-live="polite">
          Resume length: {summary}
        </span>
      </div>
    );
  }

  return (
    <div className="px-1 py-2.5">
      <div className="flex items-center gap-2.5 px-1">
        {/* The silhouette. Decorative: the sentence beside it carries the meaning. */}
        <div className="flex flex-shrink-0 gap-1" aria-hidden="true">
          {Array.from({ length: rendered }, (_, i) => {
            const fill = fillFor(i, estimate);
            return (
              <div
                key={i}
                className="relative overflow-clip rounded-[3px] border border-gray-300 bg-white"
                style={{ width: PAGE_W, height: PAGE_H }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 top-0 origin-top bg-ink/[0.13]"
                  style={{
                    transform: `scaleY(${fill})`,
                    transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                {/* Marks where this page ends, so a nearly-full page reads as nearly full. */}
                {fill > 0.92 && (
                  <div className="absolute inset-x-0 bottom-0 h-px bg-ink/25" />
                )}
              </div>
            );
          })}
          {pageCount > MAX_RENDERED_PAGES && (
            <div
              className="flex items-center px-1 text-[11px] font-medium text-ink/60 tabular-nums"
              style={{ height: PAGE_H }}
            >
              +{pageCount - MAX_RENDERED_PAGES}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[13px] font-semibold leading-tight ${
              fitsOnePage ? 'text-accent-text' : 'text-ink'
            }`}
          >
            {summary}
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-ink/60">
            {fitsOnePage ? 'Recruiters prefer one page.' : 'Trim bullets to pull it back.'}
          </p>
        </div>
      </div>

      {/* Announce page-count changes only. Keyed on the count so that typing
          inside a page does not chatter at screen-reader users. */}
      <span className="sr-only" aria-live="polite" key={pageCount}>
        Resume is now {summary}.
      </span>
    </div>
  );
};

export default DocumentSpine;
