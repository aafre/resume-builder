/**
 * Web Worker for semantic keyword matching using Transformers.js.
 *
 * Loads the MiniLM-L6-v2 sentence-transformer model (q8, ~23 MB ONNX)
 * and performs all embedding + similarity computation off the main thread.
 */

import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';
import type {
  WorkerInMessage,
  WorkerOutMessage,
  EnhancedKeywordResult,
  EnhancedScanResult,
} from '../types/semanticMatcher';
import {
  STOP_WORDS,
  JOB_FILLER,
  extractRequirementsSection,
  getSuggestedPlacement,
  prepareLexicalResume,
  countKeywordOccurrencesLexical,
} from '../utils/keywordMatcher';

// Use remote models from HuggingFace Hub, allow local caching via Cache API
env.allowLocalModels = false;

// Recalibrated thresholds (Phase 1 fix): the embedding pass alone is only the
// tie-breaker for keywords the lexical pass (below) can't already confirm —
// see runMatch(). 0.65 was calibrated too high; real semantic matches cluster
// at 0.65-0.77, so genuine hits were routinely scored as "partial" (worth 0).
const MATCHED_THRESHOLD = 0.55;
const PARTIAL_THRESHOLD = 0.45;
// Cosine value above which a matched keyword is labeled 'exact' vs 'semantic'
// (embedding path only — lexical hits are always 'exact', see runMatch()).
const EXACT_COSINE_THRESHOLD = 0.85;

let extractor: FeatureExtractionPipeline | null = null;
let modelLoadPromise: Promise<void> | null = null;

// --- Utility helpers ---

function post(msg: WorkerOutMessage) {
  self.postMessage(msg);
}

/** Cosine similarity between two normalized vectors (dot product) */
function cosineSim(a: Float32Array | number[], b: Float32Array | number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

// --- Model loading (deduplicated) ---

async function ensureModel(): Promise<void> {
  if (extractor) return;
  if (modelLoadPromise) {
    await modelLoadPromise;
    return;
  }

  modelLoadPromise = (async () => {
    // Phase 3: explicit "one-time, ~23 MB" copy so a slow first load reads as
    // expected progress, not a hang (subsequent visits hit the Cache API and
    // this state is skipped almost instantly).
    const DOWNLOAD_STATUS = 'Downloading AI model (one-time, ~23 MB)…';
    post({ type: 'init:progress', progress: 0, status: DOWNLOAD_STATUS });

    // @ts-expect-error — pipeline() overload union too complex for TS
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: (data: { status: string; progress?: number }) => {
        if (data.status === 'progress' && data.progress != null) {
          post({ type: 'init:progress', progress: Math.round(data.progress), status: DOWNLOAD_STATUS });
        }
      },
    }) as FeatureExtractionPipeline;

    post({ type: 'init:ready' });
  })();

  await modelLoadPromise;
}

// --- Batch embedding ---

async function embed(texts: string[]): Promise<number[][]> {
  if (!extractor) throw new Error('Model not loaded');
  const output = await extractor(texts, { pooling: 'mean', normalize: true });
  // output.tolist() returns number[][] (one embedding per input text)
  return output.tolist() as number[][];
}

// --- Candidate phrase extraction from JD ---

/** Extract candidate keyword phrases from job description text */
function extractCandidates(text: string): Map<string, number> {
  // Phase 2: focus on the requirements/qualifications section when the JD has
  // one — skips company-blurb and benefits noise (reuses keywordMatcher.ts).
  const focused = extractRequirementsSection(text);
  const lower = focused.toLowerCase();
  const candidates = new Map<string, number>();

  // 1) Special tech terms (C++, C#, .NET, etc.) — extract before normalizing
  const techPattern = /(?<=^|\W)(c\+\+|c#|\.net|f#|node\.js|next\.js|vue\.js|react\.js|asp\.net|vb\.net|three\.js)(?=\W|$)/gi;
  for (const m of lower.matchAll(techPattern)) {
    const term = m[0];
    candidates.set(term, (candidates.get(term) || 0) + 1);
  }

  // 2) Slash-compound terms (CI/CD, UI/UX, etc.)
  const slashPattern = /\b([a-z]+\/[a-z]+)\b/gi;
  for (const m of lower.matchAll(slashPattern)) {
    const term = m[1];
    candidates.set(term, (candidates.get(term) || 0) + 1);
  }

  // 3) Split into sentences, then extract n-grams.
  // Phase 2: comma/parens now count as clause boundaries too, so
  // "administer medications, monitor vital signs" no longer yields the
  // cross-clause bigram "medications monitor".
  const sentences = lower.split(/[.!?;:,()\n]+/).filter(s => s.trim().length > 5);
  // Phase 2: reuse keywordMatcher's larger, battle-tested stop/filler lists
  // instead of maintaining a second, smaller copy here.

  for (const sentence of sentences) {
    const words = sentence
      .replace(/[^a-z0-9\s/+#.'-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);

    // Unigrams
    for (const word of words) {
      const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (clean.length <= 2 || STOP_WORDS.has(clean) || JOB_FILLER.has(clean)) continue;
      candidates.set(clean, (candidates.get(clean) || 0) + 1);
    }

    // Bigrams — both words must not be filler
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length < 2 || b.length < 2) continue;
      if (STOP_WORDS.has(a) || STOP_WORDS.has(b)) continue;
      if (JOB_FILLER.has(a) || JOB_FILLER.has(b)) continue;
      const bigram = `${a} ${b}`;
      candidates.set(bigram, (candidates.get(bigram) || 0) + 1);
    }

    // Trigrams — first and last words must not be stop/filler. The middle
    // word must not be a bare connector (STOP_WORDS) either — the bigram
    // loop above already rejects "with"/"or"/"and" etc. in either position,
    // but this loop only checked the ends, letting glue-word junk like
    // "jenkins or github" and "hands-on with aws" survive as a trigram.
    for (let i = 0; i < words.length - 2; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const c = words[i + 2].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length < 2 || b.length < 2 || c.length < 2) continue;
      if (STOP_WORDS.has(a) || STOP_WORDS.has(c)) continue;
      if (JOB_FILLER.has(a) || JOB_FILLER.has(c)) continue;
      if (STOP_WORDS.has(b)) continue;
      const trigram = `${a} ${b} ${c}`;
      candidates.set(trigram, (candidates.get(trigram) || 0) + 1);
    }
  }

  return candidates;
}

// --- Semantic deduplication ---

/** Cluster embeddings by cosine similarity and return representative indices */
function clusterEmbeddings(
  embeddings: number[][],
  _labels: string[],
  freqs: number[],
  threshold: number
): number[] {
  const n = embeddings.length;
  const assigned = new Array<number>(n).fill(-1);
  const representatives: number[] = [];
  let clusterId = 0;

  // Sort by frequency descending — highest-freq candidates become cluster reps
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => freqs[b] - freqs[a]);

  for (const idx of order) {
    if (assigned[idx] >= 0) continue;
    assigned[idx] = clusterId;
    representatives.push(idx);

    // Absorb similar candidates into this cluster
    for (const other of order) {
      if (assigned[other] >= 0) continue;
      const sim = cosineSim(embeddings[idx], embeddings[other]);
      if (sim >= threshold) {
        assigned[other] = clusterId;
      }
    }
    clusterId++;
  }

  return representatives;
}

// --- Generic-term filtering (cached) ---

const GENERIC_PHRASES = [
  'experience required preferred ability',
  'strong communication skills teamwork',
  'responsible for managing overseeing',
];

let cachedGenericEmbeddings: number[][] | null = null;

async function filterGenericTerms(
  embeddings: number[][]
): Promise<boolean[]> {
  if (!cachedGenericEmbeddings) {
    cachedGenericEmbeddings = await embed(GENERIC_PHRASES);
  }
  return embeddings.map((emb) => {
    for (const ge of cachedGenericEmbeddings!) {
      if (cosineSim(emb, ge) > 0.72) return true;
    }
    return false;
  });
}

// --- Resume chunking ---

function chunkResume(text: string): string[] {
  // Split into sentences, then create overlapping windows
  const sentences = text
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 10);

  if (sentences.length === 0) return [text];

  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    // Single sentence
    chunks.push(sentences[i].trim());
    // Two-sentence window
    if (i < sentences.length - 1) {
      const window = `${sentences[i].trim()} ${sentences[i + 1].trim()}`;
      if (window.length <= 300) {
        chunks.push(window);
      }
    }
  }
  return chunks;
}

// --- Lexical n-gram dedup (Phase 2) ---

/**
 * Drop shorter multi-word candidates that are a substring of a longer
 * surviving candidate (e.g. "aws cloud" and "cloud infrastructure" both
 * swallowed by "aws cloud infrastructure"). The 0.85 embedding cluster
 * (clusterEmbeddings above) misses these because adding/removing a word
 * can shift cosine similarity below the cluster threshold even though the
 * phrases describe the same concept. Single words are left untouched here
 * — they're already handled by the subsumption step above.
 */
function dedupSubstringOverlaps<T extends { label: string }>(items: T[]): T[] {
  const multiWord = [...items]
    .filter(i => i.label.includes(' '))
    .sort((a, b) => b.label.length - a.label.length); // longest first

  const dropped = new Set<string>();
  for (let i = 0; i < multiWord.length; i++) {
    const shorter = multiWord[i];
    if (dropped.has(shorter.label)) continue;
    const shorterWords = shorter.label.split(' ');
    for (let j = 0; j < i; j++) {
      const longer = multiWord[j];
      if (dropped.has(longer.label)) continue;
      // Contiguous WORD-level subphrase, not raw substring: "platform
      // engineering" must not swallow the unrelated "form engineering".
      const longerWords = longer.label.split(' ');
      let isSubphrase = false;
      for (let k = 0; k <= longerWords.length - shorterWords.length; k++) {
        if (shorterWords.every((w, idx) => longerWords[k + idx] === w)) {
          isSubphrase = true;
          break;
        }
      }
      if (isSubphrase) {
        dropped.add(shorter.label);
        break;
      }
    }
  }

  return items.filter(i => !dropped.has(i.label));
}

// --- Main matching pipeline ---
// (getSuggestedPlacement is imported from keywordMatcher.ts — no more duplicate copy)

async function runMatch(resumeText: string, jobDescription: string): Promise<EnhancedScanResult> {
  // 1. Extract candidate phrases from JD
  const candidateMap = extractCandidates(jobDescription);
  let allCandidates = [...candidateMap.entries()]
    .sort((a, b) => b[1] - a[1]);

  // OPTIMIZATION: Limit to top 150 candidates to prevent performance bottleneck on large JDs
  // Embedding hundreds of phrases is expensive. The top 150 most frequent terms
  // provide sufficient coverage for the top 40 distinct semantic keywords we eventually select.
  if (allCandidates.length > 150) {
    allCandidates = allCandidates.slice(0, 150);
  }

  const candidateLabels = allCandidates.map(([label]) => label);
  const candidateFreqs = allCandidates.map(([, freq]) => freq);

  if (candidateLabels.length === 0) {
    return { matchPercentage: 0, totalKeywords: 0, matchedCount: 0, partialCount: 0, missingCount: 0, matched: [], partial: [], missing: [] };
  }

  // 2. Batch-embed all candidates
  const candidateEmbeddings = await embed(candidateLabels);

  // 3. Filter generic terms
  const isGeneric = await filterGenericTerms(candidateEmbeddings);

  // 4. Semantic deduplication — cluster candidates with similarity > 0.85
  const nonGenericIndices = candidateLabels
    .map((_, i) => i)
    .filter(i => !isGeneric[i]);

  const filteredLabels = nonGenericIndices.map(i => candidateLabels[i]);
  const filteredEmbeddings = nonGenericIndices.map(i => candidateEmbeddings[i]);
  const filteredFreqs = nonGenericIndices.map(i => candidateFreqs[i]);

  const repIndices = clusterEmbeddings(filteredEmbeddings, filteredLabels, filteredFreqs, 0.85);

  // Keep top 40 keywords by frequency, then subsume single words covered by multi-word phrases
  let keywords = repIndices.map(i => ({
    label: filteredLabels[i],
    embedding: filteredEmbeddings[i],
    freq: filteredFreqs[i],
  }));
  keywords.sort((a, b) => b.freq - a.freq);

  // Subsume single words that are part of a higher-frequency multi-word keyword
  const multiWord = keywords.filter(k => k.label.includes(' '));
  keywords = keywords.filter(k => {
    if (k.label.includes(' ')) return true;
    return !multiWord.some(mw => mw.freq >= k.freq && mw.label.includes(k.label));
  });

  // Phase 2: lexical substring dedup for overlapping multi-word n-grams
  // that the 0.85 embedding cluster didn't catch (see dedupSubstringOverlaps).
  keywords = dedupSubstringOverlaps(keywords);

  keywords = keywords.slice(0, 40);

  if (keywords.length === 0) {
    return { matchPercentage: 0, totalKeywords: 0, matchedCount: 0, partialCount: 0, missingCount: 0, matched: [], partial: [], missing: [] };
  }

  // 5. Chunk resume and batch-embed
  const chunks = chunkResume(resumeText);
  const chunkEmbeddings = await embed(chunks);

  // Phase 1: prepare resume once for the lexical exact/synonym/stem pass —
  // reuses the same cascade keywordMatcher.ts's scanResume() already uses.
  const lexicalResume = prepareLexicalResume(resumeText);

  // 6. For each keyword: lexical pass FIRST. A keyword present in the resume
  // (verbatim, synonym-normalized, or stemmed) is force-promoted to "matched"
  // regardless of embedding cosine — a short JD phrase vs. a long resume
  // sentence dilutes cosine even for a literal match (the root cause of the
  // "verbatim skill shown as missing" bug). Only keywords the lexical pass
  // can't confirm fall through to the embedding-cosine classification.
  const matched: EnhancedKeywordResult[] = [];
  const partial: EnhancedKeywordResult[] = [];
  const missing: EnhancedKeywordResult[] = [];

  for (const kw of keywords) {
    let maxSim = 0;
    let bestChunkIdx = 0;

    for (let j = 0; j < chunkEmbeddings.length; j++) {
      const sim = cosineSim(kw.embedding, chunkEmbeddings[j]);
      if (sim > maxSim) {
        maxSim = sim;
        bestChunkIdx = j;
      }
    }

    // Prefer a chunk that literally contains the phrase for display context;
    // fall back to the highest-cosine chunk.
    const literalChunkIdx = chunks.findIndex(c => c.toLowerCase().includes(kw.label.toLowerCase()));
    const bestMatchContext = chunks[literalChunkIdx >= 0 ? literalChunkIdx : bestChunkIdx]?.slice(0, 150);

    const lexicalCount = countKeywordOccurrencesLexical(kw.label, lexicalResume);
    if (lexicalCount > 0) {
      // ponytail: floor the displayed similarity at the matched threshold so a
      // diluted cosine never shows a confusing low % next to a "matched" badge.
      // Upgrade path: surface lexical vs. semantic confidence as separate fields
      // if the UI ever needs to distinguish them.
      matched.push({
        keyword: kw.label,
        found: true,
        similarity: Math.round(Math.max(maxSim, MATCHED_THRESHOLD) * 100) / 100,
        matchType: 'exact',
        bestMatchContext,
      });
      continue;
    }

    const result: EnhancedKeywordResult = {
      keyword: kw.label,
      found: maxSim >= MATCHED_THRESHOLD,
      similarity: Math.round(maxSim * 100) / 100,
      matchType: maxSim >= MATCHED_THRESHOLD
        ? (maxSim >= EXACT_COSINE_THRESHOLD ? 'exact' : 'semantic')
        : (maxSim >= PARTIAL_THRESHOLD ? 'partial' : 'none'),
      bestMatchContext,
    };

    if (maxSim >= MATCHED_THRESHOLD) {
      matched.push(result);
    } else if (maxSim >= PARTIAL_THRESHOLD) {
      partial.push(result);
    } else {
      result.suggestedPlacement = getSuggestedPlacement(kw.label);
      missing.push(result);
    }
  }

  // Sort each bucket
  matched.sort((a, b) => b.similarity - a.similarity);
  partial.sort((a, b) => b.similarity - a.similarity);
  missing.sort((a, b) => b.similarity - a.similarity);

  // Phase 1: partial matches count for half credit — a resume that's 80%
  // covered by verbatim/semantic matches plus a few partials should not be
  // scored the same as one with only 20% direct matches.
  const total = keywords.length;
  const matchPercentage = total > 0
    ? Math.round(((matched.length + 0.5 * partial.length) / total) * 100)
    : 0;

  return {
    matchPercentage,
    totalKeywords: total,
    matchedCount: matched.length,
    partialCount: partial.length,
    missingCount: missing.length,
    matched,
    partial,
    missing,
  };
}

// --- Message handler ---

self.onmessage = async (e: MessageEvent<WorkerInMessage>) => {
  const msg = e.data;

  try {
    switch (msg.type) {
      case 'init':
        await ensureModel();
        break;

      case 'match':
        await ensureModel();
        const result = await runMatch(msg.resumeText, msg.jobDescription);
        post({ type: 'match:result', result });
        break;
    }
  } catch (err) {
    // Reset loading state so retry is possible
    modelLoadPromise = null;
    post({ type: 'error', error: err instanceof Error ? err.message : String(err) });
  }
};
