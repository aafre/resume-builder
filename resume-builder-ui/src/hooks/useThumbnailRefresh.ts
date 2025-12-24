import { useState, useEffect, useRef, useCallback } from 'react';
import { generateThumbnail } from '../services/templates';

interface UseThumbnailRefreshOptions {
  onThumbnailUpdated?: (resumeId: string, pdf_generated_at: string, thumbnail_url: string) => void;
}

interface UseThumbnailRefreshReturn {
  generatingIds: Set<string>;
  failedIds: Set<string>;
  triggerRefresh: (resumeId: string) => Promise<void>;
  retryFailed: (resumeId: string) => Promise<void>;
}

const POLL_INTERVAL = 2000; // 2 seconds
const GENERATION_TIMEOUT = 60000; // 60 seconds

export function useThumbnailRefresh({
  onThumbnailUpdated
}: UseThumbnailRefreshOptions): UseThumbnailRefreshReturn {
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimesRef = useRef<Map<string, number>>(new Map());
  const resumeTimestampsRef = useRef<Map<string, string>>(new Map());

  const triggerRefresh = useCallback(async (resumeId: string) => {
    // Add to generating set
    setGeneratingIds(prev => new Set(prev).add(resumeId));

    // Remove from failed set if retrying
    setFailedIds(prev => {
      const next = new Set(prev);
      next.delete(resumeId);
      return next;
    });

    // Record start time for timeout tracking
    startTimesRef.current.set(resumeId, Date.now());

    try {
      // Call the thumbnail generation endpoint
      const result = await generateThumbnail(resumeId);

      if (result.success && result.pdf_generated_at) {
        // Store initial timestamp for polling comparison
        resumeTimestampsRef.current.set(resumeId, result.pdf_generated_at);
      } else {
        throw new Error(result.error || 'Thumbnail generation failed');
      }
    } catch (error) {
      console.error(`Failed to trigger thumbnail for ${resumeId}:`, error);

      // Remove from generating, add to failed
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(resumeId);
        return next;
      });
      setFailedIds(prev => new Set(prev).add(resumeId));
      startTimesRef.current.delete(resumeId);
    }
  }, []);

  const retryFailed = useCallback(async (resumeId: string) => {
    // Same as triggerRefresh but specifically for failed resumes
    await triggerRefresh(resumeId);
  }, [triggerRefresh]);

  const checkThumbnailUpdates = useCallback(async () => {
    if (generatingIds.size === 0) return;

    const now = Date.now();

    const checks = Array.from(generatingIds).map(async (resumeId) => {
      // Check timeout
      const startTime = startTimesRef.current.get(resumeId);
      if (startTime && (now - startTime) > GENERATION_TIMEOUT) {
        return { resumeId, timedOut: true };
      }

      try {
        // Fetch resume to check if thumbnail updated
        const response = await fetch(`/api/resumes/${resumeId}`);

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
        console.error(`Polling error for ${resumeId}:`, error);
        return { resumeId, error: true };
      }
    });

    const results = await Promise.allSettled(checks);

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { resumeId, updated, timedOut, error, pdf_generated_at, thumbnail_url } = result.value;

        if (updated) {
          // Success - remove from generating, notify parent
          setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(resumeId);
            return next;
          });
          startTimesRef.current.delete(resumeId);
          resumeTimestampsRef.current.delete(resumeId);

          if (pdf_generated_at && thumbnail_url) {
            onThumbnailUpdated?.(resumeId, pdf_generated_at, thumbnail_url);
          }
        } else if (timedOut || error) {
          // Failure - mark as failed
          setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(resumeId);
            return next;
          });
          setFailedIds(prev => new Set(prev).add(resumeId));
          startTimesRef.current.delete(resumeId);
          resumeTimestampsRef.current.delete(resumeId);
        }
      }
    });
  }, [generatingIds, onThumbnailUpdated]);

  // Polling effect
  useEffect(() => {
    if (generatingIds.size === 0) {
      // No resumes generating, clear interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    // Start polling if not already active
    if (!pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(() => {
        checkThumbnailUpdates();
      }, POLL_INTERVAL);
    }

    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [generatingIds.size, checkThumbnailUpdates]);

  return {
    generatingIds,
    failedIds,
    triggerRefresh,
    retryFailed
  };
}
