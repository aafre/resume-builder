/**
 * Tier 1: Anonymous Critical Path Tests
 *
 * These tests cover the core user journey without real auth/Supabase.
 * They use API route mocking + localStorage session injection.
 *
 * Test mode (?__test=1) disables tour and CSS animations.
 */

import { test, expect, Page } from '@playwright/test';
import { createResumeWithExperience } from '../fixtures/test-data';

// Shared mock data
const TEST_RESUME_ID = 'e2e-test-resume-001';
const TEST_TEMPLATE_ID = 'modern-with-icons';
const testResume = createResumeWithExperience();

// Supabase project ref extracted from VITE_SUPABASE_URL
// The localStorage key format is: sb-{project-ref}-auth-token
const SUPABASE_STORAGE_KEY = 'sb-mgetvioaymkvafczmhwo-auth-token';

/**
 * Fake Supabase session for localStorage injection.
 * This makes the AuthContext think a valid anonymous session exists,
 * bypassing the need for a real Supabase instance.
 */
const FAKE_SESSION = {
  access_token: 'e2e-mock-access-token-' + Date.now(),
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'e2e-mock-refresh-token',
  user: {
    id: 'e2e-mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: null,
    is_anonymous: true,
    app_metadata: { provider: 'anonymous', providers: ['anonymous'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
};

/**
 * Set up all route mocks needed for the editor to function.
 */
async function setupEditorMocks(page: Page) {
  // Mock Supabase auth endpoints (token refresh, user info)
  await page.route('**/auth/v1/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/token')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(FAKE_SESSION),
      });
    } else if (url.includes('/user')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(FAKE_SESSION.user),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  // Mock Supabase REST endpoints (user_preferences, conversion_tracking)
  await page.route('**/rest/v1/**', async (route) => {
    const url = route.request().url();

    if (url.includes('user_preferences')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ tour_completed: true, idle_nudge_shown: true }]),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  // Mock resume fetch by ID
  await page.route(`**/api/resumes/${TEST_RESUME_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resume: {
          id: TEST_RESUME_ID,
          template_id: TEST_TEMPLATE_ID,
          contact_info: testResume.contact_info,
          sections: testResume.sections.map((s, i) => ({ ...s, id: `section-${i}` })),
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ resumes: [] }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, resume_id: TEST_RESUME_ID }),
      });
    }
  });

  await page.route('**/api/resumes/count*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: 1 }),
    });
  });

  // Mock PDF generation - return minimal PDF bytes
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
}

/**
 * Navigate to the editor with mocks and fake session.
 */
async function gotoEditor(page: Page) {
  await setupEditorMocks(page);

  // Inject fake Supabase session into localStorage BEFORE page load
  // We need to navigate first to set the origin, then inject, then navigate to editor
  await page.goto('/?__test=1', { waitUntil: 'commit' });
  await page.evaluate(({ key, session }) => {
    localStorage.setItem(key, JSON.stringify(session));
  }, { key: SUPABASE_STORAGE_KEY, session: FAKE_SESSION });

  // Now navigate to editor — Supabase will find the session in localStorage
  await page.goto(`/editor/${TEST_RESUME_ID}?__test=1`);
  await page.getByTestId('editor-main-content').waitFor({ state: 'visible', timeout: 15_000 });
}

// ─── Test 1: Homepage → Templates ────────────────────────────────────────────

test.describe('Homepage and Templates', () => {
  test('homepage loads and can navigate to templates', async ({ page }) => {
    await page.goto('/?__test=1');
    await expect(page).toHaveTitle(/EasyFreeResume/i);

    // Navigate to templates
    await page.goto('/templates?__test=1');
    await expect(page.locator('h1').first()).toContainText(/template/i);
  });
});

// ─── Tests 2-4: Editor section management ────────────────────────────────────

test.describe('Editor Section Management', () => {
  test.beforeEach(async ({ page }) => {
    await gotoEditor(page);
  });

  test('editor loads with correct contact info and sections', async ({ page }) => {
    // Contact info populated from mock data
    await expect(page.getByTestId('contact-name-input')).toHaveValue('E2E Test User');
    await expect(page.getByTestId('contact-email-input')).toHaveValue('e2e-test@example.com');

    // 3 sections: Summary, Experience, Skills
    await expect(page.getByTestId('editor-section-0')).toBeVisible();
    await expect(page.getByTestId('editor-section-1')).toBeVisible();
    await expect(page.getByTestId('editor-section-2')).toBeVisible();
  });

  test('editing contact name updates the value', async ({ page }) => {
    const nameInput = page.getByTestId('contact-name-input');
    await nameInput.clear();
    await nameInput.fill('Updated Name');
    await expect(nameInput).toHaveValue('Updated Name');
  });

  test('add new section via section type modal', async ({ page }) => {
    const sectionsBefore = await page.getByTestId(/^editor-section-\d+$/).count();

    // Open section type modal
    await page.getByTestId('add-section-button').click();
    await expect(page.getByTestId('section-type-modal')).toBeVisible();

    // Pick "Bulleted List" and confirm
    await page.getByTestId('section-type-option-bulleted-list').click();
    await page.getByTestId('section-type-confirm').click();

    // Modal closed, section added
    await expect(page.getByTestId('section-type-modal')).not.toBeVisible();
    await expect(page.getByTestId(/^editor-section-\d+$/)).toHaveCount(sectionsBefore + 1);
  });

  test('delete a section removes it', async ({ page }) => {
    const sectionsBefore = await page.getByTestId(/^editor-section-\d+$/).count();
    expect(sectionsBefore).toBeGreaterThan(0);

    // Click the last section's delete button
    await page.getByTestId('section-delete-button').last().click();

    // Wait for and click the "Delete" confirmation button in the dialog
    // Use exact match + last() to target the dialog's red Delete button (not DnD handles)
    const confirmBtn = page.getByRole('button', { name: 'Delete', exact: true }).last();
    await confirmBtn.waitFor({ state: 'visible', timeout: 3000 });
    await confirmBtn.click();

    // Wait for section to be removed
    await expect(page.getByTestId(/^editor-section-\d+$/)).toHaveCount(sectionsBefore - 1, { timeout: 5000 });
  });
});

// ─── Tests 5-6: PDF Preview and Download ─────────────────────────────────────

test.describe('PDF Generation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoEditor(page);
  });

  test('preview PDF shows preview modal', async ({ page }) => {
    // Click Preview — this triggers: save → validate → open modal → generate
    await page.getByTestId('preview-button').click();

    // Wait for preview modal to appear (it opens before generation completes)
    await expect(page.getByTestId('preview-modal-container')).toBeVisible({ timeout: 15_000 });

    // Wait for the generate API call to complete
    await page.waitForResponse(
      (r) => r.url().includes('/api/generate') && r.status() === 200,
      { timeout: 15_000 }
    );
  });

  test('download PDF triggers file download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });
});
