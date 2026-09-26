import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const SELECTOR = 'script[data-turnstile-loader]';

describe('turnstile', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    delete (window as any).turnstile;
    document.head.querySelectorAll(SELECTOR).forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getTurnstileToken resolves null and injects no script when no site key is set', async () => {
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', '');
    const { getTurnstileToken } = await import('../turnstile');

    const token = await getTurnstileToken();

    expect(token).toBeNull();
    expect(document.head.querySelectorAll(SELECTOR).length).toBe(0);
  });

  it('getTurnstileToken loads the script and resolves the widget token when a site key is set', async () => {
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-site-key');
    const { getTurnstileToken } = await import('../turnstile');

    const tokenPromise = getTurnstileToken();

    const scripts = document.head.querySelectorAll(SELECTOR);
    expect(scripts.length).toBe(1);

    // Simulate the external script finishing load, then Cloudflare's SDK
    // rendering the invisible widget and solving it.
    (window as any).turnstile = {
      render: (_el: HTMLElement, options: { callback: (t: string) => void }) => {
        options.callback('test-token-123');
        return 'widget-1';
      },
      remove: vi.fn(),
      reset: vi.fn(),
    };
    scripts[0].dispatchEvent(new Event('load'));

    await expect(tokenPromise).resolves.toBe('test-token-123');
  });
});
