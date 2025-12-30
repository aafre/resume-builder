import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { loginViaAdminMagicLink } from './utils/admin-auth-helpers';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

/**
 * Playwright Global Setup
 *
 * NEW APPROACH: Admin Magic Link + StorageState
 * - Creates test user WITHOUT password (email_confirm: true)
 * - Generates reusable storageState files:
 *   - storage/anon.json: Anonymous session
 *   - storage/user.json: Authenticated session (via admin magic link)
 * - Tests use storageState instead of repeated logins
 *
 * This is faster, more reliable, and matches production auth flow.
 */
export default async function globalSetup() {
  console.log('\n🔧 Playwright Global Setup: Creating storageState files...\n');

  // Validate environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const testUserEmail = process.env.TEST_USER_EMAIL;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase configuration. Please fill in .env.test file.\n' +
      'Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY\n' +
      'Run: supabase status | grep "key"'
    );
  }

  if (!testUserEmail) {
    throw new Error(
      'Missing TEST_USER_EMAIL in .env.test\n' +
      'Use: e2e-test@example.com (local Inbucket address)'
    );
  }

  // Verify we're using local Supabase (not DEV)
  if (!supabaseUrl.includes('localhost')) {
    console.warn('\n⚠️  WARNING: Not using local Supabase!');
    console.warn(`⚠️  Current URL: ${supabaseUrl}`);
    console.warn('⚠️  Expected: http://localhost:54321\n');
    console.warn('⚠️  You may hit rate limits on DEV environment.\n');
  } else {
    console.log(`✅ Using local Supabase: ${supabaseUrl}`);

    // Ensure consistency: all URLs must use 'localhost' (not 127.0.0.1)
    if (supabaseUrl.includes('127.0.0.1')) {
      console.warn('\n⚠️  WARNING: Supabase URL uses 127.0.0.1 instead of localhost');
      console.warn('⚠️  This will cause cookie/localStorage mismatches!');
      console.warn('⚠️  Update VITE_SUPABASE_URL to http://localhost:54321 in .env.test\n');
    }
  }

  // Create Supabase admin client (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    let userId: string;

    // Check if test user already exists
    console.log(`🔍 Checking for existing user: ${testUserEmail}`);

    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === testUserEmail);

    if (existingUser) {
      userId = existingUser.id;
      console.log(`✅ Test user already exists: ${testUserEmail}`);
      console.log(`   User ID: ${userId}`);
    } else {
      // Create new user WITH password for backward compatibility with injectSession()
      console.log(`ℹ️  Creating new test user: ${testUserEmail}`);

      const { data, error} = await supabase.auth.admin.createUser({
        email: testUserEmail,
        email_confirm: true, // Auto-confirm (no email verification needed)
        password: 'test-password-for-automation-only', // For injectSession() backward compat
        user_metadata: {
          name: 'E2E Test User',
        },
      });

      // Handle "already exists" error (race condition or listUsers failed to find it)
      if (error && error.message.includes('already been registered')) {
        console.log(`⚠️  User already exists (detected during creation), retrying listUsers with pagination...`);

        // Retry with full pagination - listUsers may not return all users by default
        let foundUser = null;
        let page = 1;
        const perPage = 100;

        while (!foundUser && page <= 10) { // Max 10 pages = 1000 users
          const { data: pageData } = await supabase.auth.admin.listUsers({
            page,
            perPage
          });

          if (pageData?.users) {
            foundUser = pageData.users.find(u => u.email === testUserEmail);
            if (foundUser) {
              break;
            }
          }

          page++;
        }

        if (!foundUser) {
          throw new Error(
            `User exists but could not be found after searching ${page} pages: ${testUserEmail}\n` +
            `This may indicate a Supabase issue. Try deleting the user manually:\n` +
            `docker exec supabase_db_resume-builder psql -U postgres -d postgres -c "DELETE FROM auth.users WHERE email = '${testUserEmail}';"`
          );
        }

        userId = foundUser.id;
        console.log(`✅ Found existing user (page ${page}): ${testUserEmail}`);
        console.log(`   User ID: ${userId}`);
      } else if (error) {
        throw new Error(`Failed to create test user: ${error.message}`);
      } else if (!data?.user) {
        throw new Error('Test user creation returned no user data');
      } else {
        userId = data.user.id;
        console.log(`✅ Test user created: ${testUserEmail}`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Auth method: Magic link (via admin generateLink)`);
      }
    }

    // Store user ID in environment for tests to use
    process.env.TEST_USER_ID = userId;

    // Clean up any existing test data for this user
    console.log('\n🧹 Cleaning up existing test data...');

    await supabase
      .from('resumes')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('parsed_resumes')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', userId);

    console.log('✅ Test data cleanup complete\n');

    // Create storage directory for storageState files
    const storageDir = path.resolve(__dirname, '../storage');
    fs.mkdirSync(storageDir, { recursive: true });
    console.log(`📁 Storage directory: ${storageDir}\n`);

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

    // --- CREATE ANON STORAGE STATE ---
    console.log('👤 Creating anonymous storageState...');
    {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');

      // Wait for app to initialize auth (creates anon session)
      await page.waitForTimeout(1000);

      const anonStatePath = path.join(storageDir, 'anon.json');
      await context.storageState({ path: anonStatePath });
      console.log(`✅ Anon state saved: ${anonStatePath}`);

      await browser.close();
    }

    // --- CREATE AUTHENTICATED STORAGE STATE ---
    console.log('\n🔐 Creating authenticated storageState...');
    {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');

      // Login via admin magic link (no email polling!)
      await loginViaAdminMagicLink(page, testUserEmail);

      // Wait for auth callback to process (URL has access_token)
      console.log(`   Waiting for auth callback to process...`);

      // The app should redirect from /auth/callback to / after processing token
      // Wait up to 10 seconds for redirect
      try {
        await page.waitForURL((url) => !url.pathname.includes('/auth/callback'), { timeout: 10000 });
        console.log(`✅ Redirected from /auth/callback to: ${page.url()}`);
      } catch {
        console.log(`⚠️  Still on callback URL, manually navigating to home...`);
        await page.goto(baseURL);
        await page.waitForLoadState('networkidle');
      }

      // Wait for Supabase session to be persisted to localStorage
      console.log(`   Current URL after auth: ${page.url()}`);
      console.log(`   Waiting for Supabase session to persist to localStorage...`);

      // Poll localStorage for auth token (Supabase takes time to persist)
      const sessionPersisted = await page.waitForFunction(
        () => {
          const storageKeys = Object.keys(localStorage);
          const authKeys = storageKeys.filter(k => k.includes('sb-') && k.includes('auth-token'));
          if (authKeys.length > 0) {
            // Found auth key, check if it has a session
            try {
              const sessionData = localStorage.getItem(authKeys[0]);
              if (sessionData) {
                const session = JSON.parse(sessionData);
                return !!session.access_token;
              }
            } catch {
              return false;
            }
          }
          return false;
        },
        { timeout: 15000 }
      ).catch(() => false);

      if (sessionPersisted) {
        console.log('✅ Supabase session persisted to localStorage');
      } else {
        console.warn('⚠️  Session not found in localStorage after 15s - saving anyway');

        // Take screenshot for debugging
        const screenshotPath = path.join(storageDir, 'auth-debug.png');
        await page.screenshot({ path: screenshotPath });
        console.warn(`   Screenshot saved: ${screenshotPath}`);

        // Log localStorage contents
        const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
        console.warn(`   localStorage keys: ${localStorageKeys.join(', ')}`);
      }

      // Also check for user menu (optional validation)
      const userMenuSelectors = [
        '[data-testid="user-menu"]',
        'button[aria-label*="account" i]',
        '[class*="user-menu"]'
      ];

      for (const selector of userMenuSelectors) {
        if (await page.locator(selector).isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`✅ User menu visible: ${selector}`);
          break;
        }
      }

      // Mark tour as completed BEFORE saving storageState
      // This ensures all tests using this storageState won't see the tour modal
      console.log('🎯 Marking tour as completed for test user...');
      const now = new Date().toISOString();
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          tour_completed: true,
          created_at: now,
          updated_at: now,
        }, {
          onConflict: 'user_id'  // Specify which column to use for conflict detection
        })
        .select();  // Return the inserted/updated row

      if (prefsError) {
        console.error('⚠️  Failed to set tour_completed:', prefsError);
        // Don't throw - tour will just appear in tests (handled by individual test beforeEach)
      } else {
        console.log('✅ Tour marked as completed');
        console.log(`   Preference record: ${JSON.stringify(prefsData)}`);
      }

      const userStatePath = path.join(storageDir, 'user.json');
      await context.storageState({ path: userStatePath });
      console.log(`✅ User state saved: ${userStatePath}`);

      await browser.close();
    }

    console.log('\n🚀 Ready to run E2E tests!');
    console.log(`   Supabase API: ${supabaseUrl}`);
    console.log(`   Mailpit (emails): http://localhost:54324`);
    console.log(`   Anon state: storage/anon.json`);
    console.log(`   User state: storage/user.json\n`);

  } catch (error) {
    console.error('\n❌ Global setup failed:', error);
    console.error('\nTroubleshooting:');
    console.error('  1. Is local Supabase running? Run: supabase status');
    console.error('  2. Are migrations applied? Run: supabase db push');
    console.error('  3. Are .env.test keys correct? Check: supabase status | grep key\n');
    throw error;
  }
}
