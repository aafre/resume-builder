/**
 * Web Worker for AI-powered keyword matching using Transformers.js.
 *
 * Uses a generative LLM (Qwen2.5-0.5B-Instruct) to extract keywords from
 * a job description, match them against a resume, and return structured results.
 * Runs entirely in-browser via WebGPU (with WASM fallback).
 */

import { pipeline, env, type TextGenerationPipeline } from '@huggingface/transformers';
import type {
  WorkerInMessage,
  WorkerOutMessage,
  EnhancedKeywordResult,
  EnhancedScanResult,
} from '../types/semanticMatcher';

env.allowLocalModels = false;

let generator: TextGenerationPipeline | null = null;
let modelLoadPromise: Promise<void> | null = null;

function post(msg: WorkerOutMessage) {
  self.postMessage(msg);
}

// --- WebGPU detection ---

async function detectDevice(): Promise<'webgpu' | 'wasm'> {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const adapter = await (navigator as unknown as { gpu: { requestAdapter(): Promise<unknown | null> } }).gpu.requestAdapter();
      if (adapter) return 'webgpu';
    } catch { /* fall through */ }
  }
  return 'wasm';
}

// --- Model loading (deduplicated) ---

async function ensureModel(): Promise<void> {
  if (generator) return;
  if (modelLoadPromise) {
    await modelLoadPromise;
    return;
  }

  modelLoadPromise = (async () => {
    post({ type: 'init:progress', progress: 0, status: 'Detecting GPU...' });
    const device = await detectDevice();
    const accel = device === 'webgpu' ? 'GPU-accelerated' : 'CPU';

    post({ type: 'init:progress', progress: 2, status: `Downloading AI model (${accel})...` });

    generator = (await pipeline(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      {
        dtype: device === 'webgpu' ? 'q4f16' : 'q4',
        device,
        progress_callback: (data: { status: string; progress?: number }) => {
          if (data.status === 'progress' && data.progress != null) {
            post({
              type: 'init:progress',
              progress: 2 + Math.round(data.progress * 0.93),
              status: `Downloading AI model (${accel})...`,
            });
          }
        },
      }
    )) as TextGenerationPipeline;

    post({ type: 'init:ready' });
  })();

  await modelLoadPromise;
}

// --- Prompt ---

const SYSTEM_PROMPT = `You are a resume keyword analyzer. Extract the most important technical skills, tools, qualifications, and domain terms from the job description. Then check if each keyword appears in the resume.

Return ONLY a valid JSON array. No markdown, no explanation, no text before or after. Each element:
{"keyword":"term","match":"exact","score":0.95,"context":"resume excerpt","placement":""}

match values:
- "exact": keyword found verbatim in resume
- "semantic": synonym or equivalent concept found in resume
- "partial": loosely related content exists in resume
- "none": keyword not found in resume

Rules:
- score: confidence 0.0 to 1.0
- context: most relevant resume sentence (max 120 chars), empty string if none found
- placement: where to add missing keywords (e.g. "Skills section"), empty string if matched
- Return 15-30 keywords, most important first
- Focus on technical skills, tools, frameworks, methodologies, certifications
- Skip generic words like "team", "communication", "experience", "strong"`;

// --- JSON extraction with fallback ---

function extractJSON(text: string): unknown[] | null {
  // 1. Direct parse
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* continue */ }

  // 2. Extract from markdown code block
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try {
      const parsed = JSON.parse(codeBlock[1].trim());
      if (Array.isArray(parsed)) return parsed;
    } catch { /* continue */ }
  }

  // 3. Find first JSON array in text
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* continue */ }
  }

  return null;
}

// --- Map raw LLM output to typed result ---

function mapToResult(rawKeywords: unknown[]): EnhancedScanResult {
  const matched: EnhancedKeywordResult[] = [];
  const partial: EnhancedKeywordResult[] = [];
  const missing: EnhancedKeywordResult[] = [];

  for (const raw of rawKeywords) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;

    const keyword = String(r.keyword || '').trim();
    if (!keyword) continue;

    // Accept both "match" and "matchType" field names
    const matchStr = String(r.match || r.matchType || 'none').toLowerCase();
    // Accept both "score" and "similarity" field names
    const score = typeof r.score === 'number' ? Math.max(0, Math.min(1, r.score))
      : typeof r.similarity === 'number' ? Math.max(0, Math.min(1, r.similarity))
      : 0;
    const context = String(r.context || r.bestMatchContext || '').slice(0, 150);
    const placement = String(r.placement || r.suggestedPlacement || '');

    // Normalize matchType — fall back to score-based classification if invalid
    const matchType = (['exact', 'semantic', 'partial', 'none'] as const).includes(
      matchStr as 'exact' | 'semantic' | 'partial' | 'none'
    )
      ? (matchStr as EnhancedKeywordResult['matchType'])
      : score >= 0.65 ? 'semantic' : score >= 0.45 ? 'partial' : 'none';

    const found = matchType === 'exact' || matchType === 'semantic';

    const result: EnhancedKeywordResult = {
      keyword,
      found,
      similarity: Math.round(score * 100) / 100,
      matchType,
      bestMatchContext: context || undefined,
      suggestedPlacement: !found && placement ? placement : undefined,
    };

    if (found) {
      matched.push(result);
    } else if (matchType === 'partial') {
      partial.push(result);
    } else {
      missing.push(result);
    }
  }

  // Sort each bucket by similarity descending
  matched.sort((a, b) => b.similarity - a.similarity);
  partial.sort((a, b) => b.similarity - a.similarity);
  missing.sort((a, b) => b.similarity - a.similarity);

  const total = matched.length + partial.length + missing.length;
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

// --- Main matching pipeline ---

async function runMatch(resumeText: string, jobDescription: string): Promise<EnhancedScanResult> {
  if (!generator) throw new Error('Model not loaded');

  if (!jobDescription.trim()) {
    return { matchPercentage: 0, totalKeywords: 0, matchedCount: 0, partialCount: 0, missingCount: 0, matched: [], partial: [], missing: [] };
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `JOB DESCRIPTION:\n${jobDescription.slice(0, 3000)}\n\nRESUME:\n${resumeText.slice(0, 3000)}`,
    },
  ];

  const output = await generator(messages, {
    max_new_tokens: 2048,
    do_sample: false,
  });

  // Extract assistant's response from chat output
  let generatedText = '';
  if (output?.[0]) {
    const gen = (output[0] as Record<string, unknown>).generated_text;
    if (typeof gen === 'string') {
      generatedText = gen;
    } else if (Array.isArray(gen)) {
      // Chat format: array of messages, last is assistant
      const last = gen[gen.length - 1] as Record<string, unknown> | undefined;
      generatedText = String(last?.content || '');
    }
  }

  if (!generatedText.trim()) {
    throw new Error('Model returned empty response');
  }

  const keywords = extractJSON(generatedText);
  if (!keywords || keywords.length === 0) {
    throw new Error('Could not parse keywords from model response');
  }

  return mapToResult(keywords);
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
    // Only reset model promise if model itself failed to load
    if (!generator) {
      modelLoadPromise = null;
    }
    post({ type: 'error', error: err instanceof Error ? err.message : String(err) });
  }
};
