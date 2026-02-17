import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { EnhancedScanResult, WorkerOutMessage } from '../../types/semanticMatcher';

// --- Mock @huggingface/transformers ---

const mockGenerator = vi.fn();
const mockPipeline = vi.fn();

vi.mock('@huggingface/transformers', () => ({
  pipeline: mockPipeline,
  env: { allowLocalModels: false },
}));

// Capture postMessage calls
const postedMessages: WorkerOutMessage[] = [];

// Worker handler reference
let workerHandler: ((e: MessageEvent) => Promise<void>) | null = null;

// Default mock response: valid JSON keyword analysis
function mockGeneratorResponse(keywords: unknown[]) {
  return [{
    generated_text: [
      { role: 'system', content: '...' },
      { role: 'user', content: '...' },
      { role: 'assistant', content: JSON.stringify(keywords) },
    ],
  }];
}

const SAMPLE_KEYWORDS = [
  { keyword: 'python', match: 'exact', score: 0.95, context: 'Senior Python developer with 5 years experience', placement: '' },
  { keyword: 'react', match: 'semantic', score: 0.78, context: 'Built frontend applications using React and TypeScript', placement: '' },
  { keyword: 'kubernetes', match: 'partial', score: 0.52, context: 'Deployed services using Docker containers', placement: '' },
  { keyword: 'terraform', match: 'none', score: 0.15, context: '', placement: 'Skills section — Tools & Infrastructure' },
];

describe('semanticMatcher.worker (generative LLM)', () => {
  beforeEach(async () => {
    postedMessages.length = 0;
    vi.clearAllMocks();

    // Mock self.postMessage
    vi.stubGlobal('postMessage', (msg: WorkerOutMessage) => {
      postedMessages.push(msg);
    });

    // Mock navigator.gpu for WebGPU detection
    vi.stubGlobal('navigator', { gpu: { requestAdapter: () => Promise.resolve(null) } });

    // Set up mock pipeline → mock generator
    mockGenerator.mockResolvedValue(mockGeneratorResponse(SAMPLE_KEYWORDS));
    mockPipeline.mockResolvedValue(mockGenerator);

    // Fresh import each test
    vi.resetModules();
    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function sendMessage(data: unknown) {
    if (!workerHandler) throw new Error('Worker handler not set');
    await workerHandler({ data } as MessageEvent);
  }

  function getMessages(type?: string): WorkerOutMessage[] {
    if (!type) return [...postedMessages];
    return postedMessages.filter(m => m.type === type);
  }

  // --- Init ---

  it('loads text-generation pipeline on init', async () => {
    await sendMessage({ type: 'init' });

    expect(mockPipeline).toHaveBeenCalledWith(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      expect.objectContaining({ device: 'wasm' }),
    );

    const readyMsgs = getMessages('init:ready');
    expect(readyMsgs).toHaveLength(1);
  });

  it('reports progress during model download', async () => {
    await sendMessage({ type: 'init' });

    const progressMsgs = getMessages('init:progress');
    expect(progressMsgs.length).toBeGreaterThanOrEqual(1);

    // First message should be GPU detection
    const first = progressMsgs[0] as { type: 'init:progress'; status: string };
    expect(first.status).toContain('Detecting GPU');
  });

  it('does not reload model on second init', async () => {
    await sendMessage({ type: 'init' });
    mockPipeline.mockClear();

    await sendMessage({ type: 'init' });
    expect(mockPipeline).not.toHaveBeenCalled();
  });

  it('uses webgpu device when GPU is available', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: () => Promise.resolve({ features: new Set() }) },
    });

    mockPipeline.mockResolvedValue(mockGenerator);
    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
    postedMessages.length = 0;

    await sendMessage({ type: 'init' });

    expect(mockPipeline).toHaveBeenCalledWith(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      expect.objectContaining({ device: 'webgpu', dtype: 'q4f16' }),
    );
  });

  it('falls back to wasm with q4 when GPU unavailable', async () => {
    // Default mock has requestAdapter returning null
    await sendMessage({ type: 'init' });

    expect(mockPipeline).toHaveBeenCalledWith(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      expect.objectContaining({ device: 'wasm', dtype: 'q4' }),
    );
  });

  // --- Match ---

  it('returns empty result for empty job description', async () => {
    await sendMessage({ type: 'match', resumeText: 'Some resume', jobDescription: '' });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);

    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(0);
    expect(result.matchPercentage).toBe(0);
  });

  it('sends resume and JD to the model as chat messages', async () => {
    await sendMessage({
      type: 'match',
      resumeText: 'My resume text',
      jobDescription: 'Need python developer',
    });

    expect(mockGenerator).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining('Need python developer'),
        }),
      ]),
      expect.objectContaining({ max_new_tokens: 2048, do_sample: false }),
    );
  });

  it('returns structured result with matched/partial/missing buckets', async () => {
    await sendMessage({
      type: 'match',
      resumeText: 'Python developer with React experience',
      jobDescription: 'Need python react kubernetes terraform',
    });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);

    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    // Verify structure
    expect(result.totalKeywords).toBe(4);
    expect(result.matchedCount).toBe(2); // python (exact) + react (semantic)
    expect(result.partialCount).toBe(1); // kubernetes (partial)
    expect(result.missingCount).toBe(1); // terraform (none)

    // Counts add up
    expect(result.matchedCount + result.partialCount + result.missingCount).toBe(result.totalKeywords);
    expect(result.matched).toHaveLength(result.matchedCount);
    expect(result.partial).toHaveLength(result.partialCount);
    expect(result.missing).toHaveLength(result.missingCount);
  });

  it('classifies exact and semantic as matched (found=true)', async () => {
    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const kw of result.matched) {
      expect(kw.found).toBe(true);
      expect(['exact', 'semantic']).toContain(kw.matchType);
    }
  });

  it('classifies none as missing with suggestedPlacement', async () => {
    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const kw of result.missing) {
      expect(kw.found).toBe(false);
      expect(kw.matchType).toBe('none');
      expect(kw.suggestedPlacement).toBeTruthy();
    }
  });

  it('includes bestMatchContext for matched keywords', async () => {
    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const kw of result.matched) {
      expect(kw.bestMatchContext).toBeDefined();
      expect(typeof kw.bestMatchContext).toBe('string');
      expect(kw.bestMatchContext!.length).toBeLessThanOrEqual(150);
    }
  });

  it('sorts matched keywords by similarity descending', async () => {
    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    for (const bucket of [result.matched, result.partial, result.missing]) {
      for (let i = 1; i < bucket.length; i++) {
        expect(bucket[i].similarity).toBeLessThanOrEqual(bucket[i - 1].similarity);
      }
    }
  });

  it('calculates match percentage correctly', async () => {
    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;

    const expectedPct = Math.round((result.matchedCount / result.totalKeywords) * 100);
    expect(result.matchPercentage).toBe(expectedPct);
  });

  // --- JSON extraction robustness ---

  it('parses JSON wrapped in markdown code blocks', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: '```json\n[{"keyword":"python","match":"exact","score":0.9,"context":"Python dev","placement":""}]\n```' },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(1);
    expect(result.matched[0].keyword).toBe('python');
  });

  it('extracts JSON array from surrounding text', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: 'Here are the keywords:\n[{"keyword":"react","match":"semantic","score":0.8,"context":"React apps","placement":""}]\nDone!' },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(1);
    expect(result.matched[0].keyword).toBe('react');
  });

  it('handles alternative field names (matchType, similarity, bestMatchContext)', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: JSON.stringify([
          { keyword: 'docker', matchType: 'exact', similarity: 0.9, bestMatchContext: 'Used Docker', suggestedPlacement: '' },
        ]) },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.matched[0].keyword).toBe('docker');
    expect(result.matched[0].similarity).toBe(0.9);
  });

  it('clamps scores to 0-1 range', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: JSON.stringify([
          { keyword: 'test1', match: 'exact', score: 1.5, context: '', placement: '' },
          { keyword: 'test2', match: 'none', score: -0.5, context: '', placement: 'Skills' },
        ]) },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    const allKw = [...result.matched, ...result.partial, ...result.missing];
    for (const kw of allKw) {
      expect(kw.similarity).toBeGreaterThanOrEqual(0);
      expect(kw.similarity).toBeLessThanOrEqual(1);
    }
  });

  it('skips entries with empty keyword', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: JSON.stringify([
          { keyword: '', match: 'exact', score: 0.9, context: '', placement: '' },
          { keyword: 'python', match: 'exact', score: 0.9, context: '', placement: '' },
          null,
          'invalid',
        ]) },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(1);
    expect(result.matched[0].keyword).toBe('python');
  });

  it('falls back to score-based classification for invalid match type', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: JSON.stringify([
          { keyword: 'python', match: 'high', score: 0.85, context: 'Python dev', placement: '' },
          { keyword: 'java', match: 'low', score: 0.3, context: '', placement: 'Skills' },
        ]) },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const result = (getMessages('match:result')[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    // score 0.85 → semantic (>= 0.65), score 0.3 → none (< 0.45)
    expect(result.matched[0].matchType).toBe('semantic');
    expect(result.missing[0].matchType).toBe('none');
  });

  // --- Error handling ---

  it('posts error if model loading fails', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { gpu: { requestAdapter: () => Promise.resolve(null) } });
    mockPipeline.mockRejectedValueOnce(new Error('Network timeout'));

    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
    postedMessages.length = 0;

    await sendMessage({ type: 'init' });

    const errors = getMessages('error');
    expect(errors).toHaveLength(1);
    expect((errors[0] as { type: 'error'; error: string }).error).toBe('Network timeout');
  });

  it('posts error when model returns empty response', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: '' },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'resume', jobDescription: 'jd text' });

    const errors = getMessages('error');
    expect(errors).toHaveLength(1);
    expect((errors[0] as { type: 'error'; error: string }).error).toContain('empty response');
  });

  it('posts error when JSON cannot be parsed', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: 'Sorry, I cannot analyze this resume.' },
      ],
    }]);

    await sendMessage({ type: 'match', resumeText: 'resume', jobDescription: 'jd text' });

    const errors = getMessages('error');
    expect(errors).toHaveLength(1);
    expect((errors[0] as { type: 'error'; error: string }).error).toContain('parse');
  });

  it('allows retry after model loading failure', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { gpu: { requestAdapter: () => Promise.resolve(null) } });

    mockPipeline.mockRejectedValueOnce(new Error('Network error'));
    mockPipeline.mockResolvedValueOnce(mockGenerator);

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
  });

  it('preserves model on match error (no re-download needed)', async () => {
    // Init succeeds
    await sendMessage({ type: 'init' });
    expect(getMessages('init:ready')).toHaveLength(1);

    // Match fails (bad JSON)
    mockGenerator.mockResolvedValueOnce([{
      generated_text: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' },
        { role: 'assistant', content: 'not json at all' },
      ],
    }]);

    postedMessages.length = 0;
    await sendMessage({ type: 'match', resumeText: 'resume', jobDescription: 'jd' });
    expect(getMessages('error')).toHaveLength(1);

    // Next match should work without re-downloading model
    mockPipeline.mockClear();
    mockGenerator.mockResolvedValueOnce(mockGeneratorResponse(SAMPLE_KEYWORDS));

    postedMessages.length = 0;
    await sendMessage({ type: 'match', resumeText: 'resume', jobDescription: 'jd' });

    expect(getMessages('match:result')).toHaveLength(1);
    expect(mockPipeline).not.toHaveBeenCalled(); // model NOT reloaded
  });

  // --- Auto-loads model on match ---

  it('auto-loads model when match is sent without prior init', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { gpu: { requestAdapter: () => Promise.resolve(null) } });
    mockPipeline.mockResolvedValue(mockGenerator);
    mockGenerator.mockResolvedValue(mockGeneratorResponse(SAMPLE_KEYWORDS));

    await import('../semanticMatcher.worker');
    workerHandler = (self as unknown as { onmessage: typeof workerHandler }).onmessage;
    postedMessages.length = 0;

    await sendMessage({ type: 'match', resumeText: 'Python dev', jobDescription: 'Need python' });

    expect(mockPipeline).toHaveBeenCalled();
    expect(getMessages('match:result')).toHaveLength(1);
  });

  // --- Input truncation ---

  it('truncates very long inputs to 3000 chars each', async () => {
    const longText = 'a'.repeat(5000);

    await sendMessage({ type: 'match', resumeText: longText, jobDescription: longText });

    const callArgs = mockGenerator.mock.calls[0][0];
    const userMessage = callArgs.find((m: { role: string }) => m.role === 'user');
    // Each input truncated to 3000, plus labels
    expect(userMessage.content.length).toBeLessThan(7000);
  });

  // --- Output format: string response ---

  it('handles plain string generated_text format', async () => {
    mockGenerator.mockResolvedValueOnce([{
      generated_text: JSON.stringify(SAMPLE_KEYWORDS),
    }]);

    await sendMessage({ type: 'match', resumeText: 'text', jobDescription: 'text' });

    const results = getMessages('match:result');
    expect(results).toHaveLength(1);
    const result = (results[0] as { type: 'match:result'; result: EnhancedScanResult }).result;
    expect(result.totalKeywords).toBe(4);
  });
});
