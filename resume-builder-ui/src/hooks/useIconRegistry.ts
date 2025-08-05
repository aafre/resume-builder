import { useState, useCallback, useRef } from 'react';

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

  return {
    registerIcon,
    getIconFile,
    removeIcon,
    clearRegistry,
    getRegisteredFilenames,
    getRegistrySize,
  };
};