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
