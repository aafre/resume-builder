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
  if (!supabaseUrl.includes('127.0.0.1') && !supabaseUrl.includes('localhost')) {
    console.warn('\n⚠️  WARNING: Not using local Supabase!');
    console.warn(`⚠️  Current URL: ${supabaseUrl}`);
    console.warn('⚠️  Expected: http://127.0.0.1:54321\n');
    console.warn('⚠️  You may hit rate limits on DEV environment.\n');
  } else {
    console.log(`✅ Using local Supabase: ${supabaseUrl}`);
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
      // Create new user WITHOUT password (magic link only)
      console.log(`ℹ️  Creating new test user: ${testUserEmail}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: testUserEmail,
        email_confirm: true, // Auto-confirm (no email verification needed)
        user_metadata: {
          name: 'E2E Test User',
        },
      });

      if (error) {
        throw new Error(`Failed to create test user: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('Test user creation returned no user data');
      }

      userId = data.user.id;
      console.log(`✅ Test user created: ${testUserEmail}`);
      console.log(`   User ID: ${userId}`);
      console.log(`   Auth method: Magic link (via admin generateLink)`);
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

      // Wait for authenticated state to stabilize
      await page.waitForSelector('[data-testid="user-menu"]', { timeout: 15000 });

      const userStatePath = path.join(storageDir, 'user.json');
      await context.storageState({ path: userStatePath });
      console.log(`✅ User state saved: ${userStatePath}`);

      await browser.close();
    }

    console.log('\n🚀 Ready to run E2E tests!');
    console.log(`   Supabase API: ${supabaseUrl}`);
    console.log(`   Mailpit (emails): http://127.0.0.1:54324`);
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
