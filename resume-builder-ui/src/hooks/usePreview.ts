import { useState, useCallback, useRef, useEffect } from 'react';
import { generatePreviewPdf } from '../services/templates';
import { getSessionId } from '../utils/session';
import { extractReferencedIconFilenames } from '../utils/iconExtractor';
import yaml from 'js-yaml';

interface Section {
  name: string;
  type?: string;
  content: unknown;
}

interface ContactInfo {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedin_display?: string;
}

interface IconRegistry {
  getIconFile: (filename: string) => File | null;
}

interface UsePreviewOptions {
  contactInfo: ContactInfo | null;
  sections: Section[];
  templateId: string | null;
  iconRegistry: IconRegistry;
  processSections: (sections: Section[]) => Section[];
}

interface UsePreviewReturn {
  previewUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  lastGenerated: Date | null;
  isStale: boolean;
  generatePreview: () => Promise<void>;
  clearPreview: () => void;
}

const CACHE_DURATION_MS = 30000; // 30 seconds cache

export function usePreview({
  contactInfo,
  sections,
  templateId,
  iconRegistry,
  processSections,
}: UsePreviewOptions): UsePreviewReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [lastContentHash, setLastContentHash] = useState<string>('');

  // Cache management
  const cacheTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousUrlRef = useRef<string | null>(null);

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

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
    };
  }, [previewUrl]);

  const generatePreview = useCallback(async () => {
    if (!contactInfo || !templateId) {
      setError('Missing contact information or template');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Process sections to clean up icon paths
      const processedSections = processSections(sections);

      // Create YAML data
      const yamlData = yaml.dump({
        contact_info: contactInfo,
        sections: processedSections,
      });

      // Build FormData (same structure as generateResume)
      const formData = new FormData();
      const yamlBlob = new Blob([yamlData], { type: 'application/x-yaml' });
      formData.append('yaml_file', yamlBlob, 'resume.yaml');
      formData.append('template', templateId);

      // Add session ID for icon isolation
      const sessionId = getSessionId();
      formData.append('session_id', sessionId);

      // Attach referenced icons
      const referencedIcons = extractReferencedIconFilenames(sections);
      for (const iconFilename of referencedIcons) {
        const iconFile = iconRegistry.getIconFile(iconFilename);
        if (iconFile) {
          formData.append('icons', iconFile, iconFilename);
        }
      }

      // Generate PDF
      const pdfBlob = await generatePreviewPdf(formData);

      // Cleanup previous URL before creating new one
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = previewUrl;

      // Create new blob URL
      const newUrl = URL.createObjectURL(pdfBlob);
      setPreviewUrl(newUrl);
      setLastGenerated(new Date());
      setLastContentHash(currentContentHash);

      // Reset cache timeout
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }

      // Auto-clear cache after duration (but keep URL if modal is open)
      cacheTimeoutRef.current = setTimeout(() => {
        // We don't auto-clear the URL, but we could mark it as expired
        // The staleness detection handles freshness
      }, CACHE_DURATION_MS);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(errorMessage);
      console.error('Preview generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [contactInfo, sections, templateId, iconRegistry, processSections, previewUrl]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setLastGenerated(null);
    setLastContentHash('');
    setError(null);
    if (cacheTimeoutRef.current) {
      clearTimeout(cacheTimeoutRef.current);
    }
  }, [previewUrl]);

  return {
    previewUrl,
    isGenerating,
    error,
    lastGenerated,
    isStale,
    generatePreview,
    clearPreview,
  };
}
