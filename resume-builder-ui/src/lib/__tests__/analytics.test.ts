import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to control import.meta.env.VITE_POSTHOG_KEY — test with and without key.
// Since the module reads POSTHOG_KEY at import time, we use vi.resetModules() between groups.

const mockCapture = vi.fn();
const mockIdentify = vi.fn();
const mockReset = vi.fn();
const mockInit = vi.fn();

const mockPostHogInstance = {
  init: mockInit,
  capture: mockCapture,
  identify: mockIdentify,
  reset: mockReset,
};

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Mock posthog-js dynamic import
    vi.doMock('posthog-js', () => ({
      default: mockPostHogInstance,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when POSTHOG_KEY is set', () => {
    beforeEach(() => {
      // Set env before importing module
      vi.stubEnv('VITE_POSTHOG_KEY', 'phc_test_key_123');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('initAnalytics triggers lazy loading', async () => {
      const { initAnalytics } = await import('../analytics');

      // Mock requestIdleCallback
      const originalRIC = window.requestIdleCallback;
      let idleCallback: (() => void) | null = null;
      window.requestIdleCallback = vi.fn((cb: any) => {
        idleCallback = cb;
        return 1;
      }) as any;

      initAnalytics();
      expect(window.requestIdleCallback).toHaveBeenCalled();

      // Fire the idle callback to trigger loading
      if (idleCallback) idleCallback();

      // Wait for the dynamic import promise to resolve
      await vi.dynamicImportSettled();

      expect(mockInit).toHaveBeenCalledWith(
        'phc_test_key_123',
        expect.objectContaining({
          capture_pageview: false,
          autocapture: false,
        })
      );

      window.requestIdleCallback = originalRIC;
    });

    it('trackResumeCreated calls capture with correct event', async () => {
      const { trackResumeCreated, initAnalytics } = await import('../analytics');

      // Simulate PostHog loaded by calling initAnalytics and triggering the load
      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      trackResumeCreated({ template_id: 'modern', method: 'blank' });

      expect(mockCapture).toHaveBeenCalledWith('resume_created', {
        template_id: 'modern',
        method: 'blank',
      });

      window.requestIdleCallback = originalRIC;
    });

    it('trackPdfDownloaded calls capture with correct event', async () => {
      const { trackPdfDownloaded, initAnalytics } = await import('../analytics');

      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      trackPdfDownloaded({ template_id: 'modern', source: 'editor' });

      expect(mockCapture).toHaveBeenCalledWith('pdf_downloaded', {
        template_id: 'modern',
        source: 'editor',
      });

      window.requestIdleCallback = originalRIC;
    });

    it('trackSignedIn calls capture with correct event', async () => {
      const { trackSignedIn, initAnalytics } = await import('../analytics');

      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      trackSignedIn({ provider: 'google', is_new_user: true });

      expect(mockCapture).toHaveBeenCalledWith('signed_in', {
        provider: 'google',
        is_new_user: true,
      });

      window.requestIdleCallback = originalRIC;
    });

    it('identifyUser calls identify', async () => {
      const { identifyUser, initAnalytics } = await import('../analytics');

      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      identifyUser('user-123');
      expect(mockIdentify).toHaveBeenCalledWith('user-123');

      window.requestIdleCallback = originalRIC;
    });

    it('resetUser calls reset', async () => {
      const { resetUser, initAnalytics } = await import('../analytics');

      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      resetUser();
      expect(mockReset).toHaveBeenCalled();

      window.requestIdleCallback = originalRIC;
    });

    it('queues events before PostHog loads and replays after', async () => {
      const { trackPageView, initAnalytics } = await import('../analytics');

      // Queue an event BEFORE init
      trackPageView('/test-page');

      // PostHog not loaded yet — should not have captured
      expect(mockCapture).not.toHaveBeenCalled();

      // Now init and load PostHog
      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;
      initAnalytics();
      await vi.dynamicImportSettled();

      // After load, queued event should replay
      expect(mockCapture).toHaveBeenCalledWith('$pageview', expect.objectContaining({
        path: '/test-page',
      }));

      window.requestIdleCallback = originalRIC;
    });
  });

  describe('when POSTHOG_KEY is not set', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_POSTHOG_KEY', '');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('initAnalytics is a no-op', async () => {
      const { initAnalytics } = await import('../analytics');

      const originalRIC = window.requestIdleCallback;
      window.requestIdleCallback = vi.fn((cb: any) => { cb(); return 1; }) as any;

      initAnalytics();

      // Should not even try requestIdleCallback
      expect(mockInit).not.toHaveBeenCalled();

      window.requestIdleCallback = originalRIC;
    });

    it('track functions are silent no-ops', async () => {
      const { trackResumeCreated, trackPageView } = await import('../analytics');

      // Should not throw
      trackResumeCreated({ template_id: 'modern', method: 'blank' });
      trackPageView('/test');

      expect(mockCapture).not.toHaveBeenCalled();
    });
  });
});
