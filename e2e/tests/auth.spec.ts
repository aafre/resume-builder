import { test, expect } from '@playwright/test';
import { signInDirectly, signOut, isAuthenticated } from '../utils/auth-helpers';
import { cleanupTestResumes } from '../utils/db-helpers';

/**
 * Authentication E2E Tests
 *
 * Tests critical authentication flows:
 * 1. Anonymous session creation
 * 2. Email/password sign-in
 * 3. Sign-out
 * 4. Session persistence across page reloads
 */

test.describe('Authentication Flows', () => {
  // Clean up test data after each test
  test.afterEach(async () => {
    await cleanupTestResumes();
  });

  test('should create anonymous session for unauthenticated users', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Verify page loads
    await expect(page).toHaveTitle(/Resume Builder|EasyFreeResume/i);

    // Navigate to templates page (should work for anonymous users)
    await page.goto('/templates');

    // Verify user is NOT authenticated (no user menu)
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);

    // Verify user can access editor as anonymous
    const templateCard = page.locator('[data-testid="template-card"]').first();
    if (await templateCard.isVisible()) {
      await templateCard.click();

      // Should redirect to editor
      await expect(page).toHaveURL(/\/editor\?template=/, { timeout: 10000 });

      // Verify editor loads
      await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 10000 });
    }
  });

  test.skip('should sign in with email and password', async ({ page }) => {
    // SKIPPED: Requires Flask backend to be running
    // TODO: Implement UI-based sign-in flow
    await signInDirectly(page);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test.skip('should persist session across page reloads', async ({ page }) => {
    // SKIPPED: Requires Flask backend to be running
    // TODO: Implement after sign-in flow is working
    await signInDirectly(page);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });
  });

  test.skip('should sign out successfully', async ({ page }) => {
    // SKIPPED: Requires Flask backend to be running
    // TODO: Implement after sign-in flow is working
    await signInDirectly(page);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await signOut(page);
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  });

  test('should allow navigation to public pages when unauthenticated', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Navigate to templates
    await page.goto('/templates');
    await expect(page).toHaveURL('/templates');

    // Navigate to privacy policy (if exists)
    await page.goto('/privacy');
    await expect(page).toHaveURL('/privacy');
  });

  test('should block /my-resumes page for unauthenticated users', async ({ page }) => {
    // Try to navigate to /my-resumes without authentication
    await page.goto('/my-resumes');

    // Should show sign-in required gate OR redirect to login
    const signInRequired = page.locator('text=/sign in|login/i');
    await expect(signInRequired).toBeVisible({ timeout: 5000 });
  });

  test.skip('should allow access to /my-resumes after sign-in', async ({ page }) => {
    // SKIPPED: Requires Flask backend to be running
    // TODO: Implement after sign-in flow is working
    await signInDirectly(page);
    await page.goto('/my-resumes');
    await expect(page).toHaveURL('/my-resumes');
    await expect(page.locator('text=/my resumes/i')).toBeVisible();
  });
});
