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

  test('should sign in with email and password', async ({ page }) => {
    // Sign in using direct method (faster than UI)
    await signInDirectly(page);

    // Verify user menu appears
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Verify user is authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Verify user email in menu (if displayed)
    const userMenu = page.locator('[data-testid="user-menu"]');
    await userMenu.click();

    // Check for test user email
    const testEmail = process.env.TEST_USER_EMAIL;
    if (testEmail) {
      await expect(page.locator(`text=${testEmail}`)).toBeVisible();
    }
  });

  test('should persist session across page reloads', async ({ page }) => {
    // Sign in
    await signInDirectly(page);

    // Verify authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Reload page
    await page.reload();

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify still authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });

    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should sign out successfully', async ({ page }) => {
    // Sign in first
    await signInDirectly(page);

    // Verify authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Sign out
    await signOut(page);

    // Verify user menu disappears
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();

    // Verify not authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
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

  test('should allow access to /my-resumes after sign-in', async ({ page }) => {
    // Sign in
    await signInDirectly(page);

    // Navigate to /my-resumes
    await page.goto('/my-resumes');

    // Should show My Resumes page
    await expect(page).toHaveURL('/my-resumes');
    await expect(page.locator('text=/my resumes/i')).toBeVisible();
  });
});
