import { describe, it, expect, vi } from 'vitest';

let release: () => void = () => {};
vi.mock('../../utils/turnstile', () => ({
  ensureTurnstilePreClearance: () => new Promise<void>((r) => (release = r)),
}));

import { searchJobs } from '../jobs';

describe('searchJobs pre-clearance', () => {
  it('does not fetch until Turnstile pre-clearance completes', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jobs: [], count: 0 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const p = searchJobs({ title: 'nurse' } as never);
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).not.toHaveBeenCalled();

    release();
    await p.catch(() => {});
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
