import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSaveIntegration } from '../useSaveIntegration';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('../../useCloudSave', () => ({
  useCloudSave: vi.fn(),
}));

import { toast } from 'react-hot-toast';
import { useCloudSave } from '../../useCloudSave';

// Helper to create mock props
function createMockProps(overrides = {}) {
  return {
    contactInfo: { name: 'Test User', email: 'test@test.com', phone: '555', location: 'NYC', linkedin: '', linkedin_display: '', social_links: [] },
    sections: [{ name: 'Experience', type: 'experience', content: [] }],
    templateId: 'modern',
    documentSettings: { accentColor: '#0066cc', fontFamily: 'Roboto', showPageNumbers: true },
    iconRegistry: {
      getRegisteredFilenames: vi.fn(() => ['icon1.png']),
      getIconFile: vi.fn((name: string) => new File(['data'], name)),
    },
    cloudResumeId: 'resume-123',
    setCloudResumeId: vi.fn(),
    isLoadingFromUrl: false,
    authLoading: false,
    session: { user: { id: 'user-1' } },
    isAnonymous: false,
    openStorageLimitModal: vi.fn(),
    ...overrides,
  };
}

// Default mock return for useCloudSave
const defaultCloudSaveReturn = {
  saveStatus: 'saved' as const,
  lastSaved: new Date(),
  saveNow: vi.fn().mockResolvedValue('resume-123'),
  resumeId: 'resume-123',
};

describe('useSaveIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({ ...defaultCloudSaveReturn });
  });

  describe('initialization', () => {
    it('calls useCloudSave with correct parameters', () => {
      const props = createMockProps();
      renderHook(() => useSaveIntegration(props));

      expect(useCloudSave).toHaveBeenCalledWith(
        expect.objectContaining({
          resumeId: 'resume-123',
          enabled: true,
          session: props.session,
        })
      );
    });

    it('includes documentSettings in resumeData passed to useCloudSave', () => {
      const props = createMockProps();
      renderHook(() => useSaveIntegration(props));

      const callArgs = (useCloudSave as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.resumeData).toEqual(
        expect.objectContaining({
          settings: { accentColor: '#0066cc', fontFamily: 'Roboto', showPageNumbers: true },
        })
      );
    });

    it('disables cloud save when template is not loaded', () => {
      const props = createMockProps({ templateId: null });
      renderHook(() => useSaveIntegration(props));

      const callArgs = (useCloudSave as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.enabled).toBe(false);
    });

    it('disables cloud save when loading from URL', () => {
      const props = createMockProps({ isLoadingFromUrl: true });
      renderHook(() => useSaveIntegration(props));

      const callArgs = (useCloudSave as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.enabled).toBe(false);
    });

    it('disables cloud save during auth loading', () => {
      const props = createMockProps({ authLoading: true });
      renderHook(() => useSaveIntegration(props));

      const callArgs = (useCloudSave as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.enabled).toBe(false);
    });
  });

  describe('icon registry conversion', () => {
    it('converts icon registry to plain object for cloud save', () => {
      const props = createMockProps();
      renderHook(() => useSaveIntegration(props));

      const callArgs = (useCloudSave as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.icons).toEqual(
        expect.objectContaining({ 'icon1.png': expect.any(File) })
      );
    });
  });

  describe('resume ID sync', () => {
    it('syncs saved resume ID back via setCloudResumeId', () => {
      const setCloudResumeId = vi.fn();
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        resumeId: 'new-resume-456',
      });

      renderHook(() =>
        useSaveIntegration(createMockProps({ cloudResumeId: null, setCloudResumeId }))
      );

      expect(setCloudResumeId).toHaveBeenCalledWith('new-resume-456');
    });

    it('does not sync when IDs match', () => {
      const setCloudResumeId = vi.fn();
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        resumeId: 'resume-123',
      });

      renderHook(() =>
        useSaveIntegration(createMockProps({ cloudResumeId: 'resume-123', setCloudResumeId }))
      );

      expect(setCloudResumeId).not.toHaveBeenCalled();
    });
  });

  describe('saveBeforeAction', () => {
    it('returns true for anonymous users without saving', async () => {
      const saveNow = vi.fn();
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveNow,
      });

      const { result } = renderHook(() =>
        useSaveIntegration(createMockProps({ isAnonymous: true }))
      );

      let canProceed: boolean;
      await act(async () => {
        canProceed = await result.current.saveBeforeAction('Download');
      });
      expect(canProceed!).toBe(true);
      expect(saveNow).not.toHaveBeenCalled();
    });

    it('returns true for users with no contact info', async () => {
      const saveNow = vi.fn();
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveNow,
      });

      const { result } = renderHook(() =>
        useSaveIntegration(createMockProps({ contactInfo: null }))
      );

      let canProceed: boolean;
      await act(async () => {
        canProceed = await result.current.saveBeforeAction('Preview');
      });
      expect(canProceed!).toBe(true);
      expect(saveNow).not.toHaveBeenCalled();
    });

    it('triggers saveNow and returns true on success', async () => {
      const saveNow = vi.fn().mockResolvedValue('resume-123');
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveNow,
      });

      const { result } = renderHook(() => useSaveIntegration(createMockProps()));

      let canProceed: boolean;
      await act(async () => {
        canProceed = await result.current.saveBeforeAction('Download');
      });
      expect(canProceed!).toBe(true);
      expect(saveNow).toHaveBeenCalled();
    });

    it('returns false and shows toast on save failure', async () => {
      const saveNow = vi.fn().mockRejectedValue(new Error('Network error'));
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveStatus: 'error',
        saveNow,
      });

      const { result } = renderHook(() => useSaveIntegration(createMockProps()));

      let canProceed: boolean;
      await act(async () => {
        canProceed = await result.current.saveBeforeAction('Download');
      });
      expect(canProceed!).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Download'));
    });

    it('opens storage limit modal on RESUME_LIMIT_REACHED error', async () => {
      const openStorageLimitModal = vi.fn();
      const saveNow = vi.fn().mockRejectedValue(new Error('RESUME_LIMIT_REACHED'));
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveNow,
      });

      const { result } = renderHook(() =>
        useSaveIntegration(createMockProps({ openStorageLimitModal }))
      );

      let canProceed: boolean;
      await act(async () => {
        canProceed = await result.current.saveBeforeAction('Download');
      });
      expect(canProceed!).toBe(false);
      expect(openStorageLimitModal).toHaveBeenCalled();
    });
  });

  describe('return values', () => {
    it('returns saveStatus from useCloudSave', () => {
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        saveStatus: 'saving',
      });

      const { result } = renderHook(() => useSaveIntegration(createMockProps()));
      expect(result.current.saveStatus).toBe('saving');
    });

    it('returns lastSaved from useCloudSave', () => {
      const lastSaved = new Date('2026-04-12T12:00:00Z');
      (useCloudSave as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultCloudSaveReturn,
        lastSaved,
      });

      const { result } = renderHook(() => useSaveIntegration(createMockProps()));
      expect(result.current.lastSaved).toBe(lastSaved);
    });

    it('returns savedResumeId from useCloudSave', () => {
      const { result } = renderHook(() => useSaveIntegration(createMockProps()));
      expect(result.current.savedResumeId).toBe('resume-123');
    });
  });
});
