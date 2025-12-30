import { createClient } from '@supabase/supabase-js';

/**
 * Database Helper Utilities for E2E Tests
 *
 * Provides functions to:
 * - Clean up test data between tests
 * - Seed test data
 * - Create test resumes
 */

/**
 * Get Supabase admin client (bypasses RLS)
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not found in environment');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Clean up all test resumes for a given user
 *
 * @param userId - User ID to clean up resumes for
 */
export async function cleanupTestResumes(userId?: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const targetUserId = userId || process.env.TEST_USER_ID;

  if (!targetUserId) {
    console.warn('⚠️  No user ID provided for cleanup, skipping');
    return;
  }

  try {
    // Delete resumes
    const { error: resumesError } = await supabase
      .from('resumes')
      .delete()
      .eq('user_id', targetUserId);

    if (resumesError) {
      console.error('Error deleting resumes:', resumesError);
    }

    // Delete parsed resumes cache
    const { error: parsedError } = await supabase
      .from('parsed_resumes')
      .delete()
      .eq('user_id', targetUserId);

    if (parsedError) {
      console.error('Error deleting parsed resumes:', parsedError);
    }

    // Delete user preferences
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', targetUserId);

    if (prefsError) {
      console.error('Error deleting user preferences:', prefsError);
    }

    console.log(`✅ Cleaned up test data for user: ${targetUserId}`);
  } catch (error) {
    console.error('Database cleanup failed:', error);
    throw error;
  }
}

/**
 * Create a test resume in the database
 *
 * @param data - Resume data
 * @returns Resume ID
 */
export async function createTestResume(data: {
  title: string;
  template_id?: string;
  contact_info?: Record<string, unknown>;
  sections?: unknown[];
  user_id?: string;
}): Promise<string> {
  const supabase = getSupabaseAdmin();
  const userId = data.user_id || process.env.TEST_USER_ID;

  if (!userId) {
    throw new Error('No user ID provided for test resume creation');
  }

  const resumeData = {
    user_id: userId,
    title: data.title,
    template_id: data.template_id || 'modern',
    contact_info: data.contact_info || {
      name: 'Test User',
      email: 'test@example.com',
    },
    sections: data.sections || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: resume, error } = await supabase
    .from('resumes')
    .insert(resumeData)
    .select('id')
    .single();

  if (error || !resume) {
    throw new Error(`Failed to create test resume: ${error?.message || 'Unknown error'}`);
  }

  console.log(`✅ Created test resume: ${data.title} (ID: ${resume.id})`);

  return resume.id;
}

/**
 * Create multiple test resumes
 *
 * @param resumes - Array of resume data
 * @returns Array of resume IDs
 */
export async function createTestResumes(
  resumes: Array<{
    title: string;
    template_id?: string;
    user_id?: string;
  }>
): Promise<string[]> {
  const ids: string[] = [];

  for (const resume of resumes) {
    const id = await createTestResume(resume);
    ids.push(id);
  }

  return ids;
}

/**
 * Get all resumes for a user
 *
 * @param userId - User ID
 * @returns Array of resumes
 */
export async function getResumesForUser(userId?: string): Promise<unknown[]> {
  const supabase = getSupabaseAdmin();
  const targetUserId = userId || process.env.TEST_USER_ID;

  if (!targetUserId) {
    throw new Error('No user ID provided');
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', targetUserId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete a resume by ID
 *
 * @param resumeId - Resume ID to delete
 */
export async function deleteResume(resumeId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('resumes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', resumeId);

  if (error) {
    throw new Error(`Failed to delete resume: ${error.message}`);
  }

  console.log(`✅ Deleted resume: ${resumeId}`);
}

/**
 * Create a resume from template via API (proper flow)
 *
 * @param page - Playwright page object
 * @param templateId - Template ID (e.g., 'classic-alex-rivera')
 * @param loadExample - Whether to load example data (default: true)
 * @returns Resume ID
 */
export async function createResumeFromTemplate(
  page: any,
  templateId: string = 'classic-alex-rivera',
  loadExample: boolean = true
): Promise<string> {
  // Get session token from localStorage - search for any Supabase auth token
  // This works with both local (sb-localhost-auth-token) and remote (sb-{projectRef}-auth-token)
  const sessionToken = await page.evaluate(() => {
    try {
      // Find all localStorage keys that match Supabase auth token pattern
      const storageKeys = Object.keys(localStorage);
      const authKey = storageKeys.find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));

      if (authKey) {
        const sessionData = localStorage.getItem(authKey);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          return session.access_token || null;
        }
      }
    } catch (error) {
      console.error('Failed to get session from localStorage:', error);
    }
    return null;
  });

  if (!sessionToken) {
    throw new Error('No session token found - user must be signed in');
  }

  // Create resume via API (Flask backend on port 5000)
  const flaskURL = process.env.FLASK_API_URL || 'http://localhost:5000';
  const response = await page.request.post(`${flaskURL}/api/resumes/create`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
    },
    data: {
      template_id: templateId,
      load_example: loadExample,
    },
  });

  const data = await response.json();

  if (!response.ok()) {
    throw new Error(`Failed to create resume: ${data.error || response.statusText()}`);
  }

  const resumeId = data.resume_id;
  console.log(`✅ Created resume from template "${templateId}": ${resumeId}`);

  return resumeId;
}
