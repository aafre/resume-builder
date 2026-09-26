import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let flag = true;
vi.mock('../../config/affiliate', () => ({
  affiliateConfig: { jobSearch: { get enabled() { return flag; } } },
}));

async function load() {
  vi.resetModules();
  return (await import('../useJobsAvailable')).useJobsAvailable;
}

function respond(body: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

describe('useJobsAvailable', () => {
  beforeEach(() => {
    flag = true;
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['supported country', { available: true, country: 'gb' }, true],
    ['unsupported country', { available: false, country: 'jp' }, false],
    ['no CF-IPCountry header (backend fails open)', { available: true, country: null }, true],
  ])('%s', async (_label, body, expected) => {
    respond(body);
    const useJobsAvailable = await load();
    const { result } = renderHook(() => useJobsAvailable());
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toBe(expected));
    expect(localStorage.getItem('efr-jobs-available')).toBe(expected ? '1' : '0');
  });

  it('fails open when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const useJobsAvailable = await load();
    const { result } = renderHook(() => useJobsAvailable());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('starts from the cached answer', async () => {
    localStorage.setItem('efr-jobs-available', '0');
    respond({ available: false });
    const useJobsAvailable = await load();
    const { result } = renderHook(() => useJobsAvailable());
    expect(result.current).toBe(false);
  });

  it('is false without a request when the master flag is off', async () => {
    flag = false;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const useJobsAvailable = await load();
    const { result } = renderHook(() => useJobsAvailable());
    expect(result.current).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
