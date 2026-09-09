/**
 * The resume, rendered as a document you can read the scan against.
 *
 * Hovering or focusing a keyword in the results paints that keyword's evidence
 * directly onto the resume text — the sentence the model actually matched, plus
 * every literal occurrence of the term — and scrolls it into view.
 *
 * Painting is done with the CSS Custom Highlight API rather than wrapper spans:
 * no DOM is rewritten as the active keyword changes, so switching keywords costs
 * a repaint instead of a re-render of the whole document.
 */

import { useEffect, useMemo, useRef } from 'react';
import { tokenize, findRanges, sentenceRange } from '../../utils/resumeEvidence';

export type EvidenceVariant = 'matched' | 'partial' | 'missing';

export interface ActiveEvidence {
  keyword: string;
  variant: EvidenceVariant;
  context?: string;
}

/** The pane only earns its place where highlights can be painted. */
export const supportsHighlights =
  typeof CSS !== 'undefined' &&
  'highlights' in CSS &&
  typeof Highlight !== 'undefined';

const REGISTRIES = [
  'ks-evidence-matched',
  'ks-evidence-partial',
  'ks-evidence-missing',
  'ks-term',
] as const;

function clearHighlights() {
  for (const name of REGISTRIES) CSS.highlights.delete(name);
}

export default function ResumeEvidencePane({
  resumeText,
  active,
}: {
  resumeText: string;
  active: ActiveEvidence | null;
}) {
  const paneRef = useRef<HTMLDivElement>(null);
  const tokens = useMemo(() => tokenize(resumeText), [resumeText]);

  useEffect(() => {
    if (!supportsHighlights) return;
    const node = paneRef.current?.firstChild;
    if (!node) return;

    clearHighlights();
    if (!active) return;

    const toRange = (r: { start: number; end: number }) => {
      const range = document.createRange();
      range.setStart(node, r.start);
      range.setEnd(node, r.end);
      return range;
    };

    // Every literal occurrence of the term, plus the one sentence that carries
    // it — the term's own sentence where it appears at all, otherwise the chunk
    // the model matched, snapped to sentence bounds.
    const terms = active.variant === 'missing' ? [] : findRanges(tokens, active.keyword, 12);
    const chunk = active.context ? findRanges(tokens, active.context) : [];
    const evidence = (terms[0] ? [terms[0]] : chunk).map((r) => sentenceRange(resumeText, r));

    if (evidence.length > 0) {
      CSS.highlights.set(`ks-evidence-${active.variant}`, new Highlight(...evidence.map(toRange)));
    }
    if (terms.length > 0) {
      CSS.highlights.set('ks-term', new Highlight(...terms.map(toRange)));
    }

    // Bring the first hit to the middle of the pane.
    const lead = terms[0] ?? evidence[0];
    const pane = paneRef.current;
    if (lead && pane) {
      const rect = toRange(lead).getBoundingClientRect();
      const paneRect = pane.getBoundingClientRect();
      const target =
        pane.scrollTop + (rect.top - paneRect.top) - pane.clientHeight / 2 + rect.height / 2;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      pane.scrollTo({ top: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });

      // Stacked layouts put the pane below the keyword lanes, so a tap would
      // otherwise highlight something off-screen. On desktop the pane is
      // sticky and already in view, so this is a no-op there.
      if (paneRect.top > window.innerHeight || paneRect.bottom < 0) {
        pane.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      }
    }

    return clearHighlights;
  }, [active, tokens, resumeText]);

  const legend =
    active === null
      ? 'Hover a keyword to see where it lands in your resume.'
      : active.variant === 'missing'
        ? `Nothing in your resume covers "${active.keyword}" — the closest passage is marked.`
        : active.variant === 'partial'
          ? `Related wording for "${active.keyword}" — close, but not the term itself.`
          : `Where "${active.keyword}" appears.`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 px-5 pt-5 pb-3">
        <h3 className="font-display text-sm font-bold text-ink">Your Resume</h3>
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink/60 uppercase">
          Evidence
        </span>
      </div>
      <div
        ref={paneRef}
        className="ks-doc px-5 pb-5 max-h-[32rem] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-ink/80 font-extralight"
      >
        {resumeText}
      </div>
      <p
        aria-live="polite"
        className="border-t border-black/[0.06] bg-chalk px-5 py-3 text-xs text-ink/60"
      >
        {legend}
      </p>
    </div>
  );
}
