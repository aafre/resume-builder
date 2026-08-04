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
let loadFailed = false;
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
      // PostHog's remote config will otherwise pull in extra bundles at runtime.
      // Surveys are explicitly out of scope, dead-click autocapture was not
      // requested, and we already collect web vitals ourselves (see the
      // web-vitals CLS attribution work) — so posthog's copy is duplicate work.
      capture_performance: false,
      disable_surveys: true,
      capture_dead_clicks: false,
      // Session recording OFF. maskAllInputs only masks form inputs, but resume
      // content (name, address, employment history) also renders as plain DOM in
      // the preview pane, so recording would capture PII regardless. Keeping it
      // off also excludes rrweb — the heaviest part of posthog-js — from the chunk.
      disable_session_recording: true,
    });

    posthog = ph;

    // Flush queued calls
    for (const fn of queue) fn();
    queue.length = 0;

    return ph;
  }).catch(() => {
    // Ad blockers block posthog-js outright, and this audience likely skews
    // high on them. Without this the rejection is unhandled (console error on
    // every blocked load) and the queue accumulates for the whole session.
    loadFailed = true;
    queue.length = 0;
    return null;
  });

  return initPromise;
}

/**
 * Queue a call or execute immediately if PostHog is loaded.
 * Does NOT trigger loading — initAnalytics() handles that via
 * requestIdleCallback to avoid blocking initial paint.
 */
function run(fn: (ph: PostHog) => void): void {
  if (posthog) {
    fn(posthog);
  } else if (POSTHOG_KEY && !loadFailed) {
    queue.push(() => { if (posthog) fn(posthog); });
  }
  // No key configured, or load was blocked → silent no-op
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
 * Identify authenticated user by Supabase user ID.
 * Only call for non-anonymous users. PostHog handles anonymous
 * tracking automatically — do NOT call reset() on every mount.
 */
export function identifyUser(userId: string): void {
  run((ph) => ph.identify(userId));
}

/**
 * Reset PostHog identity. Call ONLY on explicit sign-out to
 * disconnect the session from the signed-in user.
 */
export function resetUser(): void {
  run((ph) => ph.reset());
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

export function trackSignedIn(props: {
  provider: 'google' | 'linkedin' | 'email';
  is_new_user: boolean;
}): void {
  run((ph) => ph.capture('signed_in', props));
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

/**
 * Reduce an error message to a bounded, non-identifying category.
 *
 * Raw error strings must never reach the analytics provider. `/api/generate`
 * returns `str(fnfe)` / `str(ve)` — raw Python exceptions that routinely carry
 * filesystem paths and can echo resume content from validation failures — and
 * the parse-resume function returns `Text extraction failed: ${error.message}`,
 * which can include the uploaded filename. Sending those would contradict our
 * privacy policy and make the property unbounded in cardinality.
 */
export function categorizeError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('timeout') || m.includes('timed out')) return 'timeout';
  if (m.includes('failed to fetch') || m.includes('network')) return 'network';
  if (m.includes('token') || m.includes('unauthor') || m.includes('sign in')) return 'auth';
  if (m.includes('icon')) return 'missing_icons';
  if (m.includes('extraction')) return 'text_extraction';
  if (m.includes('too large') || m.includes('file size')) return 'file_too_large';
  if (m.includes('file type') || m.includes('pdf or docx')) return 'unsupported_file_type';
  if (m.includes('valid')) return 'validation';
  return 'other';
}

// ─── AI import funnel ────────────────────────────────────────────────
// 56% of resumes are created by uploading an existing PDF/DOCX, behind an
// ~11.7s median parse. These two events bracket that wait so abandonment
// during it is measurable; pair with resume_created{method:'ai_import'}
// to see how many parses actually become resumes.

export function trackResumeUploadStarted(props: {
  file_type: string;
  file_size_kb: number;
}): void {
  run((ph) => ph.capture('resume_upload_started', props));
}

export function trackResumeParseCompleted(props: {
  file_type: string;
  duration_ms: number;
  success: boolean;
  /** Edge-function cache hit — separates ~1s cached responses from ~12s cold parses. */
  cached?: boolean;
  confidence?: number;
  error_type?: string;
}): void {
  run((ph) => ph.capture('resume_parse_completed', props));
}

/** Download is the primary conversion event — we currently cannot see it fail. */
export function trackPdfDownloadFailed(props: {
  template_id: string;
  source: 'editor' | 'my_resumes';
  error_type: string;
}): void {
  run((ph) => ph.capture('pdf_download_failed', props));
}
