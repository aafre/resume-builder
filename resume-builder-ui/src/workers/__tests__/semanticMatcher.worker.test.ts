import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { EnhancedScanResult, WorkerOutMessage } from '../../types/semanticMatcher';

// --- Mock @huggingface/transformers ---

// Fake embeddings: simple deterministic vectors for testing
// Each "embedding" is a 4-dim normalized vector derived from text hash
function fakeEmbedding(text: string): number[] {
  // Simple hash → 4-dim vector for deterministic tests
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  const raw = [
    Math.sin(h),
    Math.cos(h),
    Math.sin(h * 2),
    Math.cos(h * 2),
  ];
  // Normalize
  const norm = Math.sqrt(raw.reduce((s, v) => s + v * v, 0));
  return raw.map(v => v / norm);
}

// Make specific terms produce similar embeddings to test matching
const SIMILAR_PAIRS: Record<string, string> = {
  // These will share embeddings so cosine sim = 1.0
  'python': '__python_embed__',
  'react': '__react_embed__',
  'typescript': '__typescript_embed__',
};

function embedForText(text: string): number[] {
  const key = text.toLowerCase().trim();
  // If text contains a similar pair key, use that embedding
  for (const [term, embedKey] of Object.entries(SIMILAR_PAIRS)) {
    if (key === term || key.includes(term)) {
      return fakeEmbedding(embedKey);
    }
  }
  return fakeEmbedding(key);
}

const mockPipeline = vi.fn();

vi.mock('@huggingface/transformers', () => ({
  pipeline: mockPipeline,
  env: { allowLocalModels: false },
}));

// Capture postMessage calls
const postedMessages: WorkerOutMessage[] = [];

// We need to capture the onmessage handler from the worker
let workerHandler: ((e: MessageEvent) => Promise<void>) | null = null;

describe('semanticMatcher.worker', () => {
  beforeEach(async () => {
    postedMessages.length = 0;
    vi.clearAllMocks();

    // Mock self.postMessage
    vi.stubGlobal('postMessage', (msg: WorkerOutMessage) => {
      postedMessages.push(msg);
    });

    // Set up mock pipeline that returns fake embeddings
    const mockExtractor = vi.fn(async (texts: string[], _opts?: unknown) => ({
      tolist: () => texts.map(t => embedForText(t)),
    }));

    mockPipeline.mockResolvedValue(mockExtractor);

    // Dynamically import the worker (re-imports fresh each test)
    // The worker module sets self.onmessage on load
    vi.resetModules();
    await import('../semanticMatcher.worker');

    // Capture the handler that was set on self/globalThis
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Helper to send a message to the worker handler
  async function sendMessage(data: unknown) {
    if (!workerHandler) throw new Error('Worker handler not set');
    await workerHandler({ data } as MessageEvent);
  }

  function getMessages(type?: string): WorkerOutMessage[] {
    if (!type) return [...postedMessages];
    return postedMessages.filter(m => m.type === type);
  }

  // --- Init ---

  it('reports progress and ready on init', async () => {
    await sendMessage({ type: 'init' });

    const progressMsgs = getMessages('init:progress');
    const readyMsgs = getMessages('init:ready');

    expect(progressMsgs.length).toBeGreaterThanOrEqual(1);
    expect(readyMsgs).toHaveLength(1);
    expect(mockPipeline).toHaveBeenCalledWith(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      expect.objectContaining({ dtype: 'q8' })
    );
  });

  it('does not reload model on second init', async () => {
    await sendMessage({ type: 'init' });
    mockPipeline.mockClear();

    await sendMessage({ type: 'init' });
    expect(mockPipeline).not.toHaveBeenCalled();
  });

  // --- Match with empty JD ---

  it('returns empty result for empty job description', async () => {
    await sendMessage({ type: 'match', resumeText: 'Some resume', jobDescription: '' });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);

    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(0);
    expect(result.matchPercentage).toBe(0);
    expect(result.matched).toHaveLength(0);
    expect(result.partial).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
  });

  // --- Match produces structured result ---

  it('returns structured result with matched/partial/missing buckets', async () => {
    const jd = 'We need python python python. Experience with react react. Must know kubernetes kubernetes. Docker docker required.';
    const resume = 'Experienced python developer. Built applications with react and typescript. Deployed services using docker containers.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);

    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    // Verify structure
    expect(result).toHaveProperty('matchPercentage');
    expect(result).toHaveProperty('totalKeywords');
    expect(result).toHaveProperty('matchedCount');
    expect(result).toHaveProperty('partialCount');
    expect(result).toHaveProperty('missingCount');
    expect(result).toHaveProperty('matched');
    expect(result).toHaveProperty('partial');
    expect(result).toHaveProperty('missing');

    // All keyword results have required fields
    const allKeywords = [...result.matched, ...result.partial, ...result.missing];
    for (const kw of allKeywords) {
      expect(kw).toHaveProperty('keyword');
      expect(kw).toHaveProperty('found');
      expect(kw).toHaveProperty('similarity');
      expect(kw).toHaveProperty('matchType');
      expect(typeof kw.keyword).toBe('string');
      expect(typeof kw.similarity).toBe('number');
      expect(kw.similarity).toBeGreaterThanOrEqual(0);
      expect(kw.similarity).toBeLessThanOrEqual(1);
    }

    // Counts add up
    expect(result.matchedCount + result.partialCount + result.missingCount).toBe(result.totalKeywords);
    expect(result.matched).toHaveLength(result.matchedCount);
    expect(result.partial).toHaveLength(result.partialCount);
    expect(result.missing).toHaveLength(result.missingCount);
  });

  it('caps keywords at 40', async () => {
    // Generate JD with many distinct terms repeated 3x each
    const terms = Array.from({ length: 60 }, (_, i) => `techterm${i}`);
    const jd = terms.map(t => `${t} ${t} ${t}`).join('. ');

    await sendMessage({ type: 'match', resumeText: 'Empty resume', jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    expect(result.totalKeywords).toBeLessThanOrEqual(40);
  });

  // --- Keyword results have correct matchType classification ---

  it('classifies matched keywords as found=true', async () => {
    await sendMessage({
      type: 'match',
      resumeText: 'python react docker typescript node.js',
      jobDescription: 'python python python. react react react. docker docker docker.',
    });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const kw of result.matched) {
      expect(kw.found).toBe(true);
      expect(['exact', 'semantic']).toContain(kw.matchType);
      expect(kw.similarity).toBeGreaterThanOrEqual(0.65);
    }
  });

  it('classifies missing keywords with suggested placement', async () => {
    await sendMessage({
      type: 'match',
      resumeText: 'Experienced with HTML and CSS only.',
      jobDescription: 'terraform terraform terraform. kubernetes kubernetes kubernetes.',
    });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const kw of result.missing) {
      expect(kw.found).toBe(false);
      expect(kw.matchType).toBe('none');
      expect(kw.similarity).toBeLessThan(0.45);
      expect(kw.suggestedPlacement).toBeTruthy();
    }
  });

  // --- bestMatchContext ---

  it('includes bestMatchContext for keywords', async () => {
    const resume = 'Built microservices with Python and Flask. Deployed to AWS using Docker containers. Led a team of five engineers.';
    const jd = 'python python python. docker docker docker.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    const allKeywords = [...result.matched, ...result.partial, ...result.missing];
    for (const kw of allKeywords) {
      expect(kw.bestMatchContext).toBeDefined();
      expect(typeof kw.bestMatchContext).toBe('string');
      // Context should be a substring of the resume or a truncated version
      expect(kw.bestMatchContext!.length).toBeGreaterThan(0);
      expect(kw.bestMatchContext!.length).toBeLessThanOrEqual(150);
    }
  });

  // --- Error handling ---

  it('posts error if model loading fails', async () => {
    vi.resetModules();
    mockPipeline.mockRejectedValueOnce(new Error('Network timeout'));

    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;

    postedMessages.length = 0;
    await sendMessage({ type: 'init' });

    const errors = getMessages('error');
    expect(errors).toHaveLength(1);
    expect((errors[0] as { type: 'error'; error: string }).error).toBe('Network timeout');
  });

  it('allows retry after model loading failure', async () => {
    vi.resetModules();

    // First call fails
    mockPipeline.mockRejectedValueOnce(new Error('Network error'));
    // Second call succeeds
    const mockExtractor = vi.fn(async (texts: string[]) => ({
      tolist: () => texts.map(t => embedForText(t)),
    }));
    mockPipeline.mockResolvedValueOnce(mockExtractor);

    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;

    postedMessages.length = 0;

    // First attempt fails
    await sendMessage({ type: 'init' });
    expect(getMessages('error')).toHaveLength(1);

    postedMessages.length = 0;

    // Retry succeeds
    await sendMessage({ type: 'init' });
    expect(getMessages('init:ready')).toHaveLength(1);
    expect(getMessages('error')).toHaveLength(0);
  });

  // --- Special tech terms extraction ---

  it('extracts special tech terms like C++, C#, .NET', async () => {
    const jd = 'Must know C++ and C#. Experience with .NET framework. C++ skills required. C# development. .NET core.';
    const resume = 'Expert in C++ and C# development. Built applications using .NET framework.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    const allKeywords = [...result.matched, ...result.partial, ...result.missing].map(k => k.keyword);
    // At least some tech terms should be extracted
    expect(result.totalKeywords).toBeGreaterThan(0);
    // Check that special chars are preserved
    const hasSpecialTerms = allKeywords.some(k => k.includes('+') || k.includes('#') || k.includes('.'));
    expect(hasSpecialTerms).toBe(true);
  });

  it('extracts slash-compound terms like CI/CD', async () => {
    const jd = 'CI/CD pipeline experience. Must know CI/CD. UI/UX design skills.';
    const resume = 'Implemented CI/CD pipelines.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    const allKeywords = [...result.matched, ...result.partial, ...result.missing].map(k => k.keyword);
    const hasSlashTerms = allKeywords.some(k => k.includes('/'));
    expect(hasSlashTerms).toBe(true);
  });

  // --- Filler/stop word filtering ---

  it('filters out generic filler words', async () => {
    const jd = 'Experience required. Strong candidate preferred. Excellent communication skills. Looking for someone with ability.';
    const resume = 'Experienced developer.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    const allKeywords = [...result.matched, ...result.partial, ...result.missing].map(k => k.keyword);
    const fillerWords = ['experience', 'required', 'preferred', 'candidate', 'skills', 'looking', 'someone', 'ability'];
    for (const filler of fillerWords) {
      expect(allKeywords).not.toContain(filler);
    }
  });

  // --- Match percentage calculation ---

  it('calculates match percentage correctly', async () => {
    await sendMessage({
      type: 'match',
      resumeText: 'python developer with react experience',
      jobDescription: 'python python python. react react react. golang golang golang.',
    });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    if (result.totalKeywords > 0) {
      const expectedPct = Math.round((result.matchedCount / result.totalKeywords) * 100);
      expect(result.matchPercentage).toBe(expectedPct);
    }
  });

  // --- Sorted results ---

  it('sorts matched keywords by similarity descending', async () => {
    const jd = 'python python python. react react react. docker docker docker. kubernetes kubernetes kubernetes.';
    const resume = 'Built python apps with react. Used docker for deployment. Some kubernetes experience.';

    await sendMessage({ type: 'match', resumeText: resume, jobDescription: jd });

    const results = getMessages('match:result');
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    // Each bucket should be sorted by similarity descending
    for (const bucket of [result.matched, result.partial, result.missing]) {
      for (let i = 1; i < bucket.length; i++) {
        expect(bucket[i].similarity).toBeLessThanOrEqual(bucket[i - 1].similarity);
      }
    }
  });

  // --- Auto-loads model on match if not initialized ---

  it('auto-loads model when match is sent without prior init', async () => {
    vi.resetModules();
    const mockExtractor = vi.fn(async (texts: string[]) => ({
      tolist: () => texts.map(t => embedForText(t)),
    }));
    mockPipeline.mockResolvedValue(mockExtractor);

    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
    postedMessages.length = 0;

    // Send match directly (no init first)
    await sendMessage({
      type: 'match',
      resumeText: 'python developer',
      jobDescription: 'python python python',
    });

    // Model should have been loaded
    expect(mockPipeline).toHaveBeenCalled();
    // Should have both progress/ready AND result messages
    expect(getMessages('match:result')).toHaveLength(1);
  });
});
