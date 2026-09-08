// src/hooks/editor/useResumeLength.ts
//
// Live page-length estimate for the editor's document spine, corrected against
// real PDFs whenever one is available.
//
// Two sources of truth, in order of preference:
//   1. A generated preview PDF. `pdfjs-dist` is already a dependency (see
//      PdfViewerMobile.tsx), so the authoritative page count is free -- and
//      feeding it to `calibrateAgainst` teaches the heuristic.
//   2. The heuristic in utils/resumeLength.ts, which runs on every keystroke.
//
// pdfjs is imported dynamically: the editor entry chunk is already heavier than
// it should be, and nothing here is needed until a preview actually exists.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ContactInfo, Section } from '../../types';
import {
  estimateResumeLength,
  rawHeightPx,
  calibrateAgainst,
  type ResumeLengthEstimate,
} from '../../utils/resumeLength';

/** Debounce so a fast typist does not re-measure the whole resume per keystroke. */
const RECALC_DELAY_MS = 250;

export function useResumeLength(
  contactInfo: ContactInfo | null,
  sections: Section[],
  previewUrl?: string | null
): ResumeLengthEstimate {
  const [estimate, setEstimate] = useState<ResumeLengthEstimate>(() =>
    estimateResumeLength(contactInfo, sections)
  );

  // Bumped when calibration changes, to force a recompute with the new scalar.
  const [calibrationTick, setCalibrationTick] = useState(0);
  const calibratedUrlRef = useRef<string | null>(null);

  // Cheap identity for the content, so we only recompute when it really changed.
  const contentKey = useMemo(
    () => JSON.stringify([contactInfo, sections]),
    [contactInfo, sections]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setEstimate(estimateResumeLength(contactInfo, sections));
    }, RECALC_DELAY_MS);
    return () => clearTimeout(id);
    // contentKey is the real dependency; contactInfo/sections are read inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, calibrationTick]);

  // When a preview PDF lands, read its true page count and fold it back in.
  useEffect(() => {
    if (!previewUrl) return;
    if (calibratedUrlRef.current === previewUrl) return;

    let cancelled = false;
    calibratedUrlRef.current = previewUrl;

    (async () => {
      try {
        const [{ getDocument, GlobalWorkerOptions }, response] = await Promise.all([
          import('pdfjs-dist'),
          fetch(previewUrl),
        ]);
        if (cancelled || !response.ok) return;

        // Mirrors the worker setup already used by PdfViewerMobile.
        if (!GlobalWorkerOptions.workerSrc) {
          GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.js',
            import.meta.url
          ).toString();
        }

        const data = await response.arrayBuffer();
        if (cancelled) return;

        const pdf = await getDocument({ data }).promise;
        const actualPages = pdf.numPages;
        pdf.destroy?.();
        if (cancelled || !actualPages) return;

        calibrateAgainst(rawHeightPx(contactInfo, sections), actualPages);
        setCalibrationTick((t) => t + 1);
      } catch {
        // A failed calibration is not a failure of the feature -- the heuristic
        // still answers the question. Stay quiet and keep estimating.
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  return estimate;
}
