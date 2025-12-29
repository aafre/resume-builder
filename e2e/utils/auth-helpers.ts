import { Page, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Auth Helper Utilities for E2E Tests
 *
 * Provides functions to:
 * - Sign in as test user
 * - Sign out
 * - Check authentication state
 * - Mock OAuth flows
 */

/**
 * Sign in as the test user using email/password
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when user is signed in
 */
export async function signInAsTestUser(page: Page): Promise<void> {
  const testEmail = process.env.TEST_USER_EMAIL!;
  const testPassword = process.env.TEST_USER_PASSWORD!;

  if (!testEmail || !testPassword) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.test');
  }

  // Navigate to landing page
  await page.goto('/');

  // Click "Sign In" button to open auth modal
  await page.click('button:has-text("Sign In")');

  // Wait for auth modal to appear
  await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 5000 });

  // Fill in email and password (if using email/password auth)
  // NOTE: This assumes AuthModal has email/password option
  // If using magic link only, you'll need to modify this

  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);

  // Click sign in button
  await page.click('button[type="submit"]');

  // Wait for user menu to appear (indicates successful sign-in)
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });

  console.log(`✅ Signed in as test user: ${testEmail}`);
}

/**
 * Sign in using Supabase client directly (bypasses UI)
 *
 * Faster than UI-based login, useful for setup in beforeEach hooks.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when session is injected
 */
export async function signInDirectly(page: Page): Promise<void> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
  const testEmail = process.env.TEST_USER_EMAIL!;
  const testPassword = process.env.TEST_USER_PASSWORD!;

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Sign in to get session
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error || !data.session) {
    throw new Error(`Failed to sign in: ${error?.message || 'No session returned'}`);
  }

  // Inject session into browser storage
  await page.goto('/');

  await page.evaluate(
    ({ session }) => {
      // Set session in localStorage (Supabase stores auth state here)
      const key = `sb-${new URL(session.user.user_metadata.supabase_url || location.origin).hostname.split('.')[0]}-auth-token`;

      localStorage.setItem(
        key,
        JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
          user: session.user,
        })
      );
    },
    { session: data.session }
  );

  // Reload to apply session
  await page.reload();

  // Verify user menu appears
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 5000 });

  console.log(`✅ Signed in directly: ${testEmail}`);
}

/**
 * Sign out the current user
 *
 * @param page - Playwright Page object
 */
export async function signOut(page: Page): Promise<void> {
  // Click user menu
  await page.click('[data-testid="user-menu"]');

  // Click sign out button
  await page.click('button:has-text("Sign Out")');

  // Wait for user menu to disappear
  await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible({ timeout: 5000 });

  console.log('✅ Signed out');
}

/**
 * Check if user is authenticated
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves to true if authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Mock Google OAuth flow
 *
 * Intercepts OAuth redirect and injects test token.
 *
 * @param page - Playwright Page object
 */
export async function mockGoogleOAuth(page: Page): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

  // Intercept OAuth authorize request
  await page.route('**/auth/v1/authorize**', (route) => {
    // Simulate OAuth callback with test token
    route.fulfill({
      status: 302,
      headers: {
        Location: `${baseURL}/auth/callback#access_token=test-token&refresh_token=test-refresh&expires_in=3600`,
      },
    });
  });

  console.log('✅ Google OAuth mock enabled');
}
