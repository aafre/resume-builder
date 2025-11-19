import { useState, useEffect, useCallback, useRef } from "react";
import { ContactInfo, Section } from "../types";

interface AutoSaveData {
  contactInfo: ContactInfo | null;
  sections: Section[];
  iconRegistry?: any;
  timestamp: string;
}

interface RecoveredData {
  contactInfo: ContactInfo;
  sections: Section[];
  timestamp: Date;
}

interface UseAutoSaveOptions {
  contactInfo: ContactInfo | null;
  sections: Section[];
  originalTemplateData: {
    contactInfo: ContactInfo;
    sections: Section[];
  } | null;
  templateId: string | null;
  iconRegistry?: any; // Optional icon registry for future use
  debounceMs?: number;
  periodicSaveMs?: number;
}

interface UseAutoSaveReturn {
  saving: boolean;
  lastSaved: Date | null;
  error: boolean;
  saveManually: () => Promise<void>;
  triggerImmediateSave: () => Promise<void>;
  clearSave: () => void;
  loadSaved: () => Promise<RecoveredData | null>;
  recoveredData: RecoveredData | null;
}

/**
 * Hook to handle auto-save functionality with localStorage
 *
 * Features:
 * - Debounced saving (default 2s after last edit)
 * - Periodic backup (default every 30s)
 * - Change detection (only saves if data differs from original)
 * - Recovery on page load
 * - Save before page unload
 */
export const useAutoSave = ({
  contactInfo,
  sections,
  originalTemplateData,
  templateId,
  iconRegistry,
  debounceMs = 2000,
  periodicSaveMs = 30000,
}: UseAutoSaveOptions): UseAutoSaveReturn => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState(false);
  const [recoveredData, setRecoveredData] = useState<RecoveredData | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const periodicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate localStorage key
  const getAutoSaveKey = useCallback(() => {
    return `resume-builder-${templateId}-autosave`;
  }, [templateId]);

  // Check if data has changed from original template
  const hasDataChanged = useCallback((): boolean => {
    if (!originalTemplateData) return false;

    // Compare contact info
    if (
      JSON.stringify(contactInfo) !==
      JSON.stringify(originalTemplateData.contactInfo)
    ) {
      return true;
    }

    // Compare sections (excluding iconFile objects as they're not part of original data)
    const currentSectionsForComparison = sections.map((section) => {
      if (
        (section.type === "experience" || section.type === "education") &&
        Array.isArray(section.content)
      ) {
        return {
          ...section,
          content: section.content.map((item: any) => {
            const { iconFile, iconBase64, ...rest } = item;
            return rest;
          }),
        };
      } else if (
        section.type === "icon-list" &&
        Array.isArray(section.content)
      ) {
        return {
          ...section,
          content: section.content.map((item: any) => {
            const { iconFile, iconBase64, ...rest } = item;
            return rest;
          }),
        };
      }
      return section;
    });

    return (
      JSON.stringify(currentSectionsForComparison) !==
      JSON.stringify(originalTemplateData.sections)
    );
  }, [contactInfo, sections, originalTemplateData]);

  // Save to localStorage
  const saveToLocalStorage = useCallback(async () => {
    try {
      // Only save if data has changed from original template
      if (!hasDataChanged()) {
        return;
      }

      // Export icon registry data if available
      let iconRegistryData = undefined;
      if (iconRegistry && typeof iconRegistry.exportForStorage === "function") {
        iconRegistryData = await iconRegistry.exportForStorage();
      }

      const data: AutoSaveData = {
        contactInfo,
        sections,
        iconRegistry: iconRegistryData,
        timestamp: new Date().toISOString(),
      };

      // Store as JSON
      localStorage.setItem(getAutoSaveKey(), JSON.stringify(data));
      const savedTime = new Date();
      setLastSaved(savedTime);
      setError(false);
    } catch (err) {
      console.error("Failed to auto-save to localStorage:", err);
      setError(true);

      // Auto-retry after 5 seconds
      setTimeout(() => {
        if (contactInfo && sections.length > 0) {
          saveToLocalStorage();
        }
      }, 5000);
    }
  }, [contactInfo, sections, hasDataChanged, getAutoSaveKey, iconRegistry]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(async (): Promise<RecoveredData | null> => {
    try {
      const saved = localStorage.getItem(getAutoSaveKey());
      if (saved) {
        const decodedData: AutoSaveData = JSON.parse(saved);

        // Import icon registry data if it exists and iconRegistry is available
        if (
          decodedData.iconRegistry &&
          iconRegistry &&
          typeof iconRegistry.importFromStorage === "function"
        ) {
          await iconRegistry.importFromStorage(decodedData.iconRegistry);
        }

        return {
          contactInfo: decodedData.contactInfo!,
          sections: decodedData.sections,
          timestamp: new Date(decodedData.timestamp),
        };
      }
    } catch (err) {
      console.error("Failed to load from localStorage:", err);
    }
    return null;
  }, [getAutoSaveKey, iconRegistry]);

  // Clear auto-save
  const clearAutoSave = useCallback(() => {
    try {
      localStorage.removeItem(getAutoSaveKey());
      setLastSaved(null);
      setRecoveredData(null);
    } catch (err) {
      console.error("Failed to clear auto-save:", err);
    }
  }, [getAutoSaveKey]);

  // Manual save function
  const saveManually = useCallback(async () => {
    setSaving(true);
    await saveToLocalStorage();
    setSaving(false);
  }, [saveToLocalStorage]);

  // Check for recovered data on mount
  useEffect(() => {
    const checkRecoveredData = async () => {
      if (!templateId || !originalTemplateData) return;

      const savedData = await loadFromLocalStorage();
      if (savedData) {
        const timeDiff = new Date().getTime() - savedData.timestamp.getTime();

        // Only show recovery if saved within last 7 days
        if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
          setRecoveredData(savedData);
        }
      }
    };

    // Small delay to let template load first
    const timer = setTimeout(checkRecoveredData, 500);
    return () => clearTimeout(timer);
  }, [templateId, originalTemplateData, loadFromLocalStorage]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!contactInfo && sections.length === 0) return;
    if (!originalTemplateData) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      await saveToLocalStorage();
      setSaving(false);
    }, debounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [contactInfo, sections, originalTemplateData, saveToLocalStorage, debounceMs]);

  // Periodic auto-save backup
  useEffect(() => {
    periodicIntervalRef.current = setInterval(async () => {
      if (
        (contactInfo || sections.length > 0) &&
        originalTemplateData &&
        !saving
      ) {
        setSaving(true);
        await saveToLocalStorage();
        setSaving(false);
      }
    }, periodicSaveMs);

    return () => {
      if (periodicIntervalRef.current) {
        clearInterval(periodicIntervalRef.current);
      }
    };
  }, [contactInfo, sections, originalTemplateData, saving, saveToLocalStorage, periodicSaveMs]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if ((contactInfo || sections.length > 0) && originalTemplateData) {
        await saveToLocalStorage();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [contactInfo, sections, originalTemplateData, saveToLocalStorage]);

  // Trigger immediate save (bypassing debounce)
  const triggerImmediateSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaving(true);
    await saveToLocalStorage();
    setSaving(false);
  }, [saveToLocalStorage]);

  return {
    saving,
    lastSaved,
    error,
    saveManually,
    triggerImmediateSave,
    clearSave: clearAutoSave,
    loadSaved: loadFromLocalStorage,
    recoveredData,
  };
};
