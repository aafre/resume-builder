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
  console.log('[useThumbnailRefresh] Hook called');
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimesRef = useRef<Map<string, number>>(new Map());
  const resumeTimestampsRef = useRef<Map<string, string>>(new Map());
  const retryStateRef = useRef<Map<string, RetryState>>(new Map());
  const onThumbnailUpdatedRef = useRef(onThumbnailUpdated);

  // Update callback ref on every render to avoid stale closures
  useEffect(() => {
    console.log('[useThumbnailRefresh] Updating onThumbnailUpdated ref');
    onThumbnailUpdatedRef.current = onThumbnailUpdated;
  });

  const scheduleRetry = useCallback((resumeId: string) => {
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
  }, []);

  const triggerRefresh = useCallback(async (resumeId: string) => {
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
        scheduleRetry(resumeId);
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
      scheduleRetry(resumeId);
    }
  }, [scheduleRetry]);

  const checkThumbnailUpdates = useCallback(async () => {
    console.log('[useThumbnailRefresh] checkThumbnailUpdates called');
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

    // Get current generating IDs directly from state without dependency
    let currentGeneratingIds: string[] = [];
    setGeneratingIds(prev => {
      currentGeneratingIds = Array.from(prev);
      return prev;
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
          scheduleRetry(resumeId);
        }
      }
    });
  }, [scheduleRetry]);

  // Polling effect
  useEffect(() => {
    console.log('[useThumbnailRefresh] Polling effect running, generatingIds.size:', generatingIds.size);
    if (generatingIds.size === 0) {
      console.log('[useThumbnailRefresh] No generating IDs, clearing interval');
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    if (!pollIntervalRef.current) {
      console.log('[useThumbnailRefresh] Starting polling interval');
      pollIntervalRef.current = setInterval(() => {
        checkThumbnailUpdates();
      }, POLL_INTERVAL);
    }

    return () => {
      console.log('[useThumbnailRefresh] Cleaning up polling interval');
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [generatingIds.size, checkThumbnailUpdates]);

  // Retry scheduler effect - check for pending retries
  // TEMPORARILY DISABLED to debug loading issue
  // useEffect(() => {
  //   // Check every 5 seconds if any retries are due
  //   retryIntervalRef.current = setInterval(() => {
  //     // Early exit if no retries pending
  //     if (retryStateRef.current.size === 0) return;

  //     const now = Date.now();
  //     retryStateRef.current.forEach((state, resumeId) => {
  //       if (state.nextRetryTime && now >= state.nextRetryTime) {
  //         console.log(`[Thumbnail] Executing scheduled retry for ${resumeId}`);
  //         // Clear nextRetryTime to prevent duplicate retries
  //         retryStateRef.current.set(resumeId, { ...state, nextRetryTime: null });
  //         triggerRefresh(resumeId);
  //       }
  //     });
  //   }, 5000);

  //   return () => {
  //     if (retryIntervalRef.current) {
  //       clearInterval(retryIntervalRef.current);
  //       retryIntervalRef.current = null;
  //     }
  //   };
  // }, [triggerRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }

      // Clear all refs
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
