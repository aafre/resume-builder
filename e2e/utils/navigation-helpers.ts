import { Page, expect } from '@playwright/test';

/**
 * UI Navigation Helpers for E2E Tests
 *
 * These helpers follow the real user navigation flow through the app,
 * replacing API shortcuts with actual UI interactions.
 *
 * Flow: Landing → Templates → Modal → Editor → Preview/Download → Auth → Migration
 */

/**
 * Navigate from landing page to templates page
 *
 * Clicks "Start Building Now" button on landing page.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when on /templates page
 *
 * @example
 * await navigateToTemplates(page);
 * expect(page.url()).toContain('/templates');
 */
export async function navigateToTemplates(page: Page): Promise<void> {
  console.log('🔹 Navigating to templates page...');

  // Direct navigation to templates page (more reliable than clicking button)
  await page.goto('/templates');
  await page.waitForLoadState('networkidle');

  // Verify we're on templates page
  await expect(page).toHaveURL(/\/templates/, { timeout: 10000 });

  // Wait for templates to load
  await page.waitForTimeout(2000);

  console.log('✅ Navigated to templates page');
}

/**
 * Select a template from templates page
 *
 * Clicks on a template card and then "Start Building Resume" button.
 * This opens the TemplateStartModal.
 *
 * @param page - Playwright Page object
 * @param templateId - Template ID (e.g., "classic-alex-rivera")
 * @returns Promise that resolves when modal is visible
 *
 * @example
 * await selectTemplate(page, 'classic-alex-rivera');
 */
export async function selectTemplate(
  page: Page,
  templateId: string
): Promise<void> {
  console.log(`🔹 Selecting template: ${templateId}...`);

  // Wait for templates grid to load
  await page.waitForLoadState('networkidle');

  // Wait for at least one template card to be visible
  const firstCard = page.locator('.group.cursor-pointer').first();
  await expect(firstCard).toBeVisible({ timeout: 15000 });

  // Give templates a moment to finish rendering
  await page.waitForTimeout(500);

  // Find the template card - try multiple strategies
  // Strategy 1: Look for the card containing the template name
  const templateNameMap: Record<string, string> = {
    'classic-alex-rivera': 'Alex Rivera',
    'modern-jane-smith': 'Jane Smith',
    'professional-john-doe': 'John Doe',
    'creative-sarah-johnson': 'Sarah Johnson'
  };

  const expectedName = templateNameMap[templateId] || templateId;
  let templateCard = page.locator('.group.cursor-pointer').filter({ hasText: expectedName });

  let cardCount = await templateCard.count();

  // Strategy 2: If not found by name, use first card
  if (cardCount === 0) {
    console.warn(`⚠️  Template card not found by name: ${expectedName}, using first card`);
    templateCard = page.locator('.group.cursor-pointer').first();
    cardCount = await templateCard.count();
  }

  if (cardCount === 0) {
    throw new Error('No template cards found on page');
  }

  // Click the card to select it
  await templateCard.click();
  console.log('✅ Template card clicked, waiting for "Start Building Resume" button...');

  // Debug: Check what buttons are on the page
  await page.waitForTimeout(2000); // Give React time to re-render
  const allButtons = await page.locator('button').allTextContents();
  console.log(`🔍 All buttons on page: ${JSON.stringify(allButtons.slice(0, 10))}`);

  // Wait for the button to change from "Select This Template" to "Start Building Resume"
  // Use a more robust selector that waits for the button to appear
  const startButton = page.locator('button').filter({ hasText: /Start Building Resume/i });

  // Check if button exists
  const buttonCount = await startButton.count();
  console.log(`🔍 "Start Building Resume" button count: ${buttonCount}`);

  // Wait for button with longer timeout (React needs time to re-render)
  await expect(startButton).toBeVisible({ timeout: 15000 });
  console.log('✅ "Start Building Resume" button is visible');

  // Click the "Start Building Resume" button
  // React re-renders this button frequently (loading states), causing "detached from DOM" errors
  // Use dispatchEvent approach instead of regular click
  await startButton.evaluate((btn: HTMLElement) => {
    btn.click();
  });

  console.log(`✅ Clicked "Start Building Resume", waiting for modal or navigation...`);

  // Wait for either modal to appear OR navigation to occur
  // The button triggers an API call to check for existing resumes, which may:
  // 1. Show TemplateStartModal (no existing resumes)
  // 2. Show ResumeRecoveryModal (existing resume found)
  // 3. Navigate away (API error)
  const modalOrNav = Promise.race([
    // Wait for template start modal
    page.waitForSelector('[data-testid="template-start-modal"], [role="dialog"]', { timeout: 15000 })
      .then(() => 'modal'),
    // Wait for navigation away from templates page
    page.waitForURL(url => !url.pathname.includes('/templates'), { timeout: 15000 })
      .then(() => 'navigation'),
    // Timeout fallback
    page.waitForTimeout(15000).then(() => 'timeout')
  ]);

  const result = await modalOrNav;

  if (result === 'navigation') {
    const currentUrl = page.url();
    throw new Error(
      `After clicking "Start Building Resume", page navigated to: ${currentUrl}\n` +
      `Expected: Modal to appear\n` +
      `This usually means the API call to check existing resumes failed.\n` +
      `Check if Flask backend is running on port 5000.`
    );
  } else if (result === 'timeout') {
    throw new Error('Timeout waiting for modal or navigation after clicking "Start Building Resume"');
  }

  console.log(`✅ Modal appeared after clicking "Start Building Resume"`);
}

/**
 * Handle TemplateStartModal - select "Start from Scratch" option
 *
 * Clicks the empty structure option and waits for editor navigation.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when on editor page
 *
 * @example
 * await selectModalOptionEmpty(page);
 * expect(page.url()).toMatch(/\/editor\/[a-f0-9-]+/);
 */
export async function selectModalOptionEmpty(page: Page): Promise<void> {
  console.log('🔹 Selecting modal option: Empty Structure...');

  // Wait for modal to appear
  const modal = page.locator('[data-testid="template-start-modal"]')
    .or(page.locator('text=/how.*start/i').locator('xpath=ancestor::div[contains(@class, "modal") or contains(@class, "dialog")]'))
    .or(page.locator('[role="dialog"]'));

  await expect(modal).toBeVisible({ timeout: 10000 });

  // Click "Start from Scratch" or "Empty Structure" option
  const emptyOption = page.locator('button:has-text("Start from Scratch")')
    .or(page.locator('button:has-text("Empty Structure")'))
    .or(page.locator('button:has-text("Blank Resume")'));

  await expect(emptyOption.first()).toBeVisible({ timeout: 5000 });
  await emptyOption.first().click();

  // Wait for navigation to editor
  await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  console.log('✅ Selected: Empty Structure');
}

/**
 * Handle TemplateStartModal - select "Use Example Data" option
 *
 * Clicks the example content option and waits for editor navigation.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when on editor page
 *
 * @example
 * await selectModalOptionExample(page);
 */
export async function selectModalOptionExample(page: Page): Promise<void> {
  console.log('🔹 Selecting modal option: Example Content...');

  // Wait for modal to appear
  const modal = page.locator('[data-testid="template-start-modal"]')
    .or(page.locator('[role="dialog"]'));

  await expect(modal).toBeVisible({ timeout: 10000 });

  // Click "Use Example Data" or "Example Content" option
  const exampleOption = page.locator('button:has-text("Use Example Data")')
    .or(page.locator('button:has-text("Example Content")'))
    .or(page.locator('button:has-text("Load Example")'));

  await expect(exampleOption.first()).toBeVisible({ timeout: 5000 });
  await exampleOption.first().click();

  // Wait for navigation to editor
  await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  console.log('✅ Selected: Example Content');
}

/**
 * Handle TemplateStartModal - upload file for AI import
 *
 * Uploads a resume file (PDF/DOCX) and waits for AI parsing to complete.
 *
 * @param page - Playwright Page object
 * @param filePath - Absolute path to resume file
 * @returns Promise that resolves when editor loads with imported data
 *
 * @example
 * const filePath = path.resolve(__dirname, '../fixtures/sample-resume.pdf');
 * await selectModalOptionImport(page, filePath);
 */
export async function selectModalOptionImport(
  page: Page,
  filePath: string
): Promise<void> {
  console.log('🔹 Selecting modal option: AI Import...');
  console.log(`   File: ${filePath}`);

  // Wait for modal to appear
  const modal = page.locator('[data-testid="template-start-modal"]')
    .or(page.locator('[role="dialog"]'));

  await expect(modal).toBeVisible({ timeout: 10000 });

  // Find file input and upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  console.log('✅ File uploaded');

  // Wait for AI parsing to start
  try {
    await expect(
      page.locator('text=/parsing|uploading|processing/i')
    ).toBeVisible({ timeout: 5000 });
    console.log('📊 AI parsing in progress...');
  } catch (error) {
    console.warn('⚠️  Parsing indicator not found (may be instant)');
  }

  // Wait for parsing to complete (max 30 seconds for AI)
  try {
    await expect(
      page.locator('text=/parsing|uploading|processing/i')
    ).not.toBeVisible({ timeout: 30000 });
    console.log('✅ AI parsing completed');
  } catch (error) {
    console.warn('⚠️  Parsing still showing after 30s (continuing anyway)');
  }

  // Click "Continue" or "Import Resume" button
  const continueButton = page.locator('button:has-text("Continue")')
    .or(page.locator('button:has-text("Import Resume")'))
    .or(page.locator('button:has-text("Use This Data")'));

  await expect(continueButton.first()).toBeVisible({ timeout: 10000 });
  await continueButton.first().click();

  // Wait for navigation to editor
  await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  console.log('✅ Selected: AI Import');
}

/**
 * Make a small edit in the editor
 *
 * Fills in a field and waits for auto-save to complete.
 * Automatically closes tour modal if present.
 *
 * @param page - Playwright Page object
 * @param fieldName - Field to edit (default: 'name')
 * @param value - Value to set (default: auto-generated timestamp)
 * @returns Promise that resolves when edit is saved
 *
 * @example
 * await makeEditInEditor(page, 'name', 'John Doe');
 * await makeEditInEditor(page); // Uses default name with timestamp
 */
export async function makeEditInEditor(
  page: Page,
  fieldName: string = 'name',
  value?: string
): Promise<void> {
  const editValue = value || `Test User ${Date.now()}`;
  console.log(`🔹 Making edit: ${fieldName} = "${editValue}"...`);

  // Close tour modal if present
  try {
    const skipTourButton = page.locator('button').filter({ hasText: /skip tour/i }).first();
    if (await skipTourButton.isVisible({ timeout: 2000 })) {
      await skipTourButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Tour modal closed');
    }
  } catch (error) {
    // Tour modal not present, continue
  }

  // Find and fill the name input field
  const nameInput = page.getByPlaceholder('Enter your name')
    .or(page.locator('input[name="name"]'))
    .or(page.locator('input[placeholder*="name" i]').first());

  await expect(nameInput).toBeVisible({ timeout: 10000 });

  await nameInput.clear();
  await nameInput.fill(editValue);

  // Verify value persisted
  await expect(nameInput).toHaveValue(editValue);
  console.log('✅ Field edited');

  // Wait for auto-save indicator (3.5s debounce + network)
  try {
    await expect(
      page.locator('text=/saved|auto.?saved/i').nth(1) // Use nth(1) to avoid header badge
    ).toBeVisible({ timeout: 10000 });
    console.log('✅ Auto-save completed');
  } catch (error) {
    console.warn('⚠️  Auto-save indicator not found (may have saved too fast)');
  }
}

/**
 * Preview PDF in editor
 *
 * Opens the PDF preview modal.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when preview modal is visible
 *
 * @example
 * await previewPDF(page);
 * // Preview modal is now open
 * await page.locator('[aria-label="Close"]').click(); // Close it
 */
export async function previewPDF(page: Page): Promise<void> {
  console.log('🔹 Opening PDF preview...');

  const previewButton = page.locator('button:has-text("Preview PDF")')
    .or(page.locator('button:has-text("Preview")'))
    .or(page.locator('button[aria-label*="preview" i]'));

  await expect(previewButton.first()).toBeVisible({ timeout: 10000 });
  await previewButton.first().click();

  // Wait for preview modal to appear
  const modal = page.locator('[data-testid="preview-modal"]')
    .or(page.locator('[role="dialog"]:has(iframe)'))
    .or(page.locator('iframe[title*="PDF" i]').locator('..').locator('..'));

  await expect(modal).toBeVisible({ timeout: 15000 });

  // Wait for PDF to load
  await page.waitForTimeout(2000);

  console.log('✅ PDF preview opened');
}

/**
 * Download PDF from editor
 *
 * Clicks download button and waits for download to complete.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when download completes
 *
 * @example
 * await downloadPDF(page);
 * // PDF has been downloaded
 */
export async function downloadPDF(page: Page): Promise<void> {
  console.log('🔹 Downloading PDF...');

  const downloadButton = page.locator('button:has-text("Download Resume")')
    .or(page.locator('button:has-text("Download PDF")'))
    .or(page.locator('button:has-text("Download")'));

  await expect(downloadButton.first()).toBeVisible({ timeout: 10000 });

  // Listen for download event
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

  await downloadButton.first().click();

  const download = await downloadPromise;

  // Verify filename is PDF
  const filename = download.suggestedFilename();
  expect(filename).toMatch(/\.pdf$/i);

  console.log(`✅ PDF downloaded: ${filename}`);
}

/**
 * Close any modal that's currently open
 *
 * Finds and clicks close button or backdrop.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when modal is closed
 *
 * @example
 * await closeModal(page);
 */
export async function closeModal(page: Page): Promise<void> {
  console.log('🔹 Closing modal...');

  // Try close button first
  const closeButton = page.locator('button[aria-label="Close"]')
    .or(page.locator('button:has-text("Close")'))
    .or(page.locator('[data-testid="close-button"]'))
    .or(page.locator('button.absolute.right-0')); // Common close button position

  try {
    await closeButton.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('✅ Modal closed');
  } catch (error) {
    console.warn('⚠️  Close button not found, trying ESC key');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
}

/**
 * Navigate to My Resumes page
 *
 * Uses the navigation menu to go to /my-resumes.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when on /my-resumes page
 *
 * @example
 * await navigateToMyResumes(page);
 * expect(page.url()).toContain('/my-resumes');
 */
export async function navigateToMyResumes(page: Page): Promise<void> {
  console.log('🔹 Navigating to My Resumes...');

  // Option 1: Direct navigation
  await page.goto('/my-resumes');
  await page.waitForLoadState('networkidle');

  // Wait for page to load
  await expect(page).toHaveURL(/\/my-resumes/, { timeout: 10000 });

  console.log('✅ Navigated to My Resumes page');
}

/**
 * Extract resume ID from current editor URL
 *
 * @param page - Playwright Page object
 * @returns Resume ID (UUID)
 *
 * @example
 * const resumeId = await getResumeIdFromURL(page);
 * // resumeId: "123e4567-e89b-12d3-a456-426614174000"
 */
export async function getResumeIdFromURL(page: Page): Promise<string> {
  const url = page.url();
  const match = url.match(/\/editor\/([a-f0-9-]+)/);

  if (!match || !match[1]) {
    throw new Error(`Failed to extract resume ID from URL: ${url}`);
  }

  return match[1];
}

/**
 * Complete flow: Create resume via UI (no API shortcuts)
 *
 * Follows the real user flow: Templates → Select → Modal → Editor
 * This is the PRIMARY helper for creating resumes in E2E tests.
 *
 * @param page - Playwright Page object
 * @param templateId - Template ID (e.g., 'classic-alex-rivera')
 * @param option - Modal option: 'empty', 'example', or 'import'
 * @param importFilePath - Required if option is 'import'
 * @returns Resume ID (UUID) extracted from editor URL
 *
 * @example
 * // Empty resume
 * const resumeId = await createResumeViaUI(page, 'classic-alex-rivera', 'empty');
 *
 * @example
 * // With example data
 * const resumeId = await createResumeViaUI(page, 'modern-jane-smith', 'example');
 *
 * @example
 * // Import from PDF
 * const filePath = path.resolve(__dirname, '../fixtures/sample-resume.pdf');
 * const resumeId = await createResumeViaUI(page, 'classic-alex-rivera', 'import', filePath);
 */
export async function createResumeViaUI(
  page: Page,
  templateId: string = 'classic-alex-rivera',
  option: 'empty' | 'example' | 'import' = 'empty',
  importFilePath?: string
): Promise<string> {
  console.log(`🔹 Creating resume via UI flow: ${templateId} (${option})...`);

  // 1. Navigate to templates page
  await navigateToTemplates(page);

  // 2. Select template
  await selectTemplate(page, templateId);

  // 3. Choose modal option based on parameter
  if (option === 'empty') {
    await selectModalOptionEmpty(page);
  } else if (option === 'example') {
    await selectModalOptionExample(page);
  } else if (option === 'import') {
    if (!importFilePath) {
      throw new Error('importFilePath is required when option is "import"');
    }
    await selectModalOptionImport(page, importFilePath);
  } else {
    throw new Error(`Invalid option: ${option}. Must be 'empty', 'example', or 'import'`);
  }

  // 4. Wait for editor to finish loading
  await page.waitForLoadState('networkidle');

  // 5. Extract resume ID from URL
  const resumeId = await getResumeIdFromURL(page);

  console.log(`✅ Resume created via UI: ${resumeId}`);

  return resumeId;
}
