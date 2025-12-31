/**
 * Admin Magic Link Authentication for E2E Testing
 *
 * Uses Supabase Admin API to generate deterministic magic links,
 * bypassing email inbox while matching production auth flow.
 *
 * This is faster, more reliable, and CI-friendly than:
 * - Password auth (doesn't exist in production UI)
 * - Email polling (slow, flaky, requires Mailpit/Inbucket)
 */

import type { Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Login via Admin-generated magic link (no email inbox required)
 *
 * Uses Supabase Admin API to generate a magic link, then navigates
 * the browser to the action_link. This is the same auth mechanism
 * as production (OTP/magic link) but deterministic and instant.
 *
 * @param page - Playwright page object
 * @param email - User email address
 * @returns Promise<void>
 *
 * @example
 * await loginViaAdminMagicLink(page, 'test@example.com');
 * await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
 */
export async function loginViaAdminMagicLink(page: Page, email: string): Promise<void> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const redirectTo = process.env.E2E_REDIRECT_URL || 'http://localhost:5173/auth/callback';

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      'Missing Supabase credentials:\n' +
      '  VITE_SUPABASE_URL: ' + (supabaseUrl ? 'set' : 'MISSING') + '\n' +
      '  SUPABASE_SECRET_KEY: ' + (secretKey ? 'set' : 'MISSING')
    );
  }

  console.log(`🔐 Logging in via Admin magic link: ${email}`);

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  if (error) {
    throw new Error(`generateLink failed: ${error.message}`);
  }

  const link = data?.properties?.action_link;
  if (!link) {
    throw new Error('No action_link returned by generateLink');
  }

  console.log(`✅ Magic link generated`);
  console.log(`   Navigating to action_link...`);

  // Navigate to magic link (auto-authenticates)
  await page.goto(link);
  await page.waitForLoadState('networkidle');

  console.log(`✅ Authenticated as: ${email}`);
}

/**
 * DEPRECATED: Use loginViaAdminMagicLink() instead
 *
 * Old function kept for backward compatibility during migration.
 */
export async function signInWithMagicLink(page: Page, email?: string): Promise<void> {
  console.warn('⚠️  DEPRECATED: signInWithMagicLink() is deprecated.');
  console.warn('⚠️  Use loginViaAdminMagicLink() instead (faster, no email polling).');

  const testEmail = email || process.env.TEST_USER_EMAIL || 'e2e-test@example.com';
  await loginViaAdminMagicLink(page, testEmail);
}

/**
 * DEPRECATED: Use storageState instead
 *
 * Old function kept for backward compatibility during migration.
 */
export async function injectSession(page: Page, email?: string): Promise<void> {
  console.warn('⚠️  DEPRECATED: injectSession() is deprecated.');
  console.warn('⚠️  Use test.use({ storageState: "storage/user.json" }) instead.');

  const testEmail = email || process.env.TEST_USER_EMAIL || 'e2e-test@example.com';
  await loginViaAdminMagicLink(page, testEmail);
}
