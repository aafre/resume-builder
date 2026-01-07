// src/hooks/editor/__tests__/useEditorActions.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEditorActions, UseEditorActionsProps } from '../useEditorActions';
import { validateLinkedInUrl } from '../../../services/validationService';
import { ContactInfo, Section } from '../../../types';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('js-yaml', () => ({
  default: {
    dump: vi.fn((data) => JSON.stringify(data)),
  },
}));

vi.mock('../../../services/templates', () => ({
  generateResume: vi.fn(),
}));

vi.mock('../../../utils/session', () => ({
  getSessionId: vi.fn(() => 'test-session-id'),
}));

vi.mock('../../../utils/iconExtractor', () => ({
  extractReferencedIconFilenames: vi.fn(() => []),
}));

vi.mock('../../../utils/sectionTypeChecker', () => ({
  isExperienceSection: vi.fn((section) => section.type === 'experience'),
  isEducationSection: vi.fn((section) => section.type === 'education'),
}));

import { toast } from 'react-hot-toast';
import { generateResume } from '../../../services/templates';
import { extractReferencedIconFilenames } from '../../../utils/iconExtractor';

// Test data
const mockContactInfo: ContactInfo = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  location: 'New York',
  linkedin: '',
  linkedin_display: '',
  social_links: [],
};

const mockSections: Section[] = [
  {
    name: 'Experience',
    type: 'experience',
    content: [
      {
        company: 'Test Corp',
        title: 'Developer',
        date: '2020-2023',
        description: 'Did stuff',
      },
    ],
  },
];

const mockOriginalTemplateData = {
  contactInfo: mockContactInfo,
  sections: mockSections,
};

describe('useEditorActions', () => {
  // Mock URL APIs
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = vi.fn();

  // Store original createElement for selective mocking
  const originalCreateElement = document.createElement.bind(document);
  let mockLinkClick: ReturnType<typeof vi.fn>;

  // Shared mock functions
  let mockSetContactInfo: ReturnType<typeof vi.fn>;
  let mockSetSections: ReturnType<typeof vi.fn>;
  let mockSaveBeforeAction: ReturnType<typeof vi.fn>;
  let mockIconRegistry: {
    getIconFile: ReturnType<typeof vi.fn>;
    clearRegistry: ReturnType<typeof vi.fn>;
  };
  let mockValidateIcons: ReturnType<typeof vi.fn>;
  let mockClearPreview: ReturnType<typeof vi.fn>;
  let mockGeneratePreview: ReturnType<typeof vi.fn>;
  let mockCheckAndRefreshIfStale: ReturnType<typeof vi.fn>;
  let mockOpenPreviewModal: ReturnType<typeof vi.fn>;
  let mockOpenStartFreshConfirm: ReturnType<typeof vi.fn>;
  let mockCloseStartFreshConfirm: ReturnType<typeof vi.fn>;
  let mockOpenDownloadCelebration: ReturnType<typeof vi.fn>;
  let mockMarkDownloadToastShown: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Initialize mocks
    mockSetContactInfo = vi.fn();
    mockSetSections = vi.fn();
    mockSaveBeforeAction = vi.fn().mockResolvedValue(true);
    mockIconRegistry = {
      getIconFile: vi.fn(() => null),
      clearRegistry: vi.fn(),
    };
    mockValidateIcons = vi.fn(() => ({ valid: true, missingIcons: [] }));
    mockClearPreview = vi.fn();
    mockGeneratePreview = vi.fn().mockResolvedValue(undefined);
    mockCheckAndRefreshIfStale = vi.fn().mockResolvedValue(undefined);
    mockOpenPreviewModal = vi.fn();
    mockOpenStartFreshConfirm = vi.fn();
    mockCloseStartFreshConfirm = vi.fn();
    mockOpenDownloadCelebration = vi.fn();
    mockMarkDownloadToastShown = vi.fn();

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

    // Mock document.body methods
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const createDefaultProps = (overrides?: Partial<UseEditorActionsProps>): UseEditorActionsProps => ({
    contactInfo: mockContactInfo,
    setContactInfo: mockSetContactInfo,
    sections: mockSections,
    setSections: mockSetSections,
    templateId: 'modern',
    supportsIcons: false,
    iconRegistry: mockIconRegistry,
    processSections: vi.fn((sections) => sections),
    saveBeforeAction: mockSaveBeforeAction,
    isAnonymous: false,
    hasShownDownloadToast: false,
    markDownloadToastShown: mockMarkDownloadToastShown,
    originalTemplateData: mockOriginalTemplateData,
    isLoadingFromUrl: false,
    validateIcons: mockValidateIcons,
    previewIsStale: false,
    clearPreview: mockClearPreview,
    generatePreview: mockGeneratePreview,
    checkAndRefreshIfStale: mockCheckAndRefreshIfStale,
    openPreviewModal: mockOpenPreviewModal,
    openStartFreshConfirm: mockOpenStartFreshConfirm,
    closeStartFreshConfirm: mockCloseStartFreshConfirm,
    openDownloadCelebration: mockOpenDownloadCelebration,
    ...overrides,
  });

  describe('initial state', () => {
    it('should return isDownloading as false initially', () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));
      expect(result.current.isDownloading).toBe(false);
    });

    it('should return loadingStartFresh as false initially', () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));
      expect(result.current.loadingStartFresh).toBe(false);
    });
  });

  describe('handleGenerateResume', () => {
    it('should call saveBeforeAction before generating', async () => {
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf']),
        fileName: 'resume.pdf',
      });

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('download PDF');
    });

    it('should not proceed if saveBeforeAction returns false', async () => {
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(generateResume).not.toHaveBeenCalled();
    });

    it('should validate LinkedIn URL if provided', async () => {
      const contactInfoWithInvalidLinkedIn = {
        ...mockContactInfo,
        linkedin: 'invalid-url',
      };

      const { result } = renderHook(() =>
        useEditorActions(createDefaultProps({ contactInfo: contactInfoWithInvalidLinkedIn }))
      );

      await act(async () => {
        result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalledWith(
        'Please enter a valid LinkedIn URL or leave it empty'
      );
      expect(generateResume).not.toHaveBeenCalled();
    });

    it('should validate icons for icon-supporting templates', async () => {
      const localValidateIcons = vi.fn(() => ({ valid: false, missingIcons: ['icon1.png'] }));

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            supportsIcons: true,
            validateIcons: localValidateIcons,
          })
        )
      );

      await act(async () => {
        result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(localValidateIcons).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
      expect(generateResume).not.toHaveBeenCalled();
    });

    it('should set isDownloading to true during download', async () => {
      // Use a deferred promise pattern that works with fake timers
      let resolveGenerate!: () => void;
      vi.mocked(generateResume).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveGenerate = () => resolve({ pdfBlob: new Blob(['pdf']), fileName: 'resume.pdf' });
          })
      );

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      // Start the download - don't await so we can check intermediate state
      let downloadPromise: Promise<void>;
      act(() => {
        downloadPromise = result.current.handleGenerateResume();
      });

      // After initiating, isDownloading should be true
      // Need to advance timers to let saveBeforeAction resolve
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.isDownloading).toBe(true);

      // Complete the download
      await act(async () => {
        resolveGenerate();
        await vi.runAllTimersAsync();
      });

      expect(result.current.isDownloading).toBe(false);
    });

    it('should download PDF successfully', async () => {
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf content']),
        fileName: 'john_doe_resume.pdf',
      });

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(generateResume).toHaveBeenCalled();
      expect(mockLinkClick).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Resume downloaded successfully!');
    });

    it('should show celebration modal for anonymous users on first download', async () => {
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf']),
        fileName: 'resume.pdf',
      });

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
            hasShownDownloadToast: false,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(mockMarkDownloadToastShown).toHaveBeenCalled();
      expect(mockOpenDownloadCelebration).toHaveBeenCalled();
    });

    it('should not show celebration modal if already shown', async () => {
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf']),
        fileName: 'resume.pdf',
      });

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
            hasShownDownloadToast: true,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(mockOpenDownloadCelebration).not.toHaveBeenCalled();
    });

    it('should not show celebration modal for authenticated users', async () => {
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf']),
        fileName: 'resume.pdf',
      });

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: false,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(mockOpenDownloadCelebration).not.toHaveBeenCalled();
    });

    it('should handle download errors gracefully', async () => {
      vi.mocked(generateResume).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalledWith('Resume generation failed: Network error');
      expect(result.current.isDownloading).toBe(false);
    });

    it('should deduplicate concurrent download requests', async () => {
      let resolveGenerate: () => void;
      const generatePromise = new Promise<{ pdfBlob: Blob; fileName: string }>((resolve) => {
        resolveGenerate = () => resolve({ pdfBlob: new Blob(['pdf']), fileName: 'resume.pdf' });
      });
      vi.mocked(generateResume).mockReturnValue(generatePromise);

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      // Start multiple downloads
      act(() => {
        result.current.handleGenerateResume();
        result.current.handleGenerateResume();
        result.current.handleGenerateResume();
      });

      // Complete the download
      await act(async () => {
        resolveGenerate!();
        await vi.runAllTimersAsync();
      });

      // generateResume should only be called once
      expect(generateResume).toHaveBeenCalledTimes(1);
    });

    it('should include icons in formData for icon-supporting templates', async () => {
      const mockIconFile = new File(['icon'], 'test-icon.png', { type: 'image/png' });
      vi.mocked(extractReferencedIconFilenames).mockReturnValue(['test-icon.png']);
      vi.mocked(generateResume).mockResolvedValue({
        pdfBlob: new Blob(['pdf']),
        fileName: 'resume.pdf',
      });

      const localIconRegistry = {
        getIconFile: vi.fn((filename: string) => (filename === 'test-icon.png' ? mockIconFile : null)),
        clearRegistry: vi.fn(),
      };

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            supportsIcons: true,
            iconRegistry: localIconRegistry,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(generateResume).toHaveBeenCalled();
      const formData = vi.mocked(generateResume).mock.calls[0][0] as FormData;
      expect(formData.get('template')).toBe('modern');
    });
  });

  describe('handleOpenPreview', () => {
    it('should call saveBeforeAction before opening preview', async () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('preview');
    });

    it('should not proceed if saveBeforeAction returns false', async () => {
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockOpenPreviewModal).not.toHaveBeenCalled();
    });

    it('should validate icons before opening preview', async () => {
      const localValidateIcons = vi.fn(() => ({ valid: false, missingIcons: ['icon.png'] }));

      const { result } = renderHook(() =>
        useEditorActions(createDefaultProps({ validateIcons: localValidateIcons }))
      );

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(localValidateIcons).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
      expect(mockOpenPreviewModal).not.toHaveBeenCalled();
    });

    it('should clear preview if stale before opening', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            previewIsStale: true,
          })
        )
      );

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockClearPreview).toHaveBeenCalled();
    });

    it('should not clear preview if not stale', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            previewIsStale: false,
          })
        )
      );

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockClearPreview).not.toHaveBeenCalled();
    });

    it('should open modal and refresh if stale', async () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleOpenPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockOpenPreviewModal).toHaveBeenCalled();
      expect(mockCheckAndRefreshIfStale).toHaveBeenCalled();
    });
  });

  describe('handleRefreshPreview', () => {
    it('should call saveBeforeAction before refreshing', async () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleRefreshPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('refresh preview');
    });

    it('should not proceed if saveBeforeAction returns false', async () => {
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleRefreshPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockGeneratePreview).not.toHaveBeenCalled();
    });

    it('should validate icons before refreshing', async () => {
      const localValidateIcons = vi.fn(() => ({ valid: false, missingIcons: ['icon.png'] }));

      const { result } = renderHook(() =>
        useEditorActions(createDefaultProps({ validateIcons: localValidateIcons }))
      );

      await act(async () => {
        await result.current.handleRefreshPreview();
        await vi.runAllTimersAsync();
      });

      expect(localValidateIcons).toHaveBeenCalled();
      expect(mockGeneratePreview).not.toHaveBeenCalled();
    });

    it('should call generatePreview when validation passes', async () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      await act(async () => {
        await result.current.handleRefreshPreview();
        await vi.runAllTimersAsync();
      });

      expect(mockGeneratePreview).toHaveBeenCalled();
    });
  });

  describe('handleStartFresh', () => {
    it('should open start fresh confirmation dialog', () => {
      const { result } = renderHook(() => useEditorActions(createDefaultProps()));

      act(() => {
        result.current.handleStartFresh();
      });

      expect(mockOpenStartFreshConfirm).toHaveBeenCalled();
    });
  });

  describe('confirmStartFresh', () => {
    it('should do nothing if originalTemplateData is null', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            originalTemplateData: null,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockSetContactInfo).not.toHaveBeenCalled();
    });

    it('should save before clearing for authenticated users with content', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: false,
            contactInfo: mockContactInfo,
            sections: mockSections,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockSaveBeforeAction).toHaveBeenCalledWith('start fresh');
    });

    it('should not save for anonymous users', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockSaveBeforeAction).not.toHaveBeenCalled();
    });

    it('should close dialog and abort if save fails', async () => {
      mockSaveBeforeAction.mockResolvedValue(false);

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: false,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockCloseStartFreshConfirm).toHaveBeenCalled();
      expect(mockSetContactInfo).not.toHaveBeenCalled();
    });

    it('should reset contact info to empty state', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockSetContactInfo).toHaveBeenCalledWith({
        name: '',
        location: '',
        email: '',
        phone: '',
        linkedin: '',
        linkedin_display: '',
        social_links: [],
      });
    });

    it('should reset sections to empty content', async () => {
      const originalTemplateData = {
        contactInfo: mockContactInfo,
        sections: [
          { name: 'Experience', type: 'experience', content: [{ company: 'Test' }] },
          { name: 'Summary', type: 'text', content: 'Some text' },
        ],
      };

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
            originalTemplateData,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockSetSections).toHaveBeenCalledWith([
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Summary', type: 'text', content: '' },
      ]);
    });

    it('should clear icon registry', async () => {
      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(mockIconRegistry.clearRegistry).toHaveBeenCalled();
    });

    it('should show success toast on completion', async () => {
      const { result } = renderHook(() =>
        useEditorActions(createDefaultProps({ isAnonymous: true }))
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(toast.success).toHaveBeenCalledWith('Template cleared successfully!');
    });

    it('should handle errors gracefully', async () => {
      const errorSetContactInfo = vi.fn(() => {
        throw new Error('State update failed');
      });

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            isAnonymous: true,
            setContactInfo: errorSetContactInfo,
          })
        )
      );

      await act(async () => {
        await result.current.confirmStartFresh();
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to clear template');
      expect(result.current.loadingStartFresh).toBe(false);
    });
  });

  describe('showMissingIconsDialog', () => {
    it('should show cloud load error for icons from cloud', async () => {
      const localValidateIcons = vi.fn(() => ({ valid: false, missingIcons: ['icon1.png'] }));

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            supportsIcons: true,
            validateIcons: localValidateIcons,
            isLoadingFromUrl: true,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalled();
      const errorCall = vi.mocked(toast.error).mock.calls[0][0];
      expect(errorCall).toContain('Unable to load');
      expect(errorCall).toContain('cloud storage');
    });

    it('should show detailed icon locations for regular missing icons', async () => {
      const sectionsWithIcons: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            { company: 'Test', title: 'Dev', date: '2020', description: 'Did stuff', icon: 'missing.png' },
          ],
        },
      ];

      const localValidateIcons = vi.fn(() => ({ valid: false, missingIcons: ['missing.png'] }));

      const { result } = renderHook(() =>
        useEditorActions(
          createDefaultProps({
            supportsIcons: true,
            sections: sectionsWithIcons,
            validateIcons: localValidateIcons,
            isLoadingFromUrl: false,
          })
        )
      );

      await act(async () => {
        await result.current.handleGenerateResume();
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalled();
      const errorCall = vi.mocked(toast.error).mock.calls[0][0];
      expect(errorCall).toContain('Missing Icons');
      expect(errorCall).toContain('Experience');
    });
  });
});

describe('validateLinkedInUrl', () => {
  it('should accept empty string', () => {
    expect(validateLinkedInUrl('')).toBe(true);
    expect(validateLinkedInUrl('   ')).toBe(true);
  });

  it('should accept valid LinkedIn profile URLs', () => {
    expect(validateLinkedInUrl('https://www.linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('http://linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://www.linkedin.com/in/john-doe')).toBe(true);
    expect(validateLinkedInUrl('https://www.linkedin.com/in/johndoe/')).toBe(true);
  });

  it('should accept LinkedIn public profile URLs', () => {
    expect(validateLinkedInUrl('https://www.linkedin.com/pub/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://linkedin.com/public-profile/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://linkedin.com/public-profile/pub/johndoe')).toBe(true);
  });

  it('should accept country-specific subdomains', () => {
    expect(validateLinkedInUrl('https://uk.linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://de.linkedin.com/in/johndoe')).toBe(true);
    expect(validateLinkedInUrl('https://mobile.linkedin.com/in/johndoe')).toBe(true);
  });

  it('should reject invalid LinkedIn URLs', () => {
    expect(validateLinkedInUrl('https://facebook.com/johndoe')).toBe(false);
    expect(validateLinkedInUrl('https://linkedin.com/company/example')).toBe(false);
    expect(validateLinkedInUrl('https://linkedin.com/jobs/123')).toBe(false);
    expect(validateLinkedInUrl('https://linkedin.com')).toBe(false);
    expect(validateLinkedInUrl('not-a-url')).toBe(false);
  });

  it('should reject usernames that are too short', () => {
    expect(validateLinkedInUrl('https://linkedin.com/in/ab')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(validateLinkedInUrl('HTTPS://WWW.LINKEDIN.COM/IN/JOHNDOE')).toBe(true);
    expect(validateLinkedInUrl('https://LinkedIn.com/IN/JohnDoe')).toBe(true);
  });
});
