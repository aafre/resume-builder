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
    let userId: string;

    // Try to sign in first to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (signInData?.user) {
      // User exists and credentials are correct
      console.log(`✅ Test user already exists: ${testUserEmail}`);
      userId = signInData.user.id;
    } else if (signInError?.message?.includes('Invalid login credentials')) {
      // User exists but wrong password - need to update password
      console.log(`⚠️  Test user exists but password mismatch - updating password`);

      // Get user by email using pagination
      let page = 1;
      let found = false;
      while (!found && page < 10) { // Max 10 pages (500 users)
        const { data: usersData } = await supabase.auth.admin.listUsers({ page, perPage: 50 });
        const existingUser = usersData?.users?.find(u => u.email === testUserEmail);

        if (existingUser) {
          userId = existingUser.id;
          // Update password
          await supabase.auth.admin.updateUserById(userId, { password: testUserPassword });
          console.log(`✅ Updated password for test user`);
          found = true;
        }
        page++;
      }

      if (!found) {
        throw new Error('User exists but could not be found in user list');
      }
    } else {
      // User doesn't exist - create new
      const { data, error } = await supabase.auth.admin.createUser({
        email: testUserEmail,
        password: testUserPassword,
        email_confirm: true,
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
