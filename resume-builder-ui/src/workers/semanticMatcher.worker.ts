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

// Use remote models from HuggingFace Hub, allow local caching via Cache API
env.allowLocalModels = false;

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
    post({ type: 'init:progress', progress: 0, status: 'Downloading AI model...' });

    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: (data: { status: string; progress?: number }) => {
        if (data.status === 'progress' && data.progress != null) {
          post({ type: 'init:progress', progress: Math.round(data.progress), status: 'Downloading AI model...' });
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
  const lower = text.toLowerCase();
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

  // 3) Split into sentences, then extract n-grams
  const sentences = lower.split(/[.!?;:\n]+/).filter(s => s.trim().length > 5);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
    'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its',
    'we', 'our', 'you', 'your', 'they', 'their', 'he', 'she', 'him', 'her',
    'not', 'no', 'nor', 'as', 'if', 'then', 'than', 'too', 'very', 'just',
    'about', 'all', 'also', 'am', 'any', 'because', 'both', 'each',
    'more', 'most', 'other', 'so', 'some', 'such', 'up', 'what', 'when',
    'where', 'while', 'how', 'out', 'into', 'my', 'me', 'i',
  ]);

  const fillerWords = new Set([
    'experience', 'required', 'preferred', 'ability', 'skills', 'including',
    'work', 'working', 'position', 'role', 'company', 'team', 'opportunity',
    'responsibilities', 'requirements', 'qualifications', 'candidate',
    'apply', 'job', 'description', 'employment', 'equal', 'employer',
    'benefits', 'salary', 'competitive', 'minimum', 'years', 'degree',
    'bachelor', 'master', 'education', 'looking', 'seeking', 'ideal',
    'someone', 'strong', 'excellent', 'good', 'great', 'solid',
    'knowledge', 'understanding', 'familiarity', 'plus', 'bonus',
    'demonstrated', 'proven', 'ensuring', 'responsible', 'proficient',
    'relevant', 'related',
  ]);

  for (const sentence of sentences) {
    const words = sentence
      .replace(/[^a-z0-9\s/+#.'-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);

    // Unigrams
    for (const word of words) {
      const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (clean.length <= 2 || stopWords.has(clean) || fillerWords.has(clean)) continue;
      candidates.set(clean, (candidates.get(clean) || 0) + 1);
    }

    // Bigrams — both words must not be filler
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length < 2 || b.length < 2) continue;
      if (stopWords.has(a) || stopWords.has(b)) continue;
      if (fillerWords.has(a) || fillerWords.has(b)) continue;
      const bigram = `${a} ${b}`;
      candidates.set(bigram, (candidates.get(bigram) || 0) + 1);
    }

    // Trigrams — first and last words must not be stop/filler
    for (let i = 0; i < words.length - 2; i++) {
      const a = words[i].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const b = words[i + 1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const c = words[i + 2].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (a.length < 2 || b.length < 2 || c.length < 2) continue;
      if (stopWords.has(a) || stopWords.has(c)) continue;
      if (fillerWords.has(a) || fillerWords.has(c)) continue;
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
  labels: string[],
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

// --- Placement suggestion (copied from keywordMatcher.ts) ---

const PLACEMENT_RULES: Array<{ pattern: RegExp; placement: string }> = [
  { pattern: /\b(python|java|javascript|typescript|c\+\+|ruby|go|rust|php|swift|kotlin|scala|r|matlab|sql|html|css|sass|less)\b/i, placement: 'Skills section — Technical Skills' },
  { pattern: /\b(react|angular|vue|node|express|django|flask|spring|rails|next\.?js|nuxt|svelte|laravel|asp\.net)\b/i, placement: 'Skills section — Frameworks' },
  { pattern: /\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd|git|linux|nginx|apache)\b/i, placement: 'Skills section — Tools & Infrastructure' },
  { pattern: /\b(excel|powerpoint|word|salesforce|hubspot|jira|confluence|slack|figma|sketch|photoshop|tableau|power\s?bi)\b/i, placement: 'Skills section — Software' },
  { pattern: /(certified|certification|license|cpa|pmp|scrum|cissp|aws\s+certified)/i, placement: 'Certifications section' },
  { pattern: /(agile|scrum|kanban|waterfall|lean|six\s+sigma|sdlc)/i, placement: 'Skills section — Methodologies' },
];

function getSuggestedPlacement(keyword: string): string {
  for (const rule of PLACEMENT_RULES) {
    if (rule.pattern.test(keyword)) {
      return rule.placement;
    }
  }
  return 'Skills section or Experience bullet points';
}

// --- Main matching pipeline ---

async function runMatch(resumeText: string, jobDescription: string): Promise<EnhancedScanResult> {
  // 1. Extract candidate phrases from JD
  const candidateMap = extractCandidates(jobDescription);
  const allCandidates = [...candidateMap.entries()]
    .sort((a, b) => b[1] - a[1]);
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

  keywords = keywords.slice(0, 40);

  if (keywords.length === 0) {
    return { matchPercentage: 0, totalKeywords: 0, matchedCount: 0, partialCount: 0, missingCount: 0, matched: [], partial: [], missing: [] };
  }

  // 5. Chunk resume and batch-embed
  const chunks = chunkResume(resumeText);
  const chunkEmbeddings = await embed(chunks);

  // 6. For each keyword, find max similarity across chunks
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

    const result: EnhancedKeywordResult = {
      keyword: kw.label,
      found: maxSim >= 0.65,
      similarity: Math.round(maxSim * 100) / 100,
      matchType: maxSim >= 0.65
        ? (maxSim >= 0.85 ? 'exact' : 'semantic')
        : (maxSim >= 0.45 ? 'partial' : 'none'),
      bestMatchContext: chunks[bestChunkIdx]?.slice(0, 150),
    };

    if (maxSim >= 0.65) {
      matched.push(result);
    } else if (maxSim >= 0.45) {
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

  const total = keywords.length;
  const matchPercentage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

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
