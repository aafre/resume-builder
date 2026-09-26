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
    vi.useRealTimers();
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

  it('getTurnstileToken resolves null if the widget never calls back', async () => {
    vi.useFakeTimers();
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-site-key');
    const { getTurnstileToken } = await import('../turnstile');

    const tokenPromise = getTurnstileToken();
    const remove = vi.fn();
    (window as any).turnstile = { render: () => 'widget-1', remove, reset: vi.fn() };
    document.head.querySelector(SELECTOR)!.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(15_000);

    await expect(tokenPromise).resolves.toBeNull();
    expect(remove).toHaveBeenCalledWith('widget-1');
  });

  it('getTurnstileToken renders a visible interaction-only widget and waits for a click challenge', async () => {
    vi.useFakeTimers();
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-site-key');
    const { getTurnstileToken } = await import('../turnstile');

    let opts: any;
    let container: HTMLElement | undefined;
    const tokenPromise = getTurnstileToken();
    (window as any).turnstile = {
      render: (el: HTMLElement, o: any) => { container = el; opts = o; return 'widget-1'; },
      remove: vi.fn(),
      reset: vi.fn(),
    };
    document.head.querySelector(SELECTOR)!.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(0);

    // Managed mode escalated to a click: a hidden widget could never be solved.
    expect(opts.appearance).toBe('interaction-only');
    expect(container!.style.display).not.toBe('none');
    opts['before-interactive-callback']();

    await vi.advanceTimersByTimeAsync(30_000); // past the silent 15s cap
    opts.callback('clicked-token');

    await expect(tokenPromise).resolves.toBe('clicked-token');
    vi.useRealTimers();
  });
});
