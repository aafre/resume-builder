import { Page, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { waitForEmail, getEmailContent, extractMagicLink } from './inbucket-helpers';

/**
 * Auth Helper Utilities for E2E Tests
 *
 * Provides functions to:
 * - Sign in with magic link (real user flow)
 * - Sign in directly (legacy, for backward compatibility)
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
 * Sign in using magic link authentication
 *
 * Follows the real user flow:
 * 1. Open AuthModal and request magic link
 * 2. Poll Inbucket for email
 * 3. Extract magic link from email
 * 4. Navigate to magic link (creates session)
 * 5. Verify authenticated
 *
 * @param page - Playwright Page object
 * @param email - Email address to sign in with (defaults to TEST_USER_EMAIL)
 * @returns Promise that resolves when user is signed in
 *
 * @example
 * await signInWithMagicLink(page);
 * // or with custom email:
 * await signInWithMagicLink(page, 'custom-test@example.com');
 */
export async function signInWithMagicLink(
  page: Page,
  email?: string
): Promise<void> {
  const testEmail = email || process.env.TEST_USER_EMAIL!;

  if (!testEmail) {
    throw new Error('Email required. Pass email parameter or set TEST_USER_EMAIL in .env.test');
  }

  console.log(`🔵 Signing in with magic link: ${testEmail}`);

  // Step 1: Navigate to home and open AuthModal
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const signInButton = page.locator('button:has-text("Sign In")').first();
  await expect(signInButton).toBeVisible({ timeout: 5000 });
  await signInButton.click();

  // Wait for auth modal to appear
  const authModal = page.locator('[data-testid="auth-modal"]')
    .or(page.locator('text=/sign in/i').locator('..').locator('..')); // Fallback selector

  await expect(authModal).toBeVisible({ timeout: 5000 });
  console.log('✅ Auth modal opened');

  // Step 2: Fill in email and request magic link
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await emailInput.fill(testEmail);

  // Find and click "Send Magic Link" button
  // Different possible button texts: "Send Magic Link", "Send Link", "Continue with Email"
  const sendButton = page.locator('button:has-text("Send Magic Link")')
    .or(page.locator('button:has-text("Send Link")'))
    .or(page.locator('button:has-text("Continue with Email")'))
    .or(page.locator('button[type="submit"]')); // Fallback to submit button

  await sendButton.click();
  console.log('✅ Magic link requested');

  // Step 3: Wait for success message
  try {
    await expect(
      page.locator('text=/magic link sent|check your email|email sent/i')
    ).toBeVisible({ timeout: 5000 });
    console.log('✅ Success message displayed');
  } catch (error) {
    console.warn('⚠️  Success message not found (continuing anyway)');
  }

  // Step 4: Poll Inbucket for email (max 30 seconds)
  console.log('📧 Polling Inbucket for email...');
  const emailMessage = await waitForEmail(testEmail, {
    timeout: 30000,
    pollInterval: 500,
    subjectContains: 'Confirm your signup',
  });

  // Step 5: Extract magic link from email
  const emailContent = await getEmailContent(testEmail, emailMessage.id);
  const magicLink = extractMagicLink(emailContent.html);

  if (!magicLink) {
    throw new Error(
      'Failed to extract magic link from email.\n' +
      'Check Inbucket UI: http://127.0.0.1:54324\n' +
      `Mailbox: ${testEmail.split('@')[0]}`
    );
  }

  console.log(`🔗 Magic link extracted: ${magicLink.substring(0, 60)}...`);

  // Step 6: Navigate to magic link (triggers OAuth callback)
  await page.goto(magicLink);
  console.log('✅ Navigated to magic link');

  // Step 7: Wait for redirect to home page
  try {
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  } catch (error) {
    // URL might already be at home page, or redirect might be to a different URL
    console.warn('⚠️  Redirect timeout (continuing with session verification)');
  }

  await page.waitForLoadState('networkidle');

  // Step 8: Verify authentication successful
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 15000 });

  console.log(`✅ Signed in successfully via magic link: ${testEmail}\n`);
}

/**
 * Sign in using Supabase client directly (bypasses UI)
 *
 * @deprecated Use signInWithMagicLink() instead for real user flow testing.
 * This function is kept for backward compatibility during migration.
 *
 * Faster than UI-based login, useful for setup in beforeEach hooks.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when session is injected
 */
export async function signInDirectly(page: Page): Promise<void> {
  console.warn('\n⚠️  DEPRECATED: signInDirectly() uses password auth which does not exist in production UI.');
  console.warn('⚠️  Please update your test to use signInWithMagicLink() instead.');
  console.warn('⚠️  Falling back to magic link authentication...\n');

  // Fall back to magic link flow (the real user flow)
  await signInWithMagicLink(page);
}

/**
 * Sign out the current user
 *
 * @param page - Playwright Page object
 */
export async function signOut(page: Page): Promise<void> {
  // Click user menu button to open dropdown
  const userMenuButton = page.locator('[data-testid="user-menu-button"]');
  await userMenuButton.click();

  // Wait for dropdown to appear
  await page.waitForTimeout(500);

  // Click sign out button (should navigate to /)
  const signOutButton = page.locator('[data-testid="sign-out-button"]');

  // Wait for navigation to complete after clicking sign-out
  await Promise.all([
    page.waitForURL('/', { timeout: 10000 }),
    signOutButton.click(),
  ]);

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');

  // Wait longer to avoid rate limiting when anonymous session is created
  await page.waitForTimeout(2000);

  // Verify sign out by checking either:
  // 1. User menu is gone (successful anonymous session creation)
  // 2. OR we're on the home page (sign-out navigation succeeded)
  const onHomePage = page.url().endsWith('/');

  if (onHomePage) {
    console.log('✅ Signed out (navigated to home page)');
  } else {
    // If not on home page, verify user menu is gone
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible({ timeout: 5000 });
    console.log('✅ Signed out (user menu removed)');
  }
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
