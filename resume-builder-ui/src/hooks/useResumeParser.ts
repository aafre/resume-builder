import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

export function useResumeParser() {
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

  // Animate progress smoothly from one value to another
  const animateProgress = (fromProgress: number, toProgress: number, duration: number) => {
    const startTime = Date.now();
    const progressDiff = toProgress - fromProgress;

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(elapsed / duration, 1);
      const currentProgress = fromProgress + (progressDiff * progressPercent);

      setProgress(Math.round(currentProgress));

      // Update message based on current progress
      const currentStage = [...PROGRESS_STAGES]
        .reverse()
        .find(stage => currentProgress >= stage.threshold);
      if (currentStage) {
        setProgressMessage(currentStage.message);
      }

      // Clear interval when animation completes
      if (progressPercent >= 1) {
        clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
      }
    }, 50); // Update every 50ms for smooth animation (20 FPS)
  };

  const parseResume = async (file: File): Promise<ParseResponse> => {
    setParsing(true);
    setProgress(0);
    setProgressMessage('Preparing upload...');
    setError(null);

    try {
      // Stage 1: File validation (0% → 20% over 200ms)
      animateProgress(0, 20, 200);
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Stage 2: File upload + extraction (20% → 50% over 400ms)
      animateProgress(20, 50, 400);

      // Check authentication
      if (!session) {
        throw new Error('Please sign in to upload a resume');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Stage 3: AI analysis (50% → 75% over 500ms)
      animateProgress(50, 75, 500);

      // Call Edge Function
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

      // Stage 4: Structuring data (75% → 90% over 300ms)
      animateProgress(75, 90, 300);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      // Stage 5: Complete (90% → 100% over 100ms)
      animateProgress(90, 100, 100);
      return data;
    } catch (err) {
      // Clear interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
