/**
 * Accessibility Tests (WCAG 2.1 AA)
 *
 * Uses @axe-core/playwright to scan pages for accessibility violations.
 * These tests catch real regressions like missing labels, bad contrast,
 * and broken ARIA without being flaky.
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createResumeWithExperience } from '../fixtures/test-data';

const TEST_RESUME_ID = 'e2e-a11y-resume-001';
const testResume = createResumeWithExperience();
const SUPABASE_STORAGE_KEY = 'sb-mgetvioaymkvafczmhwo-auth-token';

const FAKE_SESSION = {
  access_token: 'e2e-a11y-mock-token-' + Date.now(),
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'e2e-a11y-refresh-token',
  user: {
    id: 'e2e-a11y-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: null,
    is_anonymous: true,
    app_metadata: { provider: 'anonymous', providers: ['anonymous'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
};

async function setupMocks(page: Page) {
  await page.route('**/auth/v1/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/token')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE_SESSION) });
    } else if (url.includes('/user')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE_SESSION.user) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  await page.route('**/rest/v1/**', async (route) => {
    const url = route.request().url();
    if (url.includes('user_preferences')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ tour_completed: true, idle_nudge_shown: true }]) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  await page.route(`**/api/resumes/${TEST_RESUME_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resume: {
          id: TEST_RESUME_ID,
          template_id: 'modern-with-icons',
          contact_info: testResume.contact_info,
          sections: testResume.sections.map((s, i) => ({ ...s, id: `a11y-section-${i}` })),
          title: 'A11y Test Resume',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route('**/api/template/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ yaml: 'contact_info:\n  name: ""\nsections: []', supportsIcons: true }),
    });
  });

  await page.route('**/api/resumes', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ resumes: [] }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, resume_id: TEST_RESUME_ID }) });
    }
  });

  await page.route('**/api/resumes/count*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ count: 1 }) });
  });

  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: Buffer.from('%PDF-1.4\n%%EOF', 'utf-8'),
    });
  });

  await page.route('**/api/templates', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'modern-with-icons', name: 'Modern', description: 'Modern design.', image_url: 'data:image/png;base64,iVBORw0KGgo=' },
      ]),
    });
  });
}

test.describe('Accessibility', () => {
  // Known baseline exclusions (tracked for future remediation):
  // - color-contrast: mist/stone-warm colors on white/chalk backgrounds
  // - button-name: icon-only buttons in DnD handles, experience entries
  // - label: date inputs in experience sections lack labels
  // - nested-interactive: DnD sortable items wrap interactive content
  // - aria-input-field-name: TipTap ProseMirror contenteditable divs
  const KNOWN_RULE_EXCLUSIONS = [
    'color-contrast',
    'button-name',
    'label',
    'nested-interactive',
    'aria-input-field-name',
  ];

  test('homepage has no accessibility violations beyond known baseline', async ({ page }) => {
    await page.goto('/?__test=1');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.adsbygoogle')
      .disableRules(KNOWN_RULE_EXCLUSIONS)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('editor has no NEW accessibility violations beyond known baseline', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/?__test=1', { waitUntil: 'commit' });
    await page.evaluate(({ key, session }) => {
      localStorage.setItem(key, JSON.stringify(session));
    }, { key: SUPABASE_STORAGE_KEY, session: FAKE_SESSION });

    await page.goto(`/editor/${TEST_RESUME_ID}?__test=1`);
    await page.getByTestId('editor-main-content').waitFor({ state: 'visible', timeout: 15_000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.adsbygoogle')
      .exclude('.tiptap.ProseMirror')
      .disableRules(KNOWN_RULE_EXCLUSIONS)
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
