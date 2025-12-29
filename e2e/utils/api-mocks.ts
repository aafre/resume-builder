import { Page, Route } from '@playwright/test';

/**
 * API Mocking Utilities for E2E Tests
 *
 * Provides functions to mock external APIs:
 * - OpenAI API (resume parser)
 * - Supabase Edge Functions
 * - Other external services
 */

/**
 * Mock OpenAI Resume Parser Edge Function
 *
 * Intercepts calls to /functions/v1/parse-resume and returns
 * predefined YAML response to avoid costs and non-deterministic results.
 *
 * @param page - Playwright Page object
 * @param options - Mock response options
 */
export async function mockOpenAIParser(
  page: Page,
  options?: {
    yaml?: string;
    confidence?: number;
    warnings?: string[];
    cached?: boolean;
    shouldFail?: boolean;
    errorMessage?: string;
  }
): Promise<void> {
  const defaultYaml = `contact_info:
  name: E2E Test User
  location: San Francisco, CA
  email: e2e-test@example.com
  phone: "+1-555-0100"
  social_links:
    - platform: linkedin
      url: https://linkedin.com/in/e2etest

sections:
  - name: Summary
    type: text
    content: Test summary for E2E testing.

  - name: Skills
    type: bulleted-list
    content:
      - JavaScript
      - Python
      - Testing`;

  await page.route('**/functions/v1/parse-resume', async (route: Route) => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (options?.shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: options.errorMessage || 'Failed to parse resume',
        }),
      });
      return;
    }

    // Return success response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        yaml: options?.yaml || defaultYaml,
        confidence: options?.confidence ?? 0.95,
        warnings: options?.warnings || [],
        cached: options?.cached ?? false,
        ui_message: {
          title: 'Resume parsed successfully',
          description: 'Your resume has been converted to YAML format.',
          type: 'success',
        },
      }),
    });
  });

  console.log('✅ OpenAI Parser mock enabled');
}

/**
 * Mock OpenAI Parser with cache hit
 *
 * @param page - Playwright Page object
 * @param yaml - YAML response
 */
export async function mockOpenAIParserCacheHit(
  page: Page,
  yaml?: string
): Promise<void> {
  await mockOpenAIParser(page, {
    yaml,
    cached: true,
    confidence: 0.95,
  });
}

/**
 * Mock OpenAI Parser with low confidence
 *
 * @param page - Playwright Page object
 */
export async function mockOpenAIParserLowConfidence(page: Page): Promise<void> {
  await mockOpenAIParser(page, {
    confidence: 0.6,
    warnings: ['Low confidence score. Please review the extracted data carefully.'],
  });
}

/**
 * Mock OpenAI Parser failure
 *
 * @param page - Playwright Page object
 * @param errorMessage - Error message to return
 */
export async function mockOpenAIParserError(
  page: Page,
  errorMessage?: string
): Promise<void> {
  await mockOpenAIParser(page, {
    shouldFail: true,
    errorMessage: errorMessage || 'Failed to parse resume. Please try again.',
  });
}

/**
 * Mock template fetch API
 *
 * @param page - Playwright Page object
 * @param templateId - Template ID to mock
 * @param yaml - YAML response
 */
export async function mockTemplateFetch(
  page: Page,
  templateId: string,
  yaml: string
): Promise<void> {
  await page.route(`**/api/template/${templateId}`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        yaml,
        supportsIcons: true,
      }),
    });
  });

  console.log(`✅ Template fetch mock enabled for template: ${templateId}`);
}

/**
 * Mock resume save API
 *
 * @param page - Playwright Page object
 * @param resumeId - Resume ID to return
 */
export async function mockResumeSave(
  page: Page,
  resumeId?: string
): Promise<void> {
  await page.route('**/api/resumes', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          resume_id: resumeId || 'test-resume-id',
          message: 'Resume saved successfully',
        }),
      });
    } else {
      // Pass through other methods
      await route.continue();
    }
  });

  console.log('✅ Resume save mock enabled');
}

/**
 * Mock PDF generation API
 *
 * @param page - Playwright Page object
 */
export async function mockPDFGeneration(page: Page): Promise<void> {
  await page.route('**/api/generate', async (route: Route) => {
    // Create a minimal PDF blob
    const pdfContent = '%PDF-1.4\n%Test PDF\n%%EOF';
    const blob = Buffer.from(pdfContent, 'utf-8');

    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      headers: {
        'Content-Disposition': 'attachment; filename="test-resume.pdf"',
      },
      body: blob,
    });
  });

  console.log('✅ PDF generation mock enabled');
}

/**
 * Clear all route mocks
 *
 * @param page - Playwright Page object
 */
export async function clearMocks(page: Page): Promise<void> {
  await page.unroute('**/*');
  console.log('✅ All mocks cleared');
}
