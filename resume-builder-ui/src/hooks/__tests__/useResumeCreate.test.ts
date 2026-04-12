import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResumeCreate } from '../useResumeCreate';

// Mock dependencies
const mockNavigate = vi.fn();
const mockInvalidateQueries = vi.fn().mockResolvedValue(undefined);
const mockPost = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

vi.mock('../../lib/api-client', () => ({
  apiClient: {
    post: (...args: any[]) => mockPost(...args),
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    session: { user: { id: 'user-1' }, access_token: 'token-abc' },
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('../../lib/analytics', () => ({
  trackResumeCreated: vi.fn(),
}));

import toast from 'react-hot-toast';
import { trackResumeCreated } from '../../lib/analytics';

describe('useResumeCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({ resume_id: 'new-resume-id' });
  });

  describe('standard create (empty/example)', () => {
    it('calls /api/resumes/create for standard creation', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/resumes/create',
        expect.objectContaining({
          template_id: 'modern',
          load_example: false,
        }),
        expect.any(Object)
      );
    });

    it('passes load_example when creating from example', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern', loadExample: true });
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/resumes/create',
        expect.objectContaining({ load_example: true }),
        expect.any(Object)
      );
    });
  });

  describe('import create (with data)', () => {
    it('calls /api/resumes when contactInfo and sections are provided', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({
          templateId: 'modern',
          contactInfo: { name: 'Jane', email: 'jane@test.com' },
          sections: [{ content: [] }],
        });
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/resumes',
        expect.objectContaining({
          id: null,
          template_id: 'modern',
          contact_info: expect.objectContaining({ name: 'Jane' }),
          sections: expect.any(Array),
        }),
        expect.any(Object)
      );
    });
  });

  describe('navigation', () => {
    it('navigates to editor on success', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/editor/new-resume-id');
    });

    it('returns the resume ID on success', async () => {
      const { result } = renderHook(() => useResumeCreate());

      let resumeId: string | null;
      await act(async () => {
        resumeId = await result.current.createResume({ templateId: 'modern' });
      });

      expect(resumeId!).toBe('new-resume-id');
    });
  });

  describe('cache invalidation', () => {
    it('invalidates resumes and resume-count caches', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['resumes'] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['resume-count'] });
    });
  });

  describe('analytics', () => {
    it('tracks blank creation method', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(trackResumeCreated).toHaveBeenCalledWith({
        template_id: 'modern',
        method: 'blank',
      });
    });

    it('tracks example creation method', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern', loadExample: true });
      });

      expect(trackResumeCreated).toHaveBeenCalledWith({
        template_id: 'modern',
        method: 'example',
      });
    });

    it('tracks ai_import method when confidence score present', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({
          templateId: 'modern',
          contactInfo: { name: 'Test' },
          sections: [{ content: [] }],
          aiImportConfidence: 0.95,
        });
      });

      expect(trackResumeCreated).toHaveBeenCalledWith({
        template_id: 'modern',
        method: 'ai_import',
      });
    });

    it('tracks job_example method for data import without AI confidence', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({
          templateId: 'modern',
          contactInfo: { name: 'Test' },
          sections: [{ content: [] }],
        });
      });

      expect(trackResumeCreated).toHaveBeenCalledWith({
        template_id: 'modern',
        method: 'job_example',
      });
    });
  });

  describe('5-resume limit', () => {
    it('shows error toast and navigates to /my-resumes', async () => {
      mockPost.mockRejectedValue({
        data: { error_code: 'RESUME_LIMIT_REACHED' },
      });

      const { result } = renderHook(() => useResumeCreate());

      let resumeId: string | null;
      await act(async () => {
        resumeId = await result.current.createResume({ templateId: 'modern' });
      });

      expect(resumeId!).toBeNull();
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('limit'));
      expect(mockNavigate).toHaveBeenCalledWith('/my-resumes');
    });
  });

  describe('error handling', () => {
    it('shows generic error toast on unknown error', async () => {
      mockPost.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useResumeCreate());

      let resumeId: string | null;
      await act(async () => {
        resumeId = await result.current.createResume({ templateId: 'modern' });
      });

      expect(resumeId!).toBeNull();
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Failed'));
    });

    // Note: no-session test skipped — the null guard is trivial and vi.doMock
    // can't override an already-hoisted vi.mock for the same import path
  });

  describe('creating state', () => {
    it('starts with creating = false', () => {
      const { result } = renderHook(() => useResumeCreate());
      expect(result.current.creating).toBe(false);
    });

    it('resets creating to false after completion', async () => {
      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(result.current.creating).toBe(false);
    });

    it('resets creating to false even on error', async () => {
      mockPost.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useResumeCreate());

      await act(async () => {
        await result.current.createResume({ templateId: 'modern' });
      });

      expect(result.current.creating).toBe(false);
    });
  });
});
