import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: { access_token: 't', user: { id: 'u1' } } }),
}));
vi.mock('../../lib/analytics', () => ({
  trackResumeUploadStarted: vi.fn(),
  trackResumeParseCompleted: vi.fn(),
  categorizeError: () => 'rate_limited',
}));

const getTurnstileToken = vi.fn();
vi.mock('../../utils/turnstile', () => ({
  getTurnstileToken: () => getTurnstileToken(),
}));

import { useResumeParser } from '../useResumeParser';

const RATE_LIMIT_MESSAGE =
  "You've imported several resumes today. Try again tomorrow, or edit your current resume in the editor.";

const SUCCESS_RESPONSE = {
  success: true,
  yaml: 'template: modern',
  confidence: 0.95,
  warnings: [],
  cached: false,
  ui_message: { title: 't', description: 'd', type: 'success' },
};

describe('useResumeParser', () => {
  it('surfaces the server 429 rate-limit message', async () => {
    getTurnstileToken.mockResolvedValue(null);
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

  it('sends the turnstile_token field when a token is available', async () => {
    getTurnstileToken.mockResolvedValue('tok-abc');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => SUCCESS_RESPONSE,
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useResumeParser());
    const file = new File(['x'], 'resume.pdf', { type: 'application/pdf' });

    await act(async () => {
      await result.current.parseResume(file);
    });

    const sentFormData = fetchMock.mock.calls[0][1].body as FormData;
    expect(sentFormData.get('turnstile_token')).toBe('tok-abc');
  });

  it('sends no turnstile_token field when no site key is configured (no-op)', async () => {
    getTurnstileToken.mockResolvedValue(null);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => SUCCESS_RESPONSE,
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useResumeParser());
    const file = new File(['x'], 'resume.pdf', { type: 'application/pdf' });

    await act(async () => {
      await result.current.parseResume(file);
    });

    const sentFormData = fetchMock.mock.calls[0][1].body as FormData;
    expect(sentFormData.get('turnstile_token')).toBeNull();
  });
});
