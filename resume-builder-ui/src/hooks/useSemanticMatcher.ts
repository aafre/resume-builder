/**
 * React hook wrapping the semantic matcher Web Worker.
 *
 * Manages worker lifecycle, model loading state, and matching results.
 * The worker is spawned lazily on first `initModel()` call.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  ModelStatus,
  EnhancedScanResult,
  WorkerOutMessage,
} from '../types/semanticMatcher';

export interface UseSemanticMatcherReturn {
  modelStatus: ModelStatus;
  modelProgress: number;
  modelStatusText: string;
  isMatching: boolean;
  result: EnhancedScanResult | null;
  error: string | null;
  initModel: () => void;
  runMatch: (resumeText: string, jobDescription: string) => void;
  clearResults: () => void;
}

export function useSemanticMatcher(): UseSemanticMatcherReturn {
  const workerRef = useRef<Worker | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [modelProgress, setModelProgress] = useState(0);
  const [modelStatusText, setModelStatusText] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<EnhancedScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unmountedRef = useRef(false);
  const modelStatusRef = useRef<ModelStatus>('idle');

  // Keep ref in sync with state
  useEffect(() => {
    modelStatusRef.current = modelStatus;
  }, [modelStatus]);

  const getOrCreateWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    const worker = new Worker(
      new URL('../workers/semanticMatcher.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      if (unmountedRef.current) return;
      const msg = e.data;

      switch (msg.type) {
        case 'init:progress':
          setModelProgress(msg.progress);
          setModelStatusText(msg.status);
          break;

        case 'init:ready':
          setModelStatus('ready');
          setModelProgress(100);
          setModelStatusText('AI model ready');
          break;

        case 'match:result':
          setResult(msg.result);
          setIsMatching(false);
          break;

        case 'error':
          setError(msg.error);
          setIsMatching(false);
          if (modelStatusRef.current === 'loading') {
            setModelStatus('error');
          }
          break;
      }
    };

    worker.onerror = (e) => {
      if (unmountedRef.current) return;
      setError(e.message || 'Worker error');
      setIsMatching(false);
      setModelStatus('error');
    };

    workerRef.current = worker;
    return worker;
  }, []);

  const initModel = useCallback(() => {
    if (modelStatusRef.current === 'loading' || modelStatusRef.current === 'ready') return;
    setModelStatus('loading');
    setModelProgress(0);
    setError(null);
    const worker = getOrCreateWorker();
    worker.postMessage({ type: 'init' });
  }, [getOrCreateWorker]);

  const runMatch = useCallback(
    (resumeText: string, jobDescription: string) => {
      setIsMatching(true);
      setError(null);
      setResult(null);
      const worker = getOrCreateWorker();

      // If model isn't loaded yet, the worker will auto-load it
      if (modelStatusRef.current === 'idle' || modelStatusRef.current === 'error') {
        setModelStatus('loading');
      }

      worker.postMessage({ type: 'match', resumeText, jobDescription });
    },
    [getOrCreateWorker]
  );

  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
    setIsMatching(false);
  }, []);

  // Cleanup worker on unmount
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return {
    modelStatus,
    modelProgress,
    modelStatusText,
    isMatching,
    result,
    error,
    initModel,
    runMatch,
    clearResults,
  };
}
