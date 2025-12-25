import { useState, useEffect, useRef, useCallback } from 'react';
import { generateThumbnail } from '../services/templates';
import { supabase } from '../lib/supabase';

interface UseThumbnailRefreshOptions {
  onThumbnailUpdated?: (resumeId: string, pdf_generated_at: string, thumbnail_url: string) => void;
}

interface UseThumbnailRefreshReturn {
  generatingIds: Set<string>;
  triggerRefresh: (resumeId: string) => Promise<void>;
}

const POLL_INTERVAL = 2000; // 2 seconds
const GENERATION_TIMEOUT = 60000; // 60 seconds
const RETRY_DELAYS = [30000, 120000, 600000]; // 30s, 2min, 10min

interface RetryState {
  count: number;
  nextRetryTime: number | null;
}

export function useThumbnailRefresh({
  onThumbnailUpdated
}: UseThumbnailRefreshOptions): UseThumbnailRefreshReturn {
  console.log('[useThumbnailRefresh] Hook render');
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimesRef = useRef<Map<string, number>>(new Map());
  const resumeTimestampsRef = useRef<Map<string, string>>(new Map());
  const retryStateRef = useRef<Map<string, RetryState>>(new Map());
  const onThumbnailUpdatedRef = useRef(onThumbnailUpdated);

  // Update ref when callback changes (stable pattern)
  useEffect(() => {
    onThumbnailUpdatedRef.current = onThumbnailUpdated;
  }, [onThumbnailUpdated]);

  // Schedule retry - defined as ref to avoid recreation
  const scheduleRetryRef = useRef((resumeId: string) => {
    const retryState = retryStateRef.current.get(resumeId) || { count: 0, nextRetryTime: null };

    // Max 3 retry attempts per session
    if (retryState.count >= 3) {
      console.log(`[Thumbnail] Max retries reached for ${resumeId}, giving up silently`);
      retryStateRef.current.delete(resumeId);
      return;
    }

    const delay = RETRY_DELAYS[retryState.count] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
    const nextRetryTime = Date.now() + delay;

    retryStateRef.current.set(resumeId, {
      count: retryState.count + 1,
      nextRetryTime
    });

    console.log(`[Thumbnail] Scheduling retry ${retryState.count + 1}/3 for ${resumeId} in ${delay / 1000}s`);
  });

  const triggerRefresh = useCallback(async (resumeId: string) => {
    console.log('[triggerRefresh] Called for:', resumeId);
    // Check if already generating using state setter pattern
    let shouldProceed = false;
    setGeneratingIds(prev => {
      if (prev.has(resumeId)) {
        console.log(`[Thumbnail] Already generating for ${resumeId}, skipping`);
        return prev;
      }
      shouldProceed = true;
      return new Set(prev).add(resumeId);
    });

    if (!shouldProceed) return;

    startTimesRef.current.set(resumeId, Date.now());

    try {
      const result = await generateThumbnail(resumeId);

      if (result.success && result.pdf_generated_at) {
        // Store timestamp for polling comparison
        resumeTimestampsRef.current.set(resumeId, result.pdf_generated_at);
        // Clear retry state on success
        retryStateRef.current.delete(resumeId);
      } else if (result.retryable) {
        // Backend says error is retryable - schedule retry
        console.log(`[Thumbnail] Generation retryable for ${resumeId}, scheduling retry`);
        setGeneratingIds(prev => {
          const next = new Set(prev);
          next.delete(resumeId);
          return next;
        });
        startTimesRef.current.delete(resumeId);
        scheduleRetryRef.current(resumeId);
      } else {
        // Permanent error - give up silently
        console.error(`[Thumbnail] Permanent error for ${resumeId}:`, result.error);
        setGeneratingIds(prev => {
          const next = new Set(prev);
          next.delete(resumeId);
          return next;
        });
        startTimesRef.current.delete(resumeId);
        retryStateRef.current.delete(resumeId);
      }
    } catch (error) {
      console.error(`[Thumbnail] Failed to trigger for ${resumeId}:`, error);
      // Network error - schedule retry
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(resumeId);
        return next;
      });
      startTimesRef.current.delete(resumeId);
      scheduleRetryRef.current(resumeId);
    }
  }, []); // No dependencies - uses refs for everything

  // Polling function - stable, no dependencies
  const checkThumbnailUpdates = useCallback(async () => {
    const now = Date.now();

    if (!supabase) {
      console.error('[Thumbnail] Supabase not configured - cannot poll for updates');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('[Thumbnail] No active session - cannot poll for updates');
      return;
    }

    // Get current generating IDs directly from state
    let currentGeneratingIds: string[] = [];
    setGeneratingIds(prev => {
      currentGeneratingIds = Array.from(prev);
      return prev; // Don't modify state
    });

    if (currentGeneratingIds.length === 0) return;

    const checks = currentGeneratingIds.map(async (resumeId) => {
      // Check timeout
      const startTime = startTimesRef.current.get(resumeId);
      if (startTime && (now - startTime) > GENERATION_TIMEOUT) {
        console.log(`[Thumbnail] Generation timeout for ${resumeId}, scheduling retry`);
        return { resumeId, timedOut: true };
      }

      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          return { resumeId, error: true };
        }

        const result = await response.json();
        const resume = result.resume;

        // Compare timestamps
        const lastKnown = resumeTimestampsRef.current.get(resumeId);
        const current = resume.pdf_generated_at;

        if (current && current !== lastKnown) {
          // Thumbnail has been updated!
          return {
            resumeId,
            updated: true,
            pdf_generated_at: current,
            thumbnail_url: resume.thumbnail_url
          };
        }

        return { resumeId };
      } catch (error) {
        console.error(`[Thumbnail] Polling error for ${resumeId}:`, error);
        return { resumeId, error: true };
      }
    });

    const results = await Promise.allSettled(checks);

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { resumeId, updated, timedOut, error, pdf_generated_at, thumbnail_url } = result.value;

        if (updated) {
          // Success - remove from generating
          console.log(`[Thumbnail] Successfully updated ${resumeId}`);
          setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(resumeId);
            return next;
          });
          startTimesRef.current.delete(resumeId);
          resumeTimestampsRef.current.delete(resumeId);
          retryStateRef.current.delete(resumeId);

          if (pdf_generated_at && thumbnail_url) {
            onThumbnailUpdatedRef.current?.(resumeId, pdf_generated_at, thumbnail_url);
          }
        } else if (timedOut || error) {
          // Timeout/error - schedule retry instead of failing
          setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(resumeId);
            return next;
          });
          startTimesRef.current.delete(resumeId);
          resumeTimestampsRef.current.delete(resumeId);
          scheduleRetryRef.current(resumeId);
        }
      }
    });
  }, []); // No dependencies - uses refs

  // Polling effect - only depends on generatingIds.size
  useEffect(() => {
    if (generatingIds.size === 0) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    // Start polling if not already active
    if (!pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(checkThumbnailUpdates, POLL_INTERVAL);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [generatingIds.size]); // Only depend on size, not the function

  // Retry scheduler effect - runs independently
  useEffect(() => {
    retryIntervalRef.current = setInterval(() => {
      if (retryStateRef.current.size === 0) return;

      const now = Date.now();
      retryStateRef.current.forEach((state, resumeId) => {
        if (state.nextRetryTime && now >= state.nextRetryTime) {
          console.log(`[Thumbnail] Executing scheduled retry for ${resumeId}`);
          // Clear nextRetryTime to prevent duplicate retries
          retryStateRef.current.set(resumeId, { ...state, nextRetryTime: null });
          triggerRefresh(resumeId);
        }
      });
    }, 5000);

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, [triggerRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
      startTimesRef.current.clear();
      resumeTimestampsRef.current.clear();
      retryStateRef.current.clear();
    };
  }, []);

  return {
    generatingIds,
    triggerRefresh
  };
}
