import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

/**
 * Playwright Global Setup
 *
 * CHANGES FOR LOCAL SUPABASE + MAGIC LINK AUTH:
 * - Uses local Supabase URL/keys from .env.test
 * - Creates test user WITHOUT password (magic link only)
 * - Skips email confirmation (local config: enable_confirmations = false)
 * - Validates that we're using local Supabase (not DEV)
 *
 * Runs once before all tests.
 * Creates dedicated test user for E2E tests and stores user ID in env.
 *
 * IMPORTANT: This requires SUPABASE_SERVICE_ROLE_KEY to bypass RLS
 * and use admin APIs.
 */
export default async function globalSetup() {
  console.log('\n🔧 Playwright Global Setup: Configuring local Supabase...\n');

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
      // Create new user
      // NOTE: We create with a password for FAST test automation (injectSession),
      // but production UI only shows magic link. Best of both worlds!
      console.log(`ℹ️  Creating new test user: ${testUserEmail}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: testUserEmail,
        email_confirm: true, // Auto-confirm (local config allows this)
        password: 'test-password-for-automation-only', // For fast session injection in tests
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
      console.log(`   Auth methods: Magic link (UI) + Password (test automation)`);
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
    console.log('🚀 Ready to run E2E tests against local Supabase!');
    console.log(`   Supabase API: ${supabaseUrl}`);
    console.log(`   Inbucket (emails): http://127.0.0.1:54324\n`);

  } catch (error) {
    console.error('\n❌ Global setup failed:', error);
    console.error('\nTroubleshooting:');
    console.error('  1. Is local Supabase running? Run: supabase status');
    console.error('  2. Are migrations applied? Run: supabase db push');
    console.error('  3. Are .env.test keys correct? Check: supabase status | grep key\n');
    throw error;
  }
}
