import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackResumeUploadStarted, trackResumeParseCompleted, categorizeError } from '../lib/analytics';
import type { ParseSource } from '../lib/analytics';

interface ParseResponse {
  success: boolean;
  yaml: string;
  confidence: number;
  warnings: string[];
  cached: boolean;
  ui_message: {
    title: string;
    description: string;
    type: 'success' | 'warning';
  };
  file_info?: {
    name: string;
    size: number;
    type: string;
  };
}

// Progress stages with corresponding messages
const PROGRESS_STAGES = [
  { threshold: 0, message: 'Preparing upload...' },
  { threshold: 20, message: 'Extracting text from file...' },
  { threshold: 50, message: 'Analyzing resume structure...' },
  { threshold: 75, message: 'Identifying sections and details...' },
  { threshold: 90, message: 'Finalizing your resume...' },
];

/**
 * @param options.source Which flow is parsing. The Jobs page parses a resume
 *   only to prefill a job search, so those parses can never become
 *   resume_created{method:'ai_import'} and would otherwise show up as
 *   abandonment in the AI-import funnel.
 */
export function useResumeParser(options?: { source?: ParseSource }) {
  const source: ParseSource = options?.source ?? 'resume_import';

  const { session } = useAuth();
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 10MB)`;
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF or DOCX file.';
    }

    return null;
  };

  // Start continuous progress animation with asymptotic slowdown
  // Progress quickly at first, then slows down as it approaches maxProgress
  // This ensures we never reach 100% before the API completes, even for slow requests
  const startProgressAnimation = (maxProgress: number = 90) => {
    const startTime = Date.now();

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Asymptotic formula: progress = maxProgress * (1 - e^(-elapsed/8000))
      // This approaches maxProgress but never quite reaches it
      // Gets to ~63% of maxProgress in 8 seconds, ~86% in 16 seconds, ~95% in 24 seconds
      const progressPercent = 1 - Math.exp(-elapsed / 8000);
      const currentProgress = Math.round(progressPercent * maxProgress);

      setProgress(currentProgress);

      // Update message based on current progress
      const currentStage = [...PROGRESS_STAGES]
        .reverse()
        .find(stage => currentProgress >= stage.threshold);
      if (currentStage) {
        setProgressMessage(currentStage.message);
      }

      // Never auto-stop - only stops when stopProgressAnimation is called
    }, 150); // Update every 150ms for smooth visual feedback
  };

  const stopProgressAnimation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const parseResume = async (file: File): Promise<ParseResponse> => {
    setParsing(true);
    setProgress(0);
    setProgressMessage('Preparing upload...');
    setError(null);

    // Declared outside the try so the catch can still report parse duration
    let parseStart = 0;
    let fileType = 'unknown';

    try {
      // Validate file first
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Check authentication
      if (!session) {
        throw new Error('Please sign in to upload a resume');
      }

      // Debug: Log session info
      console.log('🔍 Session Debug:', {
        user_id: session.user?.id,
        is_anonymous: session.user?.is_anonymous,
        expires_at: session.expires_at,
        token_preview: session.access_token?.substring(0, 50) + '...',
        supabase_url: import.meta.env.VITE_SUPABASE_URL,
      });

      // Start continuous progress animation (0% → 90% over 1200ms)
      startProgressAnimation(90);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Bracket the parse so abandonment during the ~12s median wait is measurable.
      // Set only once the request is actually attempted, so validation/auth
      // failures above don't pollute parse duration or the failure rate.
      //
      // Derive file_type from the validated MIME type, never from file.name:
      // validateFile checks file.type only, so a valid PDF named "Jane Smith CV"
      // has no extension and splitting on '.' would send the user's name.
      fileType = file.type === 'application/pdf' ? 'pdf'
        : file.type.includes('wordprocessingml') ? 'docx'
        : 'unknown';
      parseStart = Date.now();
      trackResumeUploadStarted({
        file_type: fileType,
        file_size_kb: Math.round(file.size / 1024),
        source,
      });

      // Call Edge Function (runs in parallel with progress animation)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      // Debug: Log response
      if (!response.ok) {
        console.error('❌ Edge function error:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      // Stop animation and jump to 100%
      stopProgressAnimation();
      setProgress(100);
      setProgressMessage('Finalizing your resume...');

      trackResumeParseCompleted({
        file_type: fileType,
        duration_ms: Date.now() - parseStart,
        success: true,
        cached: data.cached,
        confidence: data.confidence,
        source,
      });

      return data;
    } catch (err) {
      // Stop animation on error
      stopProgressAnimation();
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (parseStart > 0) {
        trackResumeParseCompleted({
          file_type: fileType,
          duration_ms: Date.now() - parseStart,
          success: false,
          error_type: categorizeError(errorMessage),
          source,
        });
      }
      setError(errorMessage);
      throw err;
    } finally {
      setParsing(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 500);
    }
  };

  const clearError = () => setError(null);

  return {
    parseResume,
    parsing,
    progress,
    progressMessage,
    error,
    clearError,
  };
}
