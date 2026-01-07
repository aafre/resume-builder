import { useState, useEffect, useCallback, useRef } from 'react';
import { ContactInfo, Section, SaveStatus } from '../types';
import { apiClient, ApiError, AuthError } from '../lib/api-client';

interface ResumeData {
  contact_info: ContactInfo;
  sections: Section[];
  template_id: string;
}

interface IconRegistry {
  [filename: string]: File | string; // File object or base64 string
}

interface UseCloudSaveOptions {
  resumeId: string | null;
  resumeData: ResumeData;
  icons: IconRegistry;
  enabled: boolean; // Only save if user is authenticated
  session: any | null; // Session from AuthContext
}

interface UseCloudSaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  saveNow: () => Promise<string | null>; // Returns resume ID on success
  resumeId: string | null;
  cancelPendingSave: () => void; // Cancel pending saves during auth transitions
}

const DEBOUNCE_DELAY = 800; // 800ms - Google Docs-like speed

export function useCloudSave({
  resumeId,
  resumeData,
  icons,
  enabled,
  session
}: UseCloudSaveOptions): UseCloudSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(resumeId);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  // Function to convert File or base64 to base64 string
  const iconToBase64 = async (icon: File | string): Promise<string> => {
    if (typeof icon === 'string') {
      return icon; // Already base64
    }

    // Convert File to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(icon);
    });
  };

  // Function to save to cloud
  const saveToCloud = useCallback(async (): Promise<string | null> => {
    if (!enabled) {
      console.log('Cloud save disabled (user not authenticated)');
      return null;
    }

    try {
      setSaveStatus('saving');

      // Use session from AuthContext instead of calling getSession()
      if (!session) {
        throw new Error('No active session');
      }

      // Validate icon sizes and convert to base64 (parallel for performance)
      const MAX_ICON_SIZE = 50 * 1024; // 50KB (matches database constraint)

      // Start all conversions in parallel using Promise.all()
      const iconPromises = Object.entries(icons).map(async ([filename, iconData]) => {
        // Get file size
        let fileSize = 0;
        if (iconData instanceof File) {
          fileSize = iconData.size;
        } else if (typeof iconData === 'string') {
          // Estimate size from base64 string (approximate)
          // Base64 is ~33% larger than binary, so decode to get actual size
          const base64Data = iconData.split(',')[1] || iconData;
          fileSize = Math.ceil((base64Data.length * 3) / 4);
        }

        // Skip oversized icons
        if (fileSize > MAX_ICON_SIZE) {
          const sizeKB = Math.round(fileSize / 1024);
          console.warn(`Skipping oversized icon: ${filename} (${sizeKB}KB exceeds 50KB limit)`);
          // Note: We skip silently here since validation should have happened in registerIcon
          // This is a safety net for edge cases
          return null; // Return null for oversized icons
        }

        // Convert to base64 (runs in parallel for all icons)
        return {
          filename,
          data: await iconToBase64(iconData)
        };
      });

      // Wait for all conversions to complete
      const iconResults = await Promise.all(iconPromises);

      // Filter out null results (oversized icons)
      const iconsArray = iconResults.filter(result => result !== null) as Array<{ filename: string; data: string }>;

      // Generate smart title
      const generateTitle = (): string => {
        // Priority 1: First job title from Experience section
        const experienceSection = resumeData.sections.find(
          s => s.type === 'experience'
        );
        if (experienceSection && Array.isArray(experienceSection.content) &&
            experienceSection.content.length > 0) {
          const firstJob = experienceSection.content[0];
          if (typeof firstJob === 'object' && firstJob !== null && 'title' in firstJob && firstJob.title) {
            return firstJob.title; // e.g., "Senior Product Manager"
          }
        }

        // Priority 2: Name + Template
        if (resumeData.contact_info.name) {
          const templateName = resumeData.template_id
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          return `${resumeData.contact_info.name} - ${templateName}`;
        }

        // Priority 3: Fallback to date
        const now = new Date();
        return `Resume - ${now.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })}`;
      };

      // Prepare request payload
      const payload = {
        id: currentResumeId,
        title: generateTitle(),
        template_id: resumeData.template_id,
        contact_info: resumeData.contact_info,
        sections: resumeData.sections,
        icons: iconsArray
      };

      // Safety check: Prevent creating duplicates when editing existing resume
      if (!currentResumeId && window.location.pathname.includes('/editor/')) {
        console.error('Attempted to save with null ID while on editor page with resumeId in URL');
        setSaveStatus('error');
        return null;
      }

      // Save to backend using centralized API client
      // (handles auth automatically, 401/403 interceptor, and error handling)
      const result = await apiClient.post('/api/resumes', payload);

      // Update resume ID if this was a new resume
      if (!currentResumeId && result.resume_id) {
        setCurrentResumeId(result.resume_id);
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      console.log('Cloud save successful:', result.resume_id);

      return result.resume_id;

    } catch (error) {
      console.error('Cloud save failed:', error);
      setSaveStatus('error');

      // Re-throw RESUME_LIMIT_REACHED errors for handling in UI
      if (error instanceof ApiError && error.data?.error_code === 'RESUME_LIMIT_REACHED') {
        throw new Error('RESUME_LIMIT_REACHED');
      }

      // If auth error, clear debounce timer to prevent retry loop
      if (error instanceof AuthError) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      }

      // AuthError (401/403) is already handled by apiClient (sign-out + toast)
      // Just return null for other errors
      return null;
    }
  }, [enabled, currentResumeId, resumeData, icons, session]);

  // Manual save function (bypasses debounce)
  const saveNow = useCallback(async (): Promise<string | null> => {
    // Cancel any pending debounced save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    return await saveToCloud();
  }, [saveToCloud]);

  // Cancel any pending save and reset status (used during auth transitions)
  const cancelPendingSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSaveStatus('saved'); // Reset to prevent beforeunload warning
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Calculate icon metadata for robust change detection
    // Include size to detect icon replacements with same filename
    const iconMetadata = Object.entries(icons).reduce((acc, [filename, iconData]) => {
      let size = 0;
      if (iconData instanceof File) {
        size = iconData.size;
      } else if (typeof iconData === 'string') {
        // Estimate size from base64 string
        const base64Data = iconData.split(',')[1] || iconData;
        size = Math.ceil((base64Data.length * 3) / 4);
      }
      acc[filename] = size;
      return acc;
    }, {} as Record<string, number>);

    // Serialize current data for comparison
    const currentData = JSON.stringify({
      contact_info: resumeData.contact_info,
      sections: resumeData.sections,
      iconMetadata  // Use metadata (filename + size) instead of just filenames
    });

    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) {
      return;
    }

    previousDataRef.current = currentData;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    // Note: saveToCloud() will set status to 'saving' when it actually starts (after debounce)
    debounceTimerRef.current = setTimeout(() => {
      console.log('Debounced cloud save triggered');
      saveToCloud().catch(error => {
        console.error('Debounced save error:', error);
      });
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, resumeData, icons, saveToCloud]);

  // Save on blur (when user switches tabs)
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden && saveStatus !== 'saving') {
        console.log('Tab blur - triggering cloud save');
        saveNow().catch(error => {
          console.error('Blur save error:', error);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, saveStatus, saveNow]);

  return {
    saveStatus,
    lastSaved,
    saveNow,
    resumeId: currentResumeId,
    cancelPendingSave
  };
}
