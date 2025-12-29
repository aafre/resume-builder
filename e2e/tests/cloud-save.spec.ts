import { test, expect } from '@playwright/test';
import { signInDirectly } from '../utils/auth-helpers';
import { cleanupTestResumes, createResumeFromTemplate } from '../utils/db-helpers';

/**
 * Cloud Save E2E Tests
 *
 * Tests cloud save functionality and database persistence:
 * 1. Auto-save after editing (database write)
 * 2. Data persistence after full page reload (database read)
 * 3. Save status indicator updates
 */

test.describe('Cloud Save & Database Persistence', () => {
  test.afterEach(async () => {
    await cleanupTestResumes();
  });

  test.beforeEach(async ({ page }) => {
    // Sign in (required for cloud save)
    await signInDirectly(page);
  });

  test('should persist data after full page reload (database save)', async ({ page }) => {
    // Create resume from template using proper flow
    const resumeId = await createResumeFromTemplate(page, 'classic-alex-rivera', true);

    // Navigate to editor with resume ID (NOT template query param)
    await page.goto(`/editor/${resumeId}`);
    await page.waitForLoadState('networkidle');

    // Wait longer for editor to load (may take time with data fetch)
    await page.waitForTimeout(2000);

    // Close tour modal if present
    const skipTourButton = page.locator('button').filter({ hasText: /skip tour/i }).first();
    const hasTour = await skipTourButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasTour) {
      await skipTourButton.click();
      await page.waitForTimeout(500);
    }

    // Wait for editor to load
    const nameInput = page.getByPlaceholder('Enter your name');
    await expect(nameInput).toBeVisible({ timeout: 15000 });

    // Type unique data into the name field
    const uniqueName = `Test User ${Date.now()}`;
    await nameInput.clear();
    await nameInput.fill(uniqueName);

    // Wait for auto-save to complete (3.5s debounce + network)
    // Look for save status in sidebar or header (not in resume content)
    const saveStatus = page.locator('[class*="save"], [class*="status"]').locator('text=/saved|unsaved|saving/i').first();

    // Wait for "Saving..." indicator
    await page.waitForTimeout(4000); // Wait for debounce

    // Try to find "Saved" status indicator (various possible locations)
    const savedIndicators = [
      page.locator('text=/saved just now/i').first(),
      page.locator('text=/saved \\d+ (second|minute)s? ago/i').first(),
      page.locator('[class*="save"]').locator('text=/saved/i').first()
    ];

    let foundSaved = false;
    for (const indicator of savedIndicators) {
      const visible = await indicator.isVisible({ timeout: 5000 }).catch(() => false);
      if (visible) {
        foundSaved = true;
        const text = await indicator.textContent();
        console.log(`✅ Auto-save completed: "${text}"`);
        break;
      }
    }

    if (!foundSaved) {
      console.log('⚠️  Save status indicator not found, waiting additional time...');
      await page.waitForTimeout(3000);
    }

    // Additional wait to ensure database write completed
    await page.waitForTimeout(1000);

    // Verify URL contains resume ID (not template)
    const urlBeforeReload = page.url();
    console.log(`URL before reload: ${urlBeforeReload}`);

    expect(urlBeforeReload).toContain(`/editor/${resumeId}`);
    expect(urlBeforeReload).not.toContain('template=');
    console.log('✅ URL correctly uses resume ID path parameter');

    // Perform FULL page reload (not soft navigation)
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for editor to reload
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Verify data persisted from database
    const reloadedValue = await nameInput.inputValue();

    console.log(`Expected value: "${uniqueName}"`);
    console.log(`Reloaded value: "${reloadedValue}"`);

    // Assert that the value persisted after reload
    expect(reloadedValue).toBe(uniqueName);

    console.log('✅ Data persisted after full page reload (database read confirmed)');
  });

  test('should show save status indicator transitions', async ({ page }) => {
    // Create resume from template
    const resumeId = await createResumeFromTemplate(page, 'classic-alex-rivera', true);

    // Navigate to editor
    await page.goto(`/editor/${resumeId}`);
    await page.waitForLoadState('networkidle');

    // Close tour modal
    const skipTourButton = page.locator('button').filter({ hasText: /skip tour/i }).first();
    if (await skipTourButton.isVisible({ timeout: 2000 })) {
      await skipTourButton.click();
      await page.waitForTimeout(500);
    }

    const nameInput = page.getByPlaceholder('Enter your name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Initial state should be "Saved" or "Unsaved"
    const saveStatus = page.locator('text=/saved|unsaved|saving/i').nth(1); // Sidebar indicator
    const initialStatus = await saveStatus.textContent();
    console.log(`Initial save status: "${initialStatus}"`);

    // Make a change
    await nameInput.clear();
    await nameInput.fill(`Test ${Date.now()}`);

    // Wait for debounce and auto-save
    await page.waitForTimeout(4000);

    // Should transition to "Saving..."
    const savingVisible = await page.locator('text=/saving/i').isVisible({ timeout: 2000 }).catch(() => false);

    if (savingVisible) {
      console.log('✅ "Saving..." indicator appeared');
    }

    // Should eventually show "Saved"
    await expect(saveStatus).toHaveText(/saved/i, { timeout: 10000 });
    console.log('✅ Save status transitioned to "Saved"');
  });

  test('should auto-save multiple field edits', async ({ page }) => {
    // Create resume from template
    const resumeId = await createResumeFromTemplate(page, 'classic-alex-rivera', true);

    await page.goto(`/editor/${resumeId}`);
    await page.waitForLoadState('networkidle');

    // Close tour modal
    const skipTourButton = page.locator('button').filter({ hasText: /skip tour/i }).first();
    if (await skipTourButton.isVisible({ timeout: 2000 })) {
      await skipTourButton.click();
      await page.waitForTimeout(500);
    }

    // Edit multiple fields
    const nameInput = page.getByPlaceholder('Enter your name');
    const emailInput = page.getByPlaceholder('Enter your email');

    const uniqueName = `Test User ${Date.now()}`;
    const uniqueEmail = `test${Date.now()}@example.com`;

    await nameInput.clear();
    await nameInput.fill(uniqueName);

    await emailInput.clear();
    await emailInput.fill(uniqueEmail);

    // Wait for auto-save
    await page.waitForTimeout(5000);

    // Look for "Saved" indicator (avoiding resume content)
    const savedIndicators = [
      page.locator('text=/saved just now/i').first(),
      page.locator('text=/saved \\d+ (second|minute)s? ago/i').first(),
      page.locator('[class*="save"]').locator('text=/saved/i').first()
    ];

    let foundSaved = false;
    for (const indicator of savedIndicators) {
      const visible = await indicator.isVisible({ timeout: 8000 }).catch(() => false);
      if (visible) {
        foundSaved = true;
        const text = await indicator.textContent();
        console.log(`✅ Auto-save completed: "${text}"`);
        break;
      }
    }

    if (!foundSaved) {
      console.log('⚠️  Save status indicator not found, but continuing test...');
    }

    // Reload and verify both fields
    await page.reload({ waitUntil: 'networkidle' });

    const reloadedName = await nameInput.inputValue();
    const reloadedEmail = await emailInput.inputValue();

    expect(reloadedName).toBe(uniqueName);
    expect(reloadedEmail).toBe(uniqueEmail);

    console.log('✅ Multiple field edits persisted after reload');
  });

  test('should handle deprecated template URL pattern gracefully', async ({ page }) => {
    // Try accessing editor with old ?template=X pattern (NO LONGER SUPPORTED)
    await page.goto('/editor?template=classic-alex-rivera');
    await page.waitForLoadState('networkidle');

    // Wait a moment for any redirects or error handling
    await page.waitForTimeout(2000);

    const currentURL = page.url();
    console.log(`Current URL after navigating to deprecated pattern: ${currentURL}`);

    // The app should either:
    // 1. Redirect to home page or templates page
    // 2. Show an error message
    // 3. Redirect to a proper /editor/<uuid> after creating a resume

    const isOnEditor = currentURL.includes('/editor/');
    const isOnHome = currentURL === 'http://localhost:5173/' || currentURL.endsWith('/');
    const isOnTemplates = currentURL.includes('/templates');

    if (isOnEditor) {
      // App created a resume and redirected - verify it's using UUID pattern
      const hasUUID = /\/editor\/[0-9a-f-]{36}/.test(currentURL);
      expect(hasUUID).toBeTruthy();
      expect(currentURL).not.toContain('template=');
      console.log('✅ App created resume and redirected to proper UUID pattern');
    } else if (isOnHome || isOnTemplates) {
      console.log('✅ App redirected away from deprecated pattern');
    } else {
      // Check for error message on the page
      const errorMessage = await page.locator('text=/error|not found|invalid/i').first().isVisible({ timeout: 3000 }).catch(() => false);
      if (errorMessage) {
        console.log('✅ App shows error message for deprecated pattern');
      } else {
        throw new Error(`Unexpected behavior: URL is "${currentURL}" and no error shown for deprecated ?template=X pattern`);
      }
    }
  });
});
