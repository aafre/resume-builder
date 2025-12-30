import { test, expect } from '@playwright/test';
import {
  navigateToTemplates,
  selectTemplate,
  selectModalOptionEmpty,
  makeEditInEditor,
  navigateToMyResumes,
  getResumeIdFromURL,
} from '../utils/navigation-helpers';
import { loginViaAdminMagicLink } from '../utils/admin-auth-helpers';
import { cleanupTestResumes } from '../utils/db-helpers';

/**
 * Comprehensive Flow Test: Empty Structure
 *
 * This test simulates a complete brand new user journey:
 * 1. Anonymous: Build a resume from empty template
 * 2. Edit: Make a change to trigger data creation
 * 3. Migration: Sign in via Admin Magic Link (fast, deterministic)
 * 4. Verify: Confirm data persists after login (migration worked)
 *
 * This validates the critical anonymous → authenticated migration flow.
 *
 * Uses:
 * - storageState/anon.json: Start as anonymous user
 * - loginViaAdminMagicLink(): Upgrade to authenticated (matches production auth)
 */

// Start with anonymous storageState
test.use({ storageState: 'storage/anon.json' });

const TEMPLATES = [
  'classic-alex-rivera',
  'classic-jane-doe',
  'modern-no-icons',
  'modern-with-icons',
];

test.describe('Comprehensive Flow: Empty Structure (Anonymous → Authenticated)', () => {
  test.afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestResumes();
  });

  // Test with first template only for now (can expand to loop over all templates)
  test('should complete full anonymous-to-authenticated flow with empty structure', async ({ page }) => {
    const templateId = TEMPLATES[0]; // Start with classic-alex-rivera
    const testName = `E2E Test User ${Date.now()}`;

    console.log('\n🎬 Starting comprehensive anonymous-to-authenticated flow test...\n');

    // ========================================
    // STEP 1: ANONYMOUS - Navigate to Templates
    // ========================================
    console.log('📍 STEP 1: Anonymous user navigating to templates...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify we're anonymous (no user menu)
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).not.toBeVisible({ timeout: 2000 });
    console.log('✅ Confirmed: User is anonymous (no user menu)');

    await navigateToTemplates(page);
    console.log('✅ Step 1 complete: On templates page\n');

    // ========================================
    // STEP 2: ANONYMOUS - Select Template and Empty Option
    // ========================================
    console.log('📍 STEP 2: Selecting template and empty structure option...');

    await selectTemplate(page, templateId);
    await selectModalOptionEmpty(page);

    // Verify we're on editor page
    await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/);
    const resumeIdBeforeAuth = await getResumeIdFromURL(page);
    console.log(`✅ Step 2 complete: In editor with resume ID: ${resumeIdBeforeAuth}\n`);

    // ========================================
    // STEP 3: ANONYMOUS - Make Edit to Trigger Data Creation
    // ========================================
    console.log('📍 STEP 3: Making edit to trigger data creation...');

    await makeEditInEditor(page, 'name', testName);

    // Verify the edit persisted
    const nameInput = page.getByPlaceholder('Enter your name')
      .or(page.locator('input[name="name"]'))
      .or(page.locator('input[placeholder*="name" i]').first());

    await expect(nameInput).toHaveValue(testName);
    console.log(`✅ Step 3 complete: Name field set to "${testName}"\n`);

    // ========================================
    // STEP 4: MIGRATION - Sign In with Admin Magic Link
    // ========================================
    console.log('📍 STEP 4: Signing in with admin magic link (triggering migration)...');
    console.log('   This tests the REAL user authentication flow!');
    console.log('   (Using Admin generateLink - fast, no email polling)');

    const testEmail = process.env.TEST_USER_EMAIL || 'e2e-test@example.com';

    await loginViaAdminMagicLink(page, testEmail);

    // Verify we're now authenticated
    await expect(userMenu).toBeVisible({ timeout: 5000 });
    console.log('✅ Step 4 complete: User authenticated via admin magic link\n');

    // ========================================
    // STEP 5: VERIFY - Data Persisted After Migration
    // ========================================
    console.log('📍 STEP 5: Verifying data persisted after migration...');

    // Option A: Check if we're still on the same resume ID
    const currentUrl = page.url();
    if (currentUrl.includes('/editor/')) {
      const resumeIdAfterAuth = await getResumeIdFromURL(page);

      // The resume ID might change during migration (anon → auth account)
      // But the data should persist
      console.log(`   Resume ID before auth: ${resumeIdBeforeAuth}`);
      console.log(`   Resume ID after auth:  ${resumeIdAfterAuth}`);

      // Verify the name is still there
      await expect(nameInput).toHaveValue(testName, { timeout: 5000 });
      console.log(`✅ Data verified in editor: Name still = "${testName}"`);
    }

    // Option B: Navigate to My Resumes and verify resume exists there
    console.log('   Navigating to My Resumes to verify migration...');
    await navigateToMyResumes(page);

    // Look for our resume by name
    const resumeCard = page.locator(`text="${testName}"`).first()
      .or(page.locator('[data-testid="resume-card"]').first());

    await expect(resumeCard).toBeVisible({ timeout: 10000 });
    console.log('✅ Step 5 complete: Resume found in My Resumes dashboard\n');

    // ========================================
    // STEP 6: VERIFY - Can Edit After Migration
    // ========================================
    console.log('📍 STEP 6: Verifying resume is editable after migration...');

    // Click on the resume to open editor
    await resumeCard.click();

    // Should navigate to editor
    await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Verify the name is still there
    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await expect(nameInput).toHaveValue(testName);

    // Make another edit to verify it's editable
    const updatedName = `${testName} - Updated`;
    await makeEditInEditor(page, 'name', updatedName);

    await expect(nameInput).toHaveValue(updatedName);
    console.log(`✅ Step 6 complete: Resume is editable, updated to "${updatedName}"\n`);

    // ========================================
    // FINAL VERIFICATION
    // ========================================
    console.log('🎉 COMPREHENSIVE FLOW TEST PASSED!');
    console.log('   ✅ Anonymous user created resume');
    console.log('   ✅ Data was saved as anonymous');
    console.log('   ✅ Magic link authentication worked');
    console.log('   ✅ Data migrated to authenticated account');
    console.log('   ✅ Resume is accessible and editable');
    console.log('\n✨ Full user journey validated!\n');
  });

  // Optional: Test with all templates (loop)
  // Uncomment to test all 4 templates
  /*
  for (const templateId of TEMPLATES) {
    test(`should complete flow with ${templateId} template`, async ({ page }) => {
      // Same test as above but with different template
      // This ensures migration works for all template types
    });
  }
  */
});
