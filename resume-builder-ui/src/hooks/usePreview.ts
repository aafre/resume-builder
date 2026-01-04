import { useState, useCallback, useRef, useEffect } from 'react';
import { generatePreviewPdf } from '../services/templates';
import { getSessionId } from '../utils/session';
import { extractReferencedIconFilenames } from '../utils/iconExtractor';
import yaml from 'js-yaml';
import { ContactInfo, Section } from '../types';

interface IconRegistry {
  getIconFile: (filename: string) => File | null;
}

// Default icons provided by the system (served from /icons/ directory)
const DEFAULT_ICONS = new Set([
  // Contact icons (13)
  'location.png',
  'email.png',
  'phone.png',
  'linkedin.png',
  'github.png',
  'twitter.png',
  'website.png',
  'pinterest.png',
  'medium.png',
  'youtube.png',
  'stackoverflow.png',
  'behance.png',
  'dribbble.png',

  // Company icons (4)
  'company.png',
  'company_google.png',
  'company_amazon.png',
  'company_apple.png',

  // School/Education icons (4)
  'school.png',
  'school_harvard.png',
  'school_oxford.png',
  'school_berkeley.svg',

  // Certification icons (6)
  'certification_aws.png',
  'certification_azure.png',
  'certification_k8s.png',
  'certification_google.png',
  'certification_devops.png',
  'certification_scrum.png',
]);

interface UsePreviewOptions {
  // Editor mode (live preview)
  contactInfo?: ContactInfo | null;
  sections?: Section[];
  templateId?: string | null;
  iconRegistry?: IconRegistry;
  processSections?: (sections: Section[]) => Section[];
  supportsIcons?: boolean;

  // MyResumes mode (database PDF)
  resumeId?: string;
  mode?: 'live' | 'database';
  session?: { access_token: string } | null;
}

interface IconValidationResult {
  valid: boolean;
  missingIcons: string[];
}

interface UsePreviewReturn {
  previewUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  lastGenerated: Date | null;
  isStale: boolean;
  generatePreview: () => Promise<void>;
  debouncedGeneratePreview: (delay?: number) => Promise<void>;
  checkAndRefreshIfStale: () => Promise<void>;
  validateIcons: () => IconValidationResult;
  clearPreview: () => void;
}

const CACHE_DURATION_MS = 30000; // 30 seconds cache

export function usePreview({
  contactInfo,
  sections = [],
  templateId,
  iconRegistry,
  processSections,
  supportsIcons = false,
  resumeId,
  mode = 'live',
  session,
}: UsePreviewOptions): UsePreviewReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [lastContentHash, setLastContentHash] = useState<string>('');

  // Cache management
  const cacheTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPreviewUrlRef = useRef<string | null>(null);  // Track URL for cleanup without causing re-renders

  // Request deduplication
  const abortControllerRef = useRef<AbortController | null>(null);
  const generationPromiseRef = useRef<Promise<void> | null>(null);

  // Debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Icon validation cache
  const [validationCache, setValidationCache] = useState<{
    hash: string;
    valid: boolean;
    missingIcons: string[];
  } | null>(null);

  // Generate simple hash of content for staleness detection
  const generateContentHash = useCallback(() => {
    if (!contactInfo) return '';
    const contentString = JSON.stringify({ contactInfo, sections });
    // Simple hash: sum of char codes (fast, not cryptographic)
    let hash = 0;
    for (let i = 0; i < contentString.length; i++) {
      hash = ((hash << 5) - hash) + contentString.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }, [contactInfo, sections]);

  // Compute current hash directly (not as state to avoid async issues)
  const currentContentHash = generateContentHash();

  // Check if preview is stale (content changed since last generation)
  const isStale = lastContentHash !== '' && currentContentHash !== lastContentHash;

  // Icon validation with memoization
  const validateIcons = useCallback((): IconValidationResult => {
    // Skip validation if template doesn't support icons
    if (!supportsIcons) {
      return { valid: true, missingIcons: [] };
    }

    const currentHash = generateContentHash();

    // Return cached result if hash unchanged
    if (validationCache?.hash === currentHash) {
      return {
        valid: validationCache.valid,
        missingIcons: validationCache.missingIcons,
      };
    }

    // Perform validation
    const referencedIcons = extractReferencedIconFilenames(sections);
    const missingIcons: string[] = [];

    for (const iconFilename of referencedIcons) {
      // Check user-uploaded icons in registry
      const iconFile = iconRegistry?.getIconFile(iconFilename);
      if (iconFile) {
        continue;
      }

      // Check default/system icons
      if (DEFAULT_ICONS.has(iconFilename)) {
        continue;
      }

      // Icon not found in either location
      missingIcons.push(iconFilename);
    }

    const result = {
      hash: currentHash,
      valid: missingIcons.length === 0,
      missingIcons,
    };
    setValidationCache(result);

    return { valid: result.valid, missingIcons: result.missingIcons };
  }, [sections, iconRegistry, validationCache, generateContentHash, supportsIcons]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      // Clean up ref-tracked URL
      if (currentPreviewUrlRef.current) {
        URL.revokeObjectURL(currentPreviewUrlRef.current);
      }
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []); // Empty dependencies - only cleanup on unmount

  // Clear preview when resumeId changes in database mode
  // This ensures switching between different resumes shows the correct preview
  useEffect(() => {
    if (mode === 'database' && resumeId) {
      // Clear the current preview URL when switching to a different resume
      if (currentPreviewUrlRef.current) {
        URL.revokeObjectURL(currentPreviewUrlRef.current);
        currentPreviewUrlRef.current = null;
      }
      setPreviewUrl(null);
      setError(null);
    }
  }, [mode, resumeId]);

  const generatePreview = useCallback(async () => {
    // Return existing promise if generation already in progress
    if (generationPromiseRef.current) {
      return generationPromiseRef.current;
    }

    // Validation based on mode
    if (mode === 'live') {
      if (!contactInfo || !templateId || !processSections) {
        setError('Missing required parameters for live preview');
        return;
      }
    } else if (mode === 'database') {
      if (!resumeId) {
        setError('Missing resume ID');
        return;
      }
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Set 30-second timeout for preview generation
    const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 30000);

    const promise = (async () => {
      setIsGenerating(true);
      setError(null);

      try {
        let pdfBlob: Blob;

        if (mode === 'database') {
          // Database mode: Fetch pre-generated PDF from API
          const headers: HeadersInit = {};
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }

          const response = await fetch(`/api/resumes/${resumeId}/pdf`, {
            method: 'POST',
            headers,
            signal: abortControllerRef.current?.signal,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch preview' }));
            throw new Error(errorData.error || 'Failed to fetch preview');
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error('Unexpected response: Expected a PDF file');
          }

          pdfBlob = await response.blob();
        } else {
          // Live mode: Generate PDF from current editor state
          // Process sections to clean up icon paths
          // Non-null assertions safe here due to validation at function start
          const processedSections = processSections!(sections);

          // Create YAML data
          const yamlData = yaml.dump({
            contact_info: contactInfo,
            sections: processedSections,
          });

          // Build FormData
          const formData = new FormData();
          const yamlBlob = new Blob([yamlData], { type: 'application/x-yaml' });
          formData.append('yaml_file', yamlBlob, 'resume.yaml');
          formData.append('template', templateId!);

          // Add session ID for icon isolation
          const sessionId = getSessionId();
          formData.append('session_id', sessionId);

          // Attach referenced icons
          const referencedIcons = extractReferencedIconFilenames(sections);
          for (const iconFilename of referencedIcons) {
            const iconFile = iconRegistry?.getIconFile(iconFilename);
            if (iconFile) {
              formData.append('icons', iconFile, iconFilename);
            }
          }

          // Generate PDF with our abort controller
          pdfBlob = await generatePreviewPdf(formData, {
            signal: abortControllerRef.current?.signal,
          });
        }

        // Cleanup previous URL before creating new one
        // Use ref to avoid circular dependency in useCallback
        if (currentPreviewUrlRef.current) {
          URL.revokeObjectURL(currentPreviewUrlRef.current);
        }

        // Create new blob URL
        const newUrl = URL.createObjectURL(pdfBlob);
        currentPreviewUrlRef.current = newUrl;  // Track in ref
        setPreviewUrl(newUrl);
        setLastGenerated(new Date());
        setLastContentHash(currentContentHash);

        // Reset cache timeout
        if (cacheTimeoutRef.current) {
          clearTimeout(cacheTimeoutRef.current);
        }

        // Auto-clear cache after duration
        cacheTimeoutRef.current = setTimeout(() => {
          // Staleness detection handles freshness
        }, CACHE_DURATION_MS);

      } catch (err) {
        // Don't set error if request was aborted (expected behavior)
        if (err instanceof Error && err.name !== 'AbortError') {
          const errorMessage = err.message || 'Failed to generate preview';
          setError(errorMessage);
          console.error('Preview generation failed:', err);
        }
      } finally {
        clearTimeout(timeoutId);
        generationPromiseRef.current = null;
        abortControllerRef.current = null;
        setIsGenerating(false);
      }
    })();

    generationPromiseRef.current = promise;
    return promise;
  }, [
    mode,
    contactInfo,
    sections,
    templateId,
    iconRegistry,
    processSections,
    resumeId,
    currentContentHash,
    session,
  ]);

  // Debounced preview generation
  const debouncedGeneratePreview = useCallback((delay: number = 500): Promise<void> => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    return new Promise<void>((resolve) => {
      debounceTimeoutRef.current = setTimeout(async () => {
        await generatePreview();
        resolve();
      }, delay);
    });
  }, [generatePreview]);

  /**
   * Auto-refreshes preview if content is stale or no preview exists.
   *
   * IMPORTANT: previewUrl is intentionally omitted from dependency array.
   *
   * Why this is safe and correct:
   * 1. React state is NEVER stale - when this function executes, it reads
   *    the current value of previewUrl directly from state (!previewUrl check).
   * 2. Including previewUrl caused a cascade bug (commit 8418ef9):
   *    - Generate PDF → previewUrl changes → function recreates
   *    - Function recreation triggers re-render → generates AGAIN (double generation)
   * 3. The condition (!previewUrl) is evaluated at CALL TIME, not creation time,
   *    so it always uses the current state value (never stale).
   * 4. Deduplication (generationPromiseRef) prevents overlapping calls, but
   *    doesn't prevent sequential calls after first completes.
   *
   * This pattern follows React guidance for intentional dependency omissions when:
   * - State is read conditionally (not captured in closure)
   * - Function identity stability prevents cascading renders
   * - Behavior is correct without the dependency
   *
   * See commit 4135d6f for the bug fix that introduced this pattern.
   */
  const checkAndRefreshIfStale = useCallback(async () => {
    if ((isStale || !previewUrl) && !isGenerating) {
      await generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- previewUrl intentionally omitted (see comment above)
  }, [isStale, isGenerating, generatePreview]);

  const clearPreview = useCallback(() => {
    if (currentPreviewUrlRef.current) {
      URL.revokeObjectURL(currentPreviewUrlRef.current);
      currentPreviewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setLastGenerated(null);
    setLastContentHash('');
    setError(null);
    if (cacheTimeoutRef.current) {
      clearTimeout(cacheTimeoutRef.current);
    }
  }, []); // No dependencies - uses refs only

  return {
    previewUrl,
    isGenerating,
    error,
    lastGenerated,
    isStale,
    generatePreview,
    debouncedGeneratePreview,
    checkAndRefreshIfStale,
    validateIcons,
    clearPreview,
  };
}
