/**
 * Analytics module — lazy-loaded PostHog integration.
 *
 * Design:
 * - PostHog JS is loaded via dynamic import (separate chunk, not in main bundle)
 * - Initialization deferred via requestIdleCallback to avoid Lighthouse impact
 * - Events queued before PostHog loads, replayed once initialized
 * - Graceful no-op when VITE_POSTHOG_KEY is not set (local dev)
 */

import type { PostHog } from 'posthog-js';

// ─── Config ──────────────────────────────────────────────────────────
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string) || 'https://us.i.posthog.com';

// ─── State ───────────────────────────────────────────────────────────
let posthog: PostHog | null = null;
let initPromise: Promise<PostHog | null> | null = null;
const queue: Array<() => void> = [];

// ─── Lazy loader ─────────────────────────────────────────────────────

function loadPostHog(): Promise<PostHog | null> {
  if (posthog) return Promise.resolve(posthog);
  if (!POSTHOG_KEY) return Promise.resolve(null);
  if (initPromise) return initPromise;

  initPromise = import('posthog-js').then(({ default: ph }) => {
    ph.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      // We fire pageviews manually on route changes
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      // Disable autocapture to reduce noise — we track explicit events
      autocapture: false,
      // Heatmaps — capture click/scroll patterns (no extra events)
      enable_heatmaps: true,
      // Session recording — masks passwords, allows other inputs
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: { password: true },
      },
    });

    posthog = ph;

    // Flush queued calls
    for (const fn of queue) fn();
    queue.length = 0;

    return ph;
  });

  return initPromise;
}

/** Queue a call or execute immediately if PostHog is loaded. */
function run(fn: (ph: PostHog) => void): void {
  if (posthog) {
    fn(posthog);
  } else if (POSTHOG_KEY) {
    queue.push(() => { if (posthog) fn(posthog); });
    loadPostHog();
  }
  // No key configured → silent no-op
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Start loading PostHog in the background. Call once from App on mount.
 * Uses requestIdleCallback (3s timeout) to avoid blocking initial paint.
 */
export function initAnalytics(): void {
  if (!POSTHOG_KEY || typeof window === 'undefined') return;

  const start = () => loadPostHog();

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 3000);
  }
}

/**
 * Identify user by Supabase user ID. Call on auth state change.
 * Resets identity on sign-out (anonymous session).
 */
export function identifyUser(userId: string, isAnonymous: boolean): void {
  run((ph) => {
    if (isAnonymous) {
      ph.reset();
    } else {
      ph.identify(userId);
    }
  });
}

/** Track a page view. Call on every route change. */
export function trackPageView(path: string): void {
  run((ph) => {
    ph.capture('$pageview', { $current_url: window.location.href, path });
  });
}

// ─── Funnel events ───────────────────────────────────────────────────

export function trackResumeCreated(props: {
  template_id: string;
  method: 'blank' | 'example' | 'ai_import' | 'job_example';
}): void {
  run((ph) => ph.capture('resume_created', props));
}

export function trackPdfDownloaded(props: {
  template_id: string;
  source: 'editor' | 'my_resumes';
}): void {
  run((ph) => ph.capture('pdf_downloaded', props));
}

export function trackSignupCompleted(props: {
  provider: 'google' | 'linkedin' | 'email';
}): void {
  run((ph) => ph.capture('signup_completed', props));
}

export function trackTemplateSelected(props: {
  template_id: string;
}): void {
  run((ph) => ph.capture('template_selected', props));
}

export function trackCtaClicked(props: {
  cta_id: string;
  page: string;
}): void {
  run((ph) => ph.capture('cta_clicked', props));
}
