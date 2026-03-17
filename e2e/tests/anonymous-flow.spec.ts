/**
 * Tier 1: Anonymous Critical Path Tests
 *
 * These tests cover the core user journey without real auth/Supabase.
 * They use API route mocking + localStorage session injection.
 *
 * Test mode (?__test=1) disables tour and CSS animations.
 */

import { test, expect } from '@playwright/test';
import { gotoEditor } from '../utils/mock-helpers';

const TEST_RESUME_ID = 'e2e-test-resume-001';

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
    await gotoEditor(page, TEST_RESUME_ID);
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
    await gotoEditor(page, TEST_RESUME_ID);
  });

  test('preview PDF opens preview modal and calls generate API', async ({ page }) => {
    // Set up response listener BEFORE clicking to avoid race condition
    const generateCalled = page.waitForRequest(
      (r) => r.url().includes('/api/generate') && r.method() === 'POST',
      { timeout: 15_000 }
    );

    // Click Preview — this triggers: save → validate → open modal → generate
    await page.getByTestId('preview-button').click();

    // Verify modal opens and generate API was called
    await expect(page.getByTestId('preview-modal-container')).toBeVisible({ timeout: 15_000 });
    await generateCalled;
  });

  test('download PDF triggers file download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });
});
