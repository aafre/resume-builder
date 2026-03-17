/**
 * Shared E2E mock helpers for Playwright tests.
 *
 * Provides fake Supabase session, route mocks, and editor navigation
 * used by both anonymous-flow and accessibility test suites.
 */

import { Page } from '@playwright/test';
import { createResumeWithExperience, ResumeTemplate } from '../fixtures/test-data';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Supabase localStorage key (derived from project ref in VITE_SUPABASE_URL) */
export const SUPABASE_STORAGE_KEY = 'sb-mgetvioaymkvafczmhwo-auth-token';

export const DEFAULT_TEMPLATE_ID = 'modern-with-icons';

/**
 * Create a fake Supabase anonymous session for localStorage injection.
 * Uses a unique prefix to avoid collisions between parallel test workers.
 */
export function createFakeSession(prefix = 'e2e') {
  return {
    access_token: `${prefix}-mock-access-token-${Date.now()}`,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `${prefix}-mock-refresh-token`,
    user: {
      id: `${prefix}-mock-user-id`,
      aud: 'authenticated',
      role: 'authenticated',
      email: null,
      is_anonymous: true,
      app_metadata: { provider: 'anonymous', providers: ['anonymous'] },
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
  };
}

// ─── Route Mocks ──────────────────────────────────────────────────────────────

export interface SetupMocksOptions {
  resumeId: string;
  templateId?: string;
  resume?: ResumeTemplate;
  session?: ReturnType<typeof createFakeSession>;
}

/**
 * Set up all route mocks needed for the editor to function.
 * Mocks Supabase auth, REST endpoints, Flask API, and PDF generation.
 */
export async function setupEditorMocks(page: Page, options: SetupMocksOptions) {
  const {
    resumeId,
    templateId = DEFAULT_TEMPLATE_ID,
    resume = createResumeWithExperience(),
    session = createFakeSession(),
  } = options;

  // Mock Supabase auth endpoints (token refresh, user info)
  await page.route('**/auth/v1/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/token')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) });
    } else if (url.includes('/user')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session.user) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  // Mock Supabase REST endpoints (user_preferences, conversion_tracking)
  await page.route('**/rest/v1/**', async (route) => {
    const url = route.request().url();
    if (url.includes('user_preferences')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ tour_completed: true, idle_nudge_shown: true }]) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  // Mock resume fetch by ID
  await page.route(`**/api/resumes/${resumeId}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resume: {
          id: resumeId,
          template_id: templateId,
          contact_info: resume.contact_info,
          sections: resume.sections.map((s, i) => ({ ...s, id: `section-${i}` })),
          title: 'E2E Test Resume',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }),
    });
  });

  // Mock template structure fetch
  await page.route('**/api/template/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        yaml: [
          'contact_info:',
          '  name: ""',
          '  email: ""',
          'sections:',
          '  - name: Summary',
          '    type: text',
          '    content: ""',
          '  - name: Experience',
          '    type: experience',
          '    content: []',
          '  - name: Skills',
          '    type: bulleted-list',
          '    content: []',
        ].join('\n'),
        supportsIcons: true,
      }),
    });
  });

  // Mock resume list, save, count
  await page.route('**/api/resumes', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ resumes: [] }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, resume_id: resumeId }) });
    }
  });

  await page.route('**/api/resumes/count*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ count: 1 }) });
  });

  // Mock PDF generation — return minimal valid PDF bytes
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      headers: { 'Content-Disposition': 'attachment; filename="resume.pdf"' },
      body: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF', 'utf-8'),
    });
  });

  // Mock templates list
  await page.route('**/api/templates', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'modern-with-icons', name: 'Modern', description: 'Contemporary design.', image_url: 'data:image/png;base64,iVBORw0KGgo=' },
        { id: 'classic-alex-rivera', name: 'Professional', description: 'Clean layout.', image_url: 'data:image/png;base64,iVBORw0KGgo=' },
      ]),
    });
  });

  return session;
}

// ─── Navigation Helpers ───────────────────────────────────────────────────────

/**
 * Navigate to the editor with mocks and fake session injected.
 * Returns the session object for assertions if needed.
 */
export async function gotoEditor(page: Page, resumeId: string, session?: ReturnType<typeof createFakeSession>) {
  const s = session ?? createFakeSession();
  await setupEditorMocks(page, { resumeId, session: s });

  // Inject fake session into localStorage BEFORE navigating to editor
  await page.goto('/?__test=1', { waitUntil: 'commit' });
  await page.evaluate(({ key, sess }) => {
    localStorage.setItem(key, JSON.stringify(sess));
  }, { key: SUPABASE_STORAGE_KEY, sess: s });

  // Navigate to editor — Supabase client will find the session in localStorage
  await page.goto(`/editor/${resumeId}?__test=1`);
  await page.getByTestId('editor-main-content').waitFor({ state: 'visible', timeout: 15_000 });

  return s;
}
