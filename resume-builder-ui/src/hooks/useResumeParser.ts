import { useState } from 'react';
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

export function useResumeParser() {
  const { session } = useAuth();
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  const parseResume = async (file: File): Promise<ParseResponse> => {
    setParsing(true);
    setProgress(10);
    setError(null);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      setProgress(20);

      // Check authentication
      if (!session) {
        throw new Error('Please sign in to upload a resume');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      setProgress(40);

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

      setProgress(80);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setProgress(100);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setParsing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const clearError = () => setError(null);

  return {
    parseResume,
    parsing,
    progress,
    error,
    clearError,
  };
}
