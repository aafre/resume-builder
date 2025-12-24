import { useState, useCallback, useRef } from 'react';
import { IconExportData, IconStorageData } from '../types/iconTypes';

interface IconRegistryEntry {
  file: File;
  filename: string;
  uploadedAt: Date;
}

interface IconRegistry {
  [filename: string]: IconRegistryEntry;
}

interface UseIconRegistryReturn {
  // Register a new icon file and get the generated filename
  registerIcon: (file: File) => string;
  // Get file object by filename
  getIconFile: (filename: string) => File | null;
  // Remove icon from registry
  removeIcon: (filename: string) => void;
  // Clear all icons
  clearRegistry: () => void;
  // Get all registered filenames
  getRegisteredFilenames: () => string[];
  // Get registry size
  getRegistrySize: () => number;
  // Export methods for YAML portability
  exportIconsForYAML: (filenames?: string[]) => Promise<IconExportData>;
  importIconsFromYAML: (iconData: IconExportData) => Promise<void>;
  // Storage methods for localStorage persistence
  exportForStorage: () => Promise<IconStorageData>;
  importFromStorage: (storageData: IconStorageData) => Promise<void>;
}

/**
 * Central registry hook for managing all uploaded icon files
 * Provides a single source of truth for icon file storage and retrieval
 */
export const useIconRegistry = (): UseIconRegistryReturn => {
  const [registry, setRegistry] = useState<IconRegistry>({});
  const usedFilenames = useRef<Set<string>>(new Set());

  // Generate unique filename for uploaded file
  const generateUniqueFilename = useCallback((originalFile: File): string => {
    const fileExtension = originalFile.name.split('.').pop()?.toLowerCase() || 'png';
    let filename: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      filename = `${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      attempts++;
    } while (usedFilenames.current.has(filename) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      // Fallback with timestamp if we can't generate unique name
      filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    }

    return filename;
  }, []);

  // Register a new icon file
  const registerIcon = useCallback((file: File): string => {
    // Validate file size (50KB limit matches database constraint)
    const MAX_ICON_SIZE_BYTES = 50 * 1024; // 50KB

    if (file.size > MAX_ICON_SIZE_BYTES) {
      const sizeKB = Math.round(file.size / 1024);
      const maxKB = Math.round(MAX_ICON_SIZE_BYTES / 1024);
      throw new Error(
        `Icon "${file.name}" is too large (${sizeKB} KB). Maximum allowed size is ${maxKB} KB. Please compress the image or use a smaller file.`
      );
    }

    const filename = generateUniqueFilename(file);

    const entry: IconRegistryEntry = {
      file,
      filename,
      uploadedAt: new Date(),
    };

    setRegistry(prev => ({
      ...prev,
      [filename]: entry,
    }));

    usedFilenames.current.add(filename);
    return filename;
  }, [generateUniqueFilename]);

  // Get file object by filename
  const getIconFile = useCallback((filename: string): File | null => {
    const entry = registry[filename];
    return entry ? entry.file : null;
  }, [registry]);

  // Remove icon from registry
  const removeIcon = useCallback((filename: string): void => {
    setRegistry(prev => {
      const newRegistry = { ...prev };
      delete newRegistry[filename];
      return newRegistry;
    });

    usedFilenames.current.delete(filename);
  }, []);

  // Clear all icons
  const clearRegistry = useCallback((): void => {
    setRegistry({});
    usedFilenames.current.clear();
  }, []);

  // Get all registered filenames
  const getRegisteredFilenames = useCallback((): string[] => {
    return Object.keys(registry);
  }, [registry]);

  // Get registry size
  const getRegistrySize = useCallback((): number => {
    return Object.keys(registry).length;
  }, [registry]);

  // Convert File to base64 data URL
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Convert base64 data URL back to File
  const base64ToFile = useCallback((base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  // Export icons for YAML portability
  const exportIconsForYAML = useCallback(async (filenames?: string[]): Promise<IconExportData> => {
    const targetFilenames = filenames || Object.keys(registry);
    const exportData: IconExportData = {};

    for (const filename of targetFilenames) {
      const entry = registry[filename];
      if (entry) {
        try {
          const base64Data = await fileToBase64(entry.file);
          exportData[filename] = {
            data: base64Data,
            type: entry.file.type,
            size: entry.file.size,
            uploadedAt: entry.uploadedAt.toISOString(),
          };
        } catch (error) {
          console.warn(`Failed to export icon ${filename}:`, error);
        }
      }
    }

    return exportData;
  }, [registry, fileToBase64]);

  // Import icons from YAML data
  const importIconsFromYAML = useCallback(async (iconData: IconExportData): Promise<void> => {
    const importedRegistry: IconRegistry = {};

    for (const [filename, iconItem] of Object.entries(iconData)) {
      try {
        const file = base64ToFile(iconItem.data, filename);
        importedRegistry[filename] = {
          file,
          filename,
          uploadedAt: new Date(iconItem.uploadedAt),
        };
        usedFilenames.current.add(filename);
      } catch (error) {
        console.warn(`Failed to import icon ${filename}:`, error);
      }
    }

    // Merge with existing registry
    setRegistry(prev => ({
      ...prev,
      ...importedRegistry,
    }));
  }, [base64ToFile]);

  // Export for localStorage storage
  const exportForStorage = useCallback(async (): Promise<IconStorageData> => {
    const iconData = await exportIconsForYAML();
    return {
      icons: iconData,
      version: '1.0',
      timestamp: new Date().toISOString(),
    };
  }, [exportIconsForYAML]);

  // Import from localStorage storage
  const importFromStorage = useCallback(async (storageData: IconStorageData): Promise<void> => {
    if (storageData.icons) {
      await importIconsFromYAML(storageData.icons);
    }
  }, [importIconsFromYAML]);

  return {
    registerIcon,
    getIconFile,
    removeIcon,
    clearRegistry,
    getRegisteredFilenames,
    getRegistrySize,
    exportIconsForYAML,
    importIconsFromYAML,
    exportForStorage,
    importFromStorage,
  };
};