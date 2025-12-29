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

  // Start continuous progress animation that runs until stopped
  const startProgressAnimation = (maxProgress: number = 90) => {
    const startTime = Date.now();
    const totalDuration = 1200; // Animate to maxProgress over 1200ms

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(elapsed / totalDuration, 1);
      const currentProgress = Math.round(progressPercent * maxProgress);

      setProgress(currentProgress);

      // Update message based on current progress
      const currentStage = [...PROGRESS_STAGES]
        .reverse()
        .find(stage => currentProgress >= stage.threshold);
      if (currentStage) {
        setProgressMessage(currentStage.message);
      }

      // Stop at maxProgress
      if (progressPercent >= 1) {
        clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
      }
    }, 100); // Update every 100ms for smooth visual feedback
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

      // Start continuous progress animation (0% → 90% over 1200ms)
      startProgressAnimation(90);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

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

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      // Stop animation and jump to 100%
      stopProgressAnimation();
      setProgress(100);
      setProgressMessage('Finalizing your resume...');

      return data;
    } catch (err) {
      // Stop animation on error
      stopProgressAnimation();
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
