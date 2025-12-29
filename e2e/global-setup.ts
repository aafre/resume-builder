import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

/**
 * Playwright Global Setup
 *
 * Runs once before all tests.
 * Creates dedicated test user for E2E tests and stores user ID in env.
 *
 * IMPORTANT: This requires SUPABASE_SERVICE_ROLE_KEY to bypass RLS
 * and use admin APIs.
 */
export default async function globalSetup() {
  console.log('\n🔧 Playwright Global Setup: Creating test user...\n');

  // Validate environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const testUserEmail = process.env.TEST_USER_EMAIL;
  const testUserPassword = process.env.TEST_USER_PASSWORD;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase configuration. Please fill in .env.test file.\n' +
      'Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  if (!testUserEmail || !testUserPassword) {
    throw new Error(
      'Missing test user credentials. Please fill in TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.test'
    );
  }

  // Create Supabase admin client (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if test user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();

    const existingUser = existingUsers?.users?.find(
      (user) => user.email === testUserEmail
    );

    let userId: string;

    if (existingUser) {
      console.log(`✅ Test user already exists: ${testUserEmail}`);
      userId = existingUser.id;
    } else {
      // Create new test user
      const { data, error } = await supabase.auth.admin.createUser({
        email: testUserEmail,
        password: testUserPassword,
        email_confirm: true, // Auto-confirm email
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
      console.log(`✅ Test user created: ${testUserEmail} (ID: ${userId})`);
    }

    // Store user ID in environment for tests to use
    process.env.TEST_USER_ID = userId;

    // Clean up any existing test data for this user
    console.log('🧹 Cleaning up existing test data...');

    await supabase
      .from('resumes')
      .delete()
      .eq('user_id', userId);

    await supabase
      .from('parsed_resumes')
      .delete()
      .eq('user_id', userId);

    console.log('✅ Test data cleanup complete\n');
    console.log('🚀 Ready to run E2E tests!\n');

  } catch (error) {
    console.error('\n❌ Global setup failed:', error);
    throw error;
  }
}
