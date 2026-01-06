// src/hooks/editor/__tests__/useResumeLoader.test.ts
// Tests for useResumeLoader hook

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useResumeLoader, UseResumeLoaderProps } from '../useResumeLoader';
import { ContactInfo, Section } from '../../../types';
import { Session } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import * as templates from '../../../services/templates';
import * as apiClientModule from '../../../lib/api-client';
import * as yamlModule from 'js-yaml';

// Mock modules
vi.mock('react-hot-toast');
vi.mock('../../../services/templates');
vi.mock('../../../lib/api-client');
vi.mock('js-yaml');
vi.mock('../../../lib/supabase', () => ({
  supabase: {},
}));
vi.mock('../../../utils/sectionMigration', () => ({
  migrateLegacySections: vi.fn((sections) => sections),
}));
vi.mock('../../../services/yamlService', () => ({
  processSectionsForExport: vi.fn((sections) => sections),
}));

/**
 * Helper to create default mock props
 */
const createMockProps = (overrides?: Partial<UseResumeLoaderProps>): UseResumeLoaderProps => {
  const mockIconRegistry = {
    clearRegistry: vi.fn(),
    registerIconWithFilename: vi.fn(),
    registerIcon: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    getRegisteredFilenames: vi.fn(),
    getRegistrySize: vi.fn(),
    exportIconsForYAML: vi.fn(),
    importIconsFromYAML: vi.fn(),
    exportForStorage: vi.fn(),
    importFromStorage: vi.fn(),
  };

  return {
    contactInfo: null,
    sections: [],
    setContactInfo: vi.fn(),
    setSections: vi.fn(),
    templateId: null,
    setTemplateId: vi.fn(),
    setSupportsIcons: vi.fn(),
    setOriginalTemplateData: vi.fn(),
    setLoading: vi.fn(),
    setLoadingError: vi.fn(),
    authLoading: false,
    anonMigrationInProgress: false,
    session: { user: { id: 'user-123' } } as Session,
    iconRegistry: mockIconRegistry,
    resumeIdFromUrl: undefined,
    searchParams: new URLSearchParams(),
    setShowAIWarning: vi.fn(),
    setAIWarnings: vi.fn(),
    setAIConfidence: vi.fn(),
    isSigningInFromTour: false,
    ...overrides,
  };
};

describe('useResumeLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state when no resumeIdFromUrl', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      expect(result.current.isLoadingFromUrl).toBe(false);
      expect(result.current.hasLoadedFromUrl).toBe(false);
      expect(result.current.cloudResumeId).toBe(null);
    });

    it('should initialize with loading state when resumeIdFromUrl is present', () => {
      const props = createMockProps({ resumeIdFromUrl: 'resume-123' });
      const { result } = renderHook(() => useResumeLoader(props));

      expect(result.current.isLoadingFromUrl).toBe(true);
      expect(result.current.hasLoadedFromUrl).toBe(false);
      expect(result.current.cloudResumeId).toBe('resume-123');
    });

    it('should expose required methods', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      expect(typeof result.current.loadTemplate).toBe('function');
      expect(typeof result.current.loadResumeFromCloud).toBe('function');
      expect(typeof result.current.setCloudResumeId).toBe('function');
    });
  });

  describe('loadTemplate', () => {
    it('should load template data successfully', async () => {
      const mockYaml = `
contact_info:
  name: John Doe
  email: john@example.com
sections:
  - name: Experience
    type: experience
    content: []
`;

      const mockContactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const mockSections: Section[] = [
        { name: 'Experience', type: 'experience', content: [] },
      ];

      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: mockYaml,
        supportsIcons: false,
      });

      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: mockContactInfo,
        sections: mockSections,
      });

      const props = createMockProps({ templateId: 'modern' });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadTemplate('modern');
      });

      expect(templates.fetchTemplate).toHaveBeenCalledWith('modern');
      expect(props.setContactInfo).toHaveBeenCalledWith(mockContactInfo);
      expect(props.setSections).toHaveBeenCalled();
      expect(props.setSupportsIcons).toHaveBeenCalledWith(false);
      expect(props.setOriginalTemplateData).toHaveBeenCalled();
      expect(props.setLoading).toHaveBeenCalledWith(true);
      expect(props.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle template loading errors', async () => {
      vi.spyOn(templates, 'fetchTemplate').mockRejectedValue(new Error('Network error'));

      const props = createMockProps({ templateId: 'modern' });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadTemplate('modern');
      });

      expect(props.setLoadingError).toHaveBeenCalledWith(
        'Failed to load template. Please check your connection and try again.'
      );
      expect(props.setLoading).toHaveBeenCalledWith(false);
    });

    it('should load template automatically when templateId changes', async () => {
      const mockYaml = 'contact_info: {}\nsections: []';

      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: mockYaml,
        supportsIcons: false,
      });

      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const baseProps = createMockProps({ templateId: 'modern' });
      const { rerender } = renderHook(
        ({ templateId }) => useResumeLoader({ ...baseProps, templateId }),
        { initialProps: { templateId: 'modern' } }
      );

      // Wait for effect to run
      await waitFor(() => {
        expect(templates.fetchTemplate).toHaveBeenCalledWith('modern');
      });

      // Change templateId
      rerender({ templateId: 'classic' });

      await waitFor(() => {
        expect(templates.fetchTemplate).toHaveBeenCalledWith('classic');
      });
    });

    it('should not load template when resumeIdFromUrl is present', async () => {
      const props = createMockProps({
        templateId: 'modern',
        resumeIdFromUrl: 'resume-123',
      });

      renderHook(() => useResumeLoader(props));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(templates.fetchTemplate).not.toHaveBeenCalled();
    });

    it('should not load template when editor already has data', async () => {
      const props = createMockProps({
        templateId: 'modern',
        contactInfo: { name: 'Existing', email: 'existing@example.com' },
        sections: [{ name: 'Experience', type: 'experience', content: [] }],
      });

      renderHook(() => useResumeLoader(props));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(templates.fetchTemplate).not.toHaveBeenCalled();
    });
  });

  describe('loadResumeFromCloud', () => {
    it('should load resume from cloud successfully', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: { name: 'Jane Doe', email: 'jane@example.com' },
        sections: [{ name: 'Education', type: 'education', content: [] }],
        template_id: 'modern-with-icons',
        icons: [
          {
            filename: 'company.png',
            storage_url: 'https://example.com/icons/company.png',
          },
        ],
        ai_import_warnings: ['Warning 1'],
        ai_import_confidence: 0.85,
      };

      const mockTemplateYaml = 'contact_info: {}\nsections: []';

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: mockTemplateYaml,
        supportsIcons: true,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      // Mock fetch for icon loading
      (global.fetch as any).mockResolvedValue({
        blob: vi.fn().mockResolvedValue(new Blob(['icon-data'], { type: 'image/png' })),
      });

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(apiClientModule.apiClient.get).toHaveBeenCalledWith('/api/resumes/resume-123');
      expect(props.setContactInfo).toHaveBeenCalledWith(mockResume.contact_info);
      expect(props.setSections).toHaveBeenCalledWith(mockResume.sections);
      expect(props.setTemplateId).toHaveBeenCalledWith('modern-with-icons');
      expect(props.setSupportsIcons).toHaveBeenCalledWith(true);
      expect(props.iconRegistry.clearRegistry).toHaveBeenCalled();
      expect(props.iconRegistry.registerIconWithFilename).toHaveBeenCalled();
      expect(props.setShowAIWarning).toHaveBeenCalledWith(true);
      expect(props.setAIWarnings).toHaveBeenCalledWith(['Warning 1']);
      expect(props.setAIConfidence).toHaveBeenCalledWith(0.85);
      expect(toast.success).toHaveBeenCalledWith('Resume loaded successfully');
      expect(result.current.isLoadingFromUrl).toBe(false);
      expect(result.current.hasLoadedFromUrl).toBe(true);
    });

    it('should not show toast when signing in from tour', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps({ isSigningInFromTour: true });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(toast.success).not.toHaveBeenCalled();
    });

    it('should handle resume loading errors', async () => {
      vi.spyOn(apiClientModule.apiClient, 'get').mockRejectedValue(new Error('Not found'));

      const props = createMockProps({
        templateId: null,
        contactInfo: null,
        sections: [],
      });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(toast.error).toHaveBeenCalled();
      expect(result.current.isLoadingFromUrl).toBe(false);
      expect(result.current.hasLoadedFromUrl).toBe(false); // Don't mark as loaded on error
    });

    it('should recover gracefully when resume not found but template available', async () => {
      vi.spyOn(apiClientModule.apiClient, 'get').mockRejectedValue(new Error('Not found'));

      const props = createMockProps({
        templateId: 'modern',
        contactInfo: { name: 'Test', email: 'test@example.com' },
        sections: [{ name: 'Experience', type: 'experience', content: [] }],
      });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      // Should not show error toast because we can recover
      expect(toast.error).not.toHaveBeenCalled();
      expect(result.current.isLoadingFromUrl).toBe(false);
    });

    it('should show error when no session', async () => {
      const props = createMockProps({ session: null });
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(toast.error).toHaveBeenCalledWith('Please sign in to load saved resumes');
      expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
    });

    it('should load resume automatically when resumeIdFromUrl is present', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps({ resumeIdFromUrl: 'resume-123' });
      renderHook(() => useResumeLoader(props));

      await waitFor(() => {
        expect(apiClientModule.apiClient.get).toHaveBeenCalledWith('/api/resumes/resume-123');
      });
    });

    it('should not load resume when auth is loading', async () => {
      const props = createMockProps({
        resumeIdFromUrl: 'resume-123',
        authLoading: true,
      });

      renderHook(() => useResumeLoader(props));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
    });

    it('should not load resume when migration is in progress', async () => {
      const props = createMockProps({
        resumeIdFromUrl: 'resume-123',
        anonMigrationInProgress: true,
      });

      renderHook(() => useResumeLoader(props));

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
    });

    it('should not load resume multiple times', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps({ resumeIdFromUrl: 'resume-123' });
      const { rerender } = renderHook(() => useResumeLoader(props));

      // Wait for first load
      await waitFor(() => {
        expect(apiClientModule.apiClient.get).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another load
      rerender();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(apiClientModule.apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle icon loading errors gracefully', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern-with-icons',
        icons: [
          {
            filename: 'broken.png',
            storage_url: 'https://example.com/icons/broken.png',
          },
        ],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: true,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      // Mock fetch to fail for icon
      (global.fetch as any).mockRejectedValue(new Error('Icon fetch failed'));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      // Should still complete successfully despite icon error
      expect(result.current.hasLoadedFromUrl).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load icon broken.png:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle template structure loading errors gracefully', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockRejectedValue(new Error('Template not found'));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      // Should still complete successfully despite template error
      expect(result.current.hasLoadedFromUrl).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load template structure for Start Fresh:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setCloudResumeId', () => {
    it('should update cloudResumeId state', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      act(() => {
        result.current.setCloudResumeId('new-resume-id');
      });

      expect(result.current.cloudResumeId).toBe('new-resume-id');
    });
  });

  describe('edge cases', () => {
    it('should handle resume without AI warnings', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(props.setShowAIWarning).not.toHaveBeenCalled();
      expect(props.setAIWarnings).not.toHaveBeenCalled();
      expect(props.setAIConfidence).not.toHaveBeenCalled();
    });

    it('should handle resume without icons', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'modern',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(props.iconRegistry.clearRegistry).toHaveBeenCalled();
      expect(props.iconRegistry.registerIconWithFilename).not.toHaveBeenCalled();
    });

    it('should set supportsIcons to false for non-icon templates', async () => {
      const mockResume = {
        id: 'resume-123',
        contact_info: {},
        sections: [],
        template_id: 'classic',
        icons: [],
      };

      vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({ resume: mockResume });
      vi.spyOn(templates, 'fetchTemplate').mockResolvedValue({
        yaml: 'contact_info: {}\nsections: []',
        supportsIcons: false,
      });
      vi.spyOn(yamlModule, 'load').mockReturnValue({
        contact_info: {},
        sections: [],
      });

      const props = createMockProps();
      const { result } = renderHook(() => useResumeLoader(props));

      await act(async () => {
        await result.current.loadResumeFromCloud('resume-123');
      });

      expect(props.setSupportsIcons).toHaveBeenCalledWith(false);
    });
  });
});
