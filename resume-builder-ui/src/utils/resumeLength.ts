// src/utils/resumeLength.ts
//
// Estimates how many printed pages a resume will occupy, live, without a
// server round-trip.
//
// Why this exists: a resume is one page, read in six seconds, and shape
// matters as much as words. Nothing in the editor knew it was making a
// document -- there was no page meter, no silhouette, and the only way to
// learn you had spilled onto page two was to generate a PDF and look.
//
// The model is deliberately a heuristic. It counts wrapped lines against the
// per-element heights in templates/{modern,classic}/styles.css, laid out on
// wkhtmltopdf's default A4 page. It is calibrated, not derived: it has no
// font metrics, so it cannot know that a particular name wraps at 71
// characters rather than 73.
//
// ponytail: heuristic line-counting, no font metrics. That ceiling is fine
// because it is not the only source of truth -- whenever a real preview PDF
// exists, `calibrateAgainst()` folds the authoritative page count back in and
// the estimate self-corrects. Upgrade path if that ever proves too coarse:
// measure a hidden off-screen div styled with the template's own CSS, or ask
// the backend to return page count alongside the PDF.

import type { ContactInfo, Section } from '../types';

/** wkhtmltopdf defaults: A4 at 96dpi, 10mm margins; templates add body margin 10px. */
const PAGE_CONTENT_HEIGHT_PX = 1027;
const PAGE_CONTENT_WIDTH_PX = 698;

/** Average glyph advance at the templates' 14-15px body size, in px. */
const AVG_CHAR_PX = 7;

const CHARS_PER_LINE = Math.floor(PAGE_CONTENT_WIDTH_PX / AVG_CHAR_PX);
/** Bulleted content is indented 20px (styles.css `ul { padding-left: 20px }`). */
const CHARS_PER_BULLET_LINE = Math.floor((PAGE_CONTENT_WIDTH_PX - 20) / AVG_CHAR_PX);

/**
 * Per-element heights in px, read off the template CSS rather than guessed.
 * `line` is 14px x 1.6 line-height. `sectionHeading` is the 20px h2 plus its
 * 5px padding, 8px bottom margin and the 15px section margin.
 */
const H = {
  headerBlock: 130,   // name (36px) + contact line + social row
  sectionHeading: 48,
  line: 23,
  bulletGap: 5,       // li { margin-bottom: 5px }
  experienceItem: 70, // title (16px) + company/dates (15px) + margin-bottom 20px
  educationItem: 45,
  iconListItem: 34,   // icon row + margin-bottom 10px
} as const;

export interface ResumeLengthEstimate {
  /** Total content height in px at the template's own scale. */
  heightPx: number;
  /** Whole pages plus the fraction of the last one that is used, e.g. 1.3. */
  pages: number;
  /** Pages rounded up -- what the printed PDF will actually be. */
  pageCount: number;
  /** How full the final page is, 0-1. Drives the silhouette's fill. */
  lastPageFill: number;
  /** True once a real PDF has corrected the estimate. */
  calibrated: boolean;
}

/** Strips TipTap/markdown markup so character counts reflect visible text. */
export function visibleText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*|__|\*|_|`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

/** Wrapped line count for a string at a given measure. Empty text still costs nothing. */
function lines(text: string, charsPerLine = CHARS_PER_LINE): number {
  const t = visibleText(text);
  if (!t) return 0;
  return Math.max(1, Math.ceil(t.length / charsPerLine));
}

function sectionHeight(section: Section): number {
  let h = H.sectionHeading;
  const content = section.content as unknown;

  switch (section.type) {
    case 'text':
      h += lines(content as string) * H.line;
      break;

    case 'bulleted-list':
      for (const item of (content as string[]) ?? []) {
        h += lines(item, CHARS_PER_BULLET_LINE) * H.line + H.bulletGap;
      }
      break;

    case 'inline-list':
    case 'dynamic-column-list': {
      const items = ((content as string[]) ?? []).map(visibleText).filter(Boolean);
      if (!items.length) break;
      if (section.type === 'inline-list') {
        // Joined with ", " and wrapped as one paragraph.
        h += lines(items.join(', ')) * H.line;
      } else {
        // calculate_columns() in the generator lays these out in columns; the
        // tallest column drives height. Two columns is the common case.
        const columns = items.length > 6 ? 2 : 1;
        h += Math.ceil(items.length / columns) * H.line;
      }
      break;
    }

    case 'icon-list':
      h += ((content as { certification?: string }[]) ?? []).length * H.iconListItem;
      break;

    case 'education':
      h += ((content as unknown[]) ?? []).length * H.educationItem;
      break;

    case 'experience':
    default: {
      // `experience` is the default because the type is optional on legacy data.
      const items = content as { description?: string[] }[] | string | string[];
      if (typeof items === 'string') {
        h += lines(items) * H.line;
      } else if (Array.isArray(items)) {
        for (const item of items) {
          if (typeof item === 'string') {
            h += lines(item, CHARS_PER_BULLET_LINE) * H.line + H.bulletGap;
            continue;
          }
          h += H.experienceItem;
          for (const bullet of item?.description ?? []) {
            h += lines(bullet, CHARS_PER_BULLET_LINE) * H.line + H.bulletGap;
          }
        }
      }
      break;
    }
  }

  return h;
}

function headerHeight(contactInfo: ContactInfo | null): number {
  if (!contactInfo) return 0;
  const extraSocialRows = Math.max(0, (contactInfo.social_links?.length ?? 0) - 2);
  return H.headerBlock + extraSocialRows * H.line;
}

/**
 * Scalar applied to the raw estimate, learned from real PDFs. Starts at 1 and
 * is nudged toward whatever the last generated preview actually measured, so
 * repeated previews make the live estimate converge on the truth.
 */
let calibration = 1;
let hasCalibrated = false;

/** Resets learned calibration. Exported for tests. */
export function resetCalibration(): void {
  calibration = 1;
  hasCalibrated = false;
}

/**
 * Folds an authoritative page count from a generated PDF back into the model.
 * `rawHeightPx` must be the uncalibrated height for the same content.
 */
export function calibrateAgainst(rawHeightPx: number, actualPageCount: number): void {
  if (!Number.isFinite(rawHeightPx) || rawHeightPx <= 0) return;
  if (!Number.isInteger(actualPageCount) || actualPageCount < 1) return;

  // The true height is somewhere in (pageCount-1, pageCount] pages. Aim at the
  // middle of that band: it is the least-wrong single point given what a page
  // count alone can tell us.
  const targetPx = (actualPageCount - 0.5) * PAGE_CONTENT_HEIGHT_PX;
  const observed = targetPx / rawHeightPx;

  // Ease toward the observation rather than snapping, so one unusual resume
  // cannot throw the model, and clamp to a sane band.
  calibration = hasCalibrated ? calibration + (observed - calibration) * 0.5 : observed;
  calibration = Math.min(1.6, Math.max(0.6, calibration));
  hasCalibrated = true;
}

/** Uncalibrated content height. Pair with `calibrateAgainst` when a PDF lands. */
export function rawHeightPx(contactInfo: ContactInfo | null, sections: Section[]): number {
  return headerHeight(contactInfo) + (sections ?? []).reduce((sum, s) => sum + sectionHeight(s), 0);
}

export function estimateResumeLength(
  contactInfo: ContactInfo | null,
  sections: Section[]
): ResumeLengthEstimate {
  const heightPx = rawHeightPx(contactInfo, sections) * calibration;
  const pages = heightPx / PAGE_CONTENT_HEIGHT_PX;
  const pageCount = Math.max(1, Math.ceil(pages));
  const usedOnLast = pages - Math.floor(pages);

  return {
    heightPx,
    pages,
    pageCount,
    // A resume that lands exactly on a page boundary fills that page.
    lastPageFill: pages === 0 ? 0 : usedOnLast === 0 ? 1 : usedOnLast,
    calibrated: hasCalibrated,
  };
}

export const __testing = { PAGE_CONTENT_HEIGHT_PX, CHARS_PER_LINE, H };
