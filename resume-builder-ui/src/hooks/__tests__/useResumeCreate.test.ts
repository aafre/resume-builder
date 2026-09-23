import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const post = vi.fn();
vi.mock('../../lib/api-client', () => ({ apiClient: { post: (...a: unknown[]) => post(...a) } }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ session: { access_token: 't' } }) }));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));
vi.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../lib/analytics', () => ({ trackResumeCreated: vi.fn() }));

import { useResumeCreate } from '../useResumeCreate';

describe('useResumeCreate', () => {
  it('blocks a second create fired before the first settles (auto-import timer vs manual click)', async () => {
    post.mockResolvedValue({ resume_id: 'r1' });
    const { result } = renderHook(() => useResumeCreate());

    await act(async () => {
      const { createResume } = result.current;
      // Same stale closure, no re-render in between
      const a = createResume({ templateId: 'modern', title: 'Imported', contactInfo: {}, sections: [] });
      const b = createResume({ templateId: 'modern', loadExample: false });
      await Promise.all([a, b]);
    });

    expect(post).toHaveBeenCalledTimes(1);
  });
});
