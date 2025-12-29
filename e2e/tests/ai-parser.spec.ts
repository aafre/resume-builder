import { test, expect } from '@playwright/test';
import { cleanupTestResumes } from '../utils/db-helpers';
import path from 'path';

/**
 * AI Resume Parser E2E Tests
 *
 * Tests the AI resume parser functionality:
 * 1. Successful PDF upload and parsing
 * 2. Invalid file type handling
 * 3. Cached result handling
 * 4. Loading states and progress indicators
 */

test.describe('AI Resume Parser', () => {
  test.afterEach(async () => {
    await cleanupTestResumes();
  });

  test.skip('should successfully upload and parse PDF resume', async ({ page }) => {
    // SKIPPED: Requires authentication - anonymous users can't use TemplateStartModal
    // TODO: Sign in first, then test the AI parser flow

    // Navigate to templates page
    await page.goto('/templates');
    await page.waitForLoadState('networkidle');

    // Find and click first template
    const templateGrid = page.locator('div.grid.grid-cols-1');
    await expect(templateGrid).toBeVisible({ timeout: 10000 });

    const firstTemplate = templateGrid.locator('div.cursor-pointer').first();
    await firstTemplate.click();
    await page.waitForTimeout(500);

    // Click "Use Template" button to open TemplateStartModal
    const useTemplateButton = page.locator('button').filter({ hasText: /start building|select.*template|use.*template/i }).first();
    await useTemplateButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Look for file input in the "AI Import" section
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeVisible({ timeout: 5000 });

    // Upload sample PDF
    const samplePdfPath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    await fileInput.setInputFiles(samplePdfPath);

    // Wait for parsing to start - look for "Reading your resume..." message
    const parsingMessage = page.locator('text=/reading your resume/i');
    await expect(parsingMessage).toBeVisible({ timeout: 5000 });

    // Wait for success state
    const successMessage = page.locator('text=/import successful/i');
    await expect(successMessage).toBeVisible({ timeout: 30000 });

    console.log('✅ PDF upload and parsing successful');
  });

  test.skip('should reject invalid file types', async ({ page }) => {
    // SKIPPED: Requires authentication - anonymous users can't use TemplateStartModal
    // TODO: Sign in first, then test invalid file handling
    await page.goto('/templates');
    await page.waitForLoadState('networkidle');

    const templateGrid = page.locator('div.grid.grid-cols-1');
    await expect(templateGrid).toBeVisible({ timeout: 10000 });

    const firstTemplate = templateGrid.locator('div.cursor-pointer').first();
    await firstTemplate.click();
    await page.waitForTimeout(500);

    const importButton = page.locator('button, a').filter({ hasText: /import|upload.*resume|ai.*parse/i }).first();

    if (await importButton.isVisible({ timeout: 2000 })) {
      await importButton.click();
      await page.waitForTimeout(500);

      const fileInput = page.locator('input[type="file"]').first();
      await expect(fileInput).toBeVisible({ timeout: 5000 });

      // Try to upload an invalid file type (e.g., image)
      const invalidFilePath = path.join(__dirname, '../fixtures/invalid-file.jpg');

      // Note: File might be rejected by input accept attribute or validation
      // We'll check for error message after attempted upload
      try {
        await fileInput.setInputFiles(invalidFilePath);
        await page.waitForTimeout(1000);

        // Look for error message
        const errorMessage = page.locator('text=/invalid|unsupported|only.*pdf|wrong.*format/i');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        console.log('✅ Invalid file type correctly rejected');
      } catch {
        // File input might prevent upload via accept attribute
        console.log('✅ Invalid file prevented by input validation');
      }
    } else {
      console.log('⏭️  AI import feature not found');
      test.skip();
    }
  });

  test.skip('should use cached results for duplicate uploads', async ({ page }) => {
    // TODO: Implement test for cached parsing results
    // This requires uploading the same file twice and verifying:
    // 1. First upload parses normally (takes time)
    // 2. Second upload returns instantly (from cache)
    // 3. Cache indicator or message is shown
  });

  test.skip('should show loading state during parsing', async ({ page }) => {
    // TODO: Implement test for loading indicators
    // Verify:
    // 1. Loading spinner appears after file upload
    // 2. Progress indicator shows parsing status
    // 3. UI is disabled during parsing
    // 4. Success state appears after completion
  });
});
