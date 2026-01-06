// src/hooks/editor/__tests__/useFileOperations.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileOperations, UseFileOperationsProps } from '../useFileOperations';
import { Section, ContactInfo } from '../../../types';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock yamlService
vi.mock('../../../services/yamlService', () => ({
  exportResumeAsYAML: vi.fn(),
  importResumeFromYAML: vi.fn(),
  processSectionsForExport: vi.fn((sections) => sections),
}));

// Mock iconExtractor
vi.mock('../../../utils/iconExtractor', () => ({
  extractReferencedIconFilenames: vi.fn(() => []),
}));

import { toast } from 'react-hot-toast';
import { exportResumeAsYAML, importResumeFromYAML } from '../../../services/yamlService';
import { extractReferencedIconFilenames } from '../../../utils/iconExtractor';

describe('useFileOperations', () => {
  // Test fixtures
  const mockContactInfo: ContactInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    location: 'New York, NY',
  };

  const mockSections: Section[] = [
    { name: 'Summary', type: 'text', content: 'Professional summary...' },
    { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'React'] },
  ];

  // Shared mock functions
  let mockSetContactInfo: ReturnType<typeof vi.fn>;
  let mockSetSections: ReturnType<typeof vi.fn>;
  let mockSaveBeforeAction: ReturnType<typeof vi.fn>;
  let mockSetOriginalTemplateData: ReturnType<typeof vi.fn>;
  let mockSetIsLoadingFromUrl: ReturnType<typeof vi.fn>;
  let mockSetPendingImportFile: ReturnType<typeof vi.fn>;
  let mockOpenImportConfirm: ReturnType<typeof vi.fn>;
  let mockCloseImportConfirm: ReturnType<typeof vi.fn>;
  let mockIconRegistry: {
    exportIconsForYAML: ReturnType<typeof vi.fn>;
    importIconsFromYAML: ReturnType<typeof vi.fn>;
  };

  // Mock URL APIs
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = vi.fn();

  // Store original createElement for selective mocking
  const originalCreateElement = document.createElement.bind(document);
  let mockLinkClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockSetContactInfo = vi.fn();
    mockSetSections = vi.fn();
    mockSaveBeforeAction = vi.fn().mockResolvedValue(true);
    mockSetOriginalTemplateData = vi.fn();
    mockSetIsLoadingFromUrl = vi.fn();
    mockSetPendingImportFile = vi.fn();
    mockOpenImportConfirm = vi.fn();
    mockCloseImportConfirm = vi.fn();
    mockIconRegistry = {
      exportIconsForYAML: vi.fn().mockResolvedValue({}),
      importIconsFromYAML: vi.fn().mockResolvedValue(undefined),
    };

    // Mock URL APIs
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.createElement only for 'a' elements (download links)
    mockLinkClick = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockLinkClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tagName);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const createDefaultProps = (overrides?: Partial<UseFileOperationsProps>): UseFileOperationsProps => ({
    contactInfo: mockContactInfo,
    setContactInfo: mockSetContactInfo,
    sections: mockSections,
    setSections: mockSetSections,
    iconRegistry: mockIconRegistry,
    saveBeforeAction: mockSaveBeforeAction,
    isAnonymous: false,
    supportsIcons: true,
    setOriginalTemplateData: mockSetOriginalTemplateData,
    setIsLoadingFromUrl: mockSetIsLoadingFromUrl,
    pendingImportFile: null,
    setPendingImportFile: mockSetPendingImportFile,
    openImportConfirm: mockOpenImportConfirm,
    closeImportConfirm: mockCloseImportConfirm,
    ...overrides,
  });

  describe('Initial State', () => {
    it('should initialize loadingSave to false', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));
      expect(result.current.loadingSave).toBe(false);
    });

    it('should initialize loadingLoad to false', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));
      expect(result.current.loadingLoad).toBe(false);
    });

    it('should provide fileInputRef', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));
      expect(result.current.fileInputRef).toBeDefined();
      expect(result.current.fileInputRef.current).toBeNull();
    });
  });

  describe('handleExportYAML', () => {
    it('should call saveBeforeAction before export', async () => {
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: new Blob(['test']),
        iconCount: 0,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        // Advance past the delay
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('export YAML');
    });

    it('should not export if saveBeforeAction returns false', async () => {
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        await result.current.handleExportYAML();
      });

      expect(exportResumeAsYAML).not.toHaveBeenCalled();
    });

    it('should set loadingSave during export', async () => {
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: new Blob(['test']),
        iconCount: 0,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      // Start export (don't await)
      let exportPromise: Promise<void>;
      act(() => {
        exportPromise = result.current.handleExportYAML();
      });

      // Loading should be true after saveBeforeAction resolves
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.loadingSave).toBe(true);

      // Complete the export
      await act(async () => {
        await vi.advanceTimersByTimeAsync(900);
        await exportPromise!;
      });

      expect(result.current.loadingSave).toBe(false);
    });

    it('should show success toast without icon count', async () => {
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: new Blob(['test']),
        iconCount: 0,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(toast.success).toHaveBeenCalledWith('Resume saved successfully!');
    });

    it('should show success toast with icon count (singular)', async () => {
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: new Blob(['test']),
        iconCount: 1,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(toast.success).toHaveBeenCalledWith('Resume saved successfully with 1 embedded icon!');
    });

    it('should show success toast with icon count (plural)', async () => {
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: new Blob(['test']),
        iconCount: 3,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(toast.success).toHaveBeenCalledWith('Resume saved successfully with 3 embedded icons!');
    });

    it('should trigger file download', async () => {
      const mockBlob = new Blob(['yaml content']);
      vi.mocked(exportResumeAsYAML).mockResolvedValue({
        blob: mockBlob,
        iconCount: 0,
      });

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should show error toast on export failure', async () => {
      vi.mocked(exportResumeAsYAML).mockRejectedValue(new Error('Export failed'));

      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      await act(async () => {
        const exportPromise = result.current.handleExportYAML();
        await vi.advanceTimersByTimeAsync(1000);
        await exportPromise;
      });

      expect(toast.error).toHaveBeenCalledWith('Save failed. Check browser settings and try again.');
      expect(result.current.loadingSave).toBe(false);
    });
  });

  describe('handleFileInputChange', () => {
    it('should open import confirm dialog with file', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      const mockFile = new File(['test content'], 'resume.yaml', { type: 'application/x-yaml' });
      const mockEvent = {
        target: {
          files: [mockFile],
          value: 'C:\\fakepath\\resume.yaml',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent);
      });

      expect(mockOpenImportConfirm).toHaveBeenCalledWith(mockFile);
    });

    it('should reset file input value after selection', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      const mockEvent = {
        target: {
          files: [new File(['test'], 'test.yaml')],
          value: 'C:\\fakepath\\test.yaml',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent);
      });

      expect(mockEvent.target.value).toBe('');
    });

    it('should do nothing if no file selected', () => {
      const { result } = renderHook(() => useFileOperations(createDefaultProps()));

      const mockEvent = {
        target: {
          files: [],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent);
      });

      expect(mockOpenImportConfirm).not.toHaveBeenCalled();
    });
  });

  describe('confirmImportYAML', () => {
    const createMockFile = (content: string) =>
      new File([content], 'resume.yaml', { type: 'application/x-yaml' });

    // Helper to mock FileReader
    const mockFileReader = (content: string) => {
      const originalFileReader = global.FileReader;
      class MockFileReader {
        result: string | null = null;
        onload: ((e: any) => void) | null = null;
        onerror: (() => void) | null = null;

        readAsText() {
          setTimeout(() => {
            this.result = content;
            if (this.onload) {
              this.onload({ target: { result: content } });
            }
          }, 0);
        }
      }
      global.FileReader = MockFileReader as any;
      return () => {
        global.FileReader = originalFileReader;
      };
    };

    it('should do nothing if no pending file', async () => {
      const { result } = renderHook(() =>
        useFileOperations(createDefaultProps({ pendingImportFile: null }))
      );

      await act(async () => {
        await result.current.confirmImportYAML();
      });

      expect(mockCloseImportConfirm).not.toHaveBeenCalled();
    });

    it('should close import confirm dialog', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(createDefaultProps({ pendingImportFile: mockFile }))
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockCloseImportConfirm).toHaveBeenCalled();
      cleanup();
    });

    it('should save before import for authenticated users with content', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: false,
            contactInfo: mockContactInfo,
            sections: mockSections,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('import YAML');
      cleanup();
    });

    it('should not save before import for anonymous users', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockSaveBeforeAction).not.toHaveBeenCalled();
      cleanup();
    });

    it('should abort import if saveBeforeAction returns false', async () => {
      const mockFile = createMockFile('test: yaml');
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: false,
          })
        )
      );

      await act(async () => {
        await result.current.confirmImportYAML();
      });

      expect(mockSetPendingImportFile).toHaveBeenCalledWith(null);
      expect(importResumeFromYAML).not.toHaveBeenCalled();
    });

    it('should update contact info and sections on successful import', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      const importedContactInfo = { ...mockContactInfo, name: 'Jane Doe' };
      const importedSections = [{ name: 'New Section', type: 'text', content: 'New content' }];

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: importedContactInfo,
        sections: importedSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockSetContactInfo).toHaveBeenCalledWith(importedContactInfo);
      expect(mockSetSections).toHaveBeenCalledWith(importedSections);
      cleanup();
    });

    it('should show success toast with icon count', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 2,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(toast.success).toHaveBeenCalledWith('Resume loaded successfully with 2 icons!');
      cleanup();
    });

    it('should warn about icons when template does not support them', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });
      vi.mocked(extractReferencedIconFilenames).mockReturnValue(['icon1.png', 'icon2.png']);

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
            supportsIcons: false,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(toast).toHaveBeenCalledWith(
        expect.stringContaining("This template doesn't support icons"),
        expect.objectContaining({ duration: 8000, icon: '⚠️' })
      );
      cleanup();
    });

    it('should show error toast on parse failure', async () => {
      const mockFile = createMockFile('invalid: yaml');
      const cleanup = mockFileReader('invalid: yaml');

      vi.mocked(importResumeFromYAML).mockRejectedValue(new Error('Parse error'));

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid file format. Please upload a valid resume file.');
      expect(result.current.loadingLoad).toBe(false);
      cleanup();
    });

    it('should update originalTemplateData after import', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockSetOriginalTemplateData).toHaveBeenCalledWith({
        contactInfo: mockContactInfo,
        sections: mockSections,
      });
      cleanup();
    });

    it('should enable auto-save after import', async () => {
      const mockFile = createMockFile('test: yaml');
      const cleanup = mockFileReader('test: yaml');

      vi.mocked(importResumeFromYAML).mockResolvedValue({
        contactInfo: mockContactInfo,
        sections: mockSections,
        iconCount: 0,
      });

      const { result } = renderHook(() =>
        useFileOperations(
          createDefaultProps({
            pendingImportFile: mockFile,
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        const importPromise = result.current.confirmImportYAML();
        await vi.advanceTimersByTimeAsync(1200);
        await vi.runAllTimersAsync();
        await importPromise;
      });

      expect(mockSetIsLoadingFromUrl).toHaveBeenCalledWith(false);
      cleanup();
    });
  });

  describe('Function Stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useFileOperations(createDefaultProps()));

      const firstHandleExportYAML = result.current.handleExportYAML;
      const firstHandleFileInputChange = result.current.handleFileInputChange;

      rerender();

      expect(result.current.handleExportYAML).toBe(firstHandleExportYAML);
      expect(result.current.handleFileInputChange).toBe(firstHandleFileInputChange);
    });
  });
});
