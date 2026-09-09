/**
 * Locates a keyword's evidence inside the raw resume text so the scanner can
 * highlight it in place.
 *
 * The worker's `bestMatchContext` is a *chunk*, not a substring: chunkResume()
 * rewrites newlines as ". " and slices at 150 chars, so a plain indexOf misses
 * any chunk that spans a line break or ends mid-word. Matching on the word
 * sequence instead survives both, and the token offsets map straight back onto
 * the original string for a Range.
 */

export interface Token {
  /** lowercased word */
  t: string;
  /** start offset in the source text */
  s: number;
  /** end offset in the source text */
  e: number;
}

export interface EvidenceRange {
  start: number;
  end: number;
}

// Keeps "c++" and "c#" whole; "node.js" splits to node + js on both sides, so
// the sequences still line up.
const WORD_RE = /[\p{L}\p{N}+#]+/gu;

export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  for (const m of text.matchAll(WORD_RE)) {
    out.push({ t: m[0].toLowerCase(), s: m.index, e: m.index + m[0].length });
  }
  return out;
}

function scan(tokens: Token[], phrase: string[], limit: number): EvidenceRange[] {
  if (phrase.length === 0) return [];
  const found: EvidenceRange[] = [];
  outer: for (let i = 0; i + phrase.length <= tokens.length; i++) {
    for (let j = 0; j < phrase.length; j++) {
      if (tokens[i + j].t !== phrase[j]) continue outer;
    }
    found.push({ start: tokens[i].s, end: tokens[i + phrase.length - 1].e });
    if (found.length >= limit) break;
    i += phrase.length - 1;
  }
  return found;
}

/**
 * Find where `phrase` occurs in the text `tokens` were built from.
 * Returns up to `limit` ranges, earliest first; empty if the phrase isn't there.
 */
export function findRanges(tokens: Token[], phrase: string, limit = 1): EvidenceRange[] {
  const words = tokenize(phrase).map((t) => t.t);
  const hit = scan(tokens, words, limit);
  if (hit.length > 0 || words.length < 2) return hit;
  // A 150-char slice can cut the final word in half — retry without it.
  return scan(tokens, words.slice(0, -1), limit);
}

const SENTENCE_END = /[.!?\n]/;

/**
 * Grow (or shrink) a range to the sentence that contains it.
 *
 * The worker's context chunk is a 150-char slice of a one- or two-sentence
 * window, so highlighting it verbatim paints half of a neighbouring sentence and
 * stops mid-thought. Snapping to sentence bounds keeps the evidence readable.
 */
export function sentenceRange(text: string, range: EvidenceRange): EvidenceRange {
  let start = range.start;
  while (start > 0 && !SENTENCE_END.test(text[start - 1])) start--;
  while (start < range.start && /\s/.test(text[start])) start++;

  let end = Math.min(range.end, text.length);
  // Prefer the terminator inside the range over running past it.
  const inner = text.slice(start, range.end);
  const lastStop = Math.max(inner.lastIndexOf('.'), inner.lastIndexOf('!'), inner.lastIndexOf('?'));
  if (lastStop > 0 && start + lastStop + 1 < range.end) {
    end = start + lastStop + 1;
  } else {
    while (end < text.length && !SENTENCE_END.test(text[end])) end++;
    if (end < text.length && text[end] !== '\n') end++;
  }
  return { start, end };
}
