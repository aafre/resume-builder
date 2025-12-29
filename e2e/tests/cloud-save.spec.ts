import { test, expect } from '@playwright/test';
import { signInDirectly } from '../utils/auth-helpers';
import { cleanupTestResumes } from '../utils/db-helpers';

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
    // Navigate to editor with template
    await page.goto('/editor?template=classic-alex-rivera');
    await page.waitForLoadState('networkidle');

    // Close tour modal if present
    const skipTourButton = page.locator('button').filter({ hasText: /skip tour/i }).first();
    if (await skipTourButton.isVisible({ timeout: 2000 })) {
      await skipTourButton.click();
      await page.waitForTimeout(500);
    }

    // Wait for editor to load
    const nameInput = page.getByPlaceholder('Enter your name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

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

    // Check the URL - it should have a resume ID after save
    const urlBeforeReload = page.url();
    console.log(`URL before reload: ${urlBeforeReload}`);

    // Check if URL has resume ID or still has template param
    if (urlBeforeReload.includes('template=')) {
      console.log('⚠️  URL still contains template parameter - resume may not have been saved with proper ID');
    } else if (urlBeforeReload.includes('resume=')) {
      console.log('✅ URL contains resume ID - data should persist');
    }

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
    // Navigate to editor
    await page.goto('/editor?template=classic-alex-rivera');
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
    await page.goto('/editor?template=classic-alex-rivera');
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
});
