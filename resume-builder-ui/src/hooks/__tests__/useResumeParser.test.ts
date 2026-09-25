import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: { access_token: 't', user: { id: 'u1' } } }),
}));
vi.mock('../../lib/analytics', () => ({
  trackResumeUploadStarted: vi.fn(),
  trackResumeParseCompleted: vi.fn(),
  categorizeError: () => 'rate_limited',
}));

import { useResumeParser } from '../useResumeParser';

const RATE_LIMIT_MESSAGE =
  "You've imported several resumes today. Try again tomorrow, or edit your current resume in the editor.";

describe('useResumeParser', () => {
  it('surfaces the server 429 rate-limit message', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ success: false, error: RATE_LIMIT_MESSAGE }),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useResumeParser());
    const file = new File(['x'], 'resume.pdf', { type: 'application/pdf' });

    await act(async () => {
      await expect(result.current.parseResume(file)).rejects.toThrow(RATE_LIMIT_MESSAGE);
    });

    expect(result.current.error).toBe(RATE_LIMIT_MESSAGE);
  });
});
