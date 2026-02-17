import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSemanticMatcher } from '../useSemanticMatcher';
import type { EnhancedScanResult, WorkerOutMessage } from '../../types/semanticMatcher';

// --- Mock Worker ---

let workerOnMessage: ((e: MessageEvent<WorkerOutMessage>) => void) | null = null;
let workerOnError: ((e: ErrorEvent) => void) | null = null;
const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();

class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  postMessage = mockPostMessage;
  terminate = mockTerminate;

  constructor() {
    // Capture handlers once assigned
    const self = this;
    Object.defineProperty(this, 'onmessage', {
      set(handler) {
        workerOnMessage = handler;
        self._onmessage = handler;
      },
      get() {
        return self._onmessage;
      },
    });
    Object.defineProperty(this, 'onerror', {
      set(handler) {
        workerOnError = handler;
        self._onerror = handler;
      },
      get() {
        return self._onerror;
      },
    });
  }
  _onmessage: ((e: MessageEvent) => void) | null = null;
  _onerror: ((e: ErrorEvent) => void) | null = null;
}

vi.stubGlobal('Worker', MockWorker);

// Helper to simulate worker posting a message back
function simulateWorkerMessage(data: WorkerOutMessage) {
  if (workerOnMessage) {
    workerOnMessage({ data } as MessageEvent<WorkerOutMessage>);
  }
}

function simulateWorkerError(message: string) {
  if (workerOnError) {
    workerOnError({ message } as ErrorEvent);
  }
}

const mockResult: EnhancedScanResult = {
  matchPercentage: 75,
  totalKeywords: 8,
  matchedCount: 6,
  partialCount: 1,
  missingCount: 1,
  matched: [
    { keyword: 'python', found: true, similarity: 0.92, matchType: 'exact' },
    { keyword: 'react', found: true, similarity: 0.88, matchType: 'exact' },
    { keyword: 'typescript', found: true, similarity: 0.78, matchType: 'semantic' },
    { keyword: 'node.js', found: true, similarity: 0.75, matchType: 'semantic' },
    { keyword: 'aws', found: true, similarity: 0.71, matchType: 'semantic' },
    { keyword: 'docker', found: true, similarity: 0.67, matchType: 'semantic' },
  ],
  partial: [
    { keyword: 'kubernetes', found: false, similarity: 0.52, matchType: 'partial', bestMatchContext: 'Deployed services using Docker containers' },
  ],
  missing: [
    { keyword: 'terraform', found: false, similarity: 0.31, matchType: 'none', suggestedPlacement: 'Skills section — Tools & Infrastructure' },
  ],
};

describe('useSemanticMatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workerOnMessage = null;
    workerOnError = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Initial state ---

  it('returns idle initial state', () => {
    const { result } = renderHook(() => useSemanticMatcher());
    expect(result.current.modelStatus).toBe('idle');
    expect(result.current.modelProgress).toBe(0);
    expect(result.current.modelStatusText).toBe('');
    expect(result.current.isMatching).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  // --- initModel ---

  it('transitions to loading on initModel', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    expect(result.current.modelStatus).toBe('loading');
    expect(result.current.modelProgress).toBe(0);
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'init' });
  });

  it('spawns worker on first initModel call', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    expect(mockPostMessage).toHaveBeenCalledTimes(1);
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'init' });
  });

  it('does not re-init if already loading', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    mockPostMessage.mockClear();

    act(() => {
      result.current.initModel();
    });

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('does not re-init if already ready', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });

    expect(result.current.modelStatus).toBe('ready');
    mockPostMessage.mockClear();

    act(() => {
      result.current.initModel();
    });

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  // --- Progress messages ---

  it('updates progress on init:progress message', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    act(() => {
      simulateWorkerMessage({ type: 'init:progress', progress: 42, status: 'Downloading AI model...' });
    });

    expect(result.current.modelProgress).toBe(42);
    expect(result.current.modelStatusText).toBe('Downloading AI model...');
  });

  it('sets ready state on init:ready', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });

    expect(result.current.modelStatus).toBe('ready');
    expect(result.current.modelProgress).toBe(100);
    expect(result.current.modelStatusText).toBe('AI model ready');
  });

  // --- runMatch ---

  it('posts match message and sets isMatching', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    // First init the model
    act(() => {
      result.current.initModel();
    });
    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });

    mockPostMessage.mockClear();

    act(() => {
      result.current.runMatch('My resume text', 'Job description text');
    });

    expect(result.current.isMatching).toBe(true);
    expect(result.current.result).toBeNull();
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'match',
      resumeText: 'My resume text',
      jobDescription: 'Job description text',
    });
  });

  it('sets loading if model not yet ready when runMatch called', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.runMatch('My resume', 'JD text');
    });

    expect(result.current.modelStatus).toBe('loading');
    expect(result.current.isMatching).toBe(true);
  });

  it('receives match result and clears isMatching', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.runMatch('Resume', 'JD');
    });

    act(() => {
      simulateWorkerMessage({ type: 'match:result', result: mockResult });
    });

    expect(result.current.isMatching).toBe(false);
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.result!.matchPercentage).toBe(75);
    expect(result.current.result!.matched).toHaveLength(6);
    expect(result.current.result!.partial).toHaveLength(1);
    expect(result.current.result!.missing).toHaveLength(1);
  });

  // --- Error handling ---

  it('sets error on worker error message during init', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    act(() => {
      simulateWorkerMessage({ type: 'error', error: 'Model download failed' });
    });

    expect(result.current.error).toBe('Model download failed');
    expect(result.current.modelStatus).toBe('error');
    expect(result.current.isMatching).toBe(false);
  });

  it('sets error on worker error message during match (model ready)', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });
    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });

    act(() => {
      result.current.runMatch('Resume', 'JD');
    });

    act(() => {
      simulateWorkerMessage({ type: 'error', error: 'Embedding failed' });
    });

    expect(result.current.error).toBe('Embedding failed');
    expect(result.current.isMatching).toBe(false);
    // Model status stays 'ready' since error happened during match, not init
    expect(result.current.modelStatus).toBe('ready');
  });

  it('sets error on worker onerror event', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    act(() => {
      simulateWorkerError('Script error');
    });

    expect(result.current.error).toBe('Script error');
    expect(result.current.modelStatus).toBe('error');
    expect(result.current.isMatching).toBe(false);
  });

  // --- clearResults ---

  it('clears result and error on clearResults', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.runMatch('Resume', 'JD');
    });
    act(() => {
      simulateWorkerMessage({ type: 'match:result', result: mockResult });
    });

    expect(result.current.result).not.toBeNull();

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isMatching).toBe(false);
  });

  // --- Worker reuse ---

  it('reuses the same worker across multiple calls', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });
    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });

    act(() => {
      result.current.runMatch('Resume 1', 'JD 1');
    });
    act(() => {
      simulateWorkerMessage({ type: 'match:result', result: mockResult });
    });

    act(() => {
      result.current.runMatch('Resume 2', 'JD 2');
    });

    // init + match + match = 3 postMessage calls total (one Worker instance)
    expect(mockPostMessage).toHaveBeenCalledTimes(3);
  });

  // --- Unmount cleanup ---

  it('terminates worker on unmount', () => {
    const { result, unmount } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    unmount();

    expect(mockTerminate).toHaveBeenCalledTimes(1);
  });

  it('ignores messages after unmount', () => {
    const { result, unmount } = renderHook(() => useSemanticMatcher());

    act(() => {
      result.current.initModel();
    });

    unmount();

    // This should not throw or update state
    expect(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    }).not.toThrow();
  });

  // --- Full flow ---

  it('handles complete init → match → result flow', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    // Step 1: Init
    act(() => {
      result.current.initModel();
    });
    expect(result.current.modelStatus).toBe('loading');

    // Step 2: Progress
    act(() => {
      simulateWorkerMessage({ type: 'init:progress', progress: 50, status: 'Downloading AI model...' });
    });
    expect(result.current.modelProgress).toBe(50);

    // Step 3: Ready
    act(() => {
      simulateWorkerMessage({ type: 'init:ready' });
    });
    expect(result.current.modelStatus).toBe('ready');
    expect(result.current.modelProgress).toBe(100);

    // Step 4: Match
    act(() => {
      result.current.runMatch('Senior Python developer with React experience', 'Need python react aws docker');
    });
    expect(result.current.isMatching).toBe(true);

    // Step 5: Result
    act(() => {
      simulateWorkerMessage({ type: 'match:result', result: mockResult });
    });
    expect(result.current.isMatching).toBe(false);
    expect(result.current.result!.matchPercentage).toBe(75);
    expect(result.current.result!.matchedCount).toBe(6);

    // Step 6: Clear
    act(() => {
      result.current.clearResults();
    });
    expect(result.current.result).toBeNull();
  });

  it('allows retry after error', () => {
    const { result } = renderHook(() => useSemanticMatcher());

    // Init fails
    act(() => {
      result.current.initModel();
    });
    act(() => {
      simulateWorkerMessage({ type: 'error', error: 'Network error' });
    });
    expect(result.current.modelStatus).toBe('error');

    mockPostMessage.mockClear();

    // Retry should work since status is 'error' (not 'loading' or 'ready')
    act(() => {
      result.current.initModel();
    });
    expect(result.current.modelStatus).toBe('loading');
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'init' });
  });
});
