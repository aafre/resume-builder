/**
 * Mailpit Email Helpers for E2E Testing
 *
 * Mailpit is a local email testing server bundled with Supabase.
 * It captures all emails sent by the local Supabase instance without
 * actually sending them, allowing us to test magic link auth flow.
 *
 * Mailpit runs on port 54324 (check with: supabase status)
 * Web UI: http://127.0.0.1:54324
 * API: http://127.0.0.1:54324/api/v1
 */

const MAILPIT_API_URL = process.env.INBUCKET_API_URL || 'http://127.0.0.1:54324/api/v1';

/**
 * Mailpit message metadata (compatible with Inbucket interface)
 */
export interface InbucketMessage {
  id: string;
  from: {
    name: string;
    address: string;
  } | string;
  to: Array<{ name: string; address: string }> | string[];
  subject: string;
  created: string; // Mailpit uses 'created' instead of 'date'
  size: number;
}

/**
 * Full Mailpit message with content
 */
export interface InbucketMessageDetail {
  HTML: string; // Mailpit uses 'HTML' (uppercase)
  Text: string; // Mailpit uses 'Text' (uppercase)
  html?: string; // Keep for backward compatibility
  text?: string; // Keep for backward compatibility
  Headers: Record<string, string[]>; // Mailpit uses 'Headers'
  header?: Record<string, string[]>; // Keep for backward compatibility
}

/**
 * Wait for email to arrive in Mailpit inbox
 *
 * Polls Mailpit API every 500ms for up to 30 seconds by default.
 * Useful for waiting for Supabase magic link emails.
 *
 * @param recipientEmail - Email address to check (e.g., "e2e-test@example.com")
 * @param options - Optional configuration
 * @param options.timeout - Max wait time in milliseconds (default: 30000)
 * @param options.pollInterval - Polling interval in milliseconds (default: 500)
 * @param options.subjectContains - Filter by subject content (e.g., "Confirm your signup")
 * @returns Promise<InbucketMessage> - The email message metadata
 * @throws Error if email not received within timeout
 *
 * @example
 * const email = await waitForEmail('test@example.com', {
 *   timeout: 30000,
 *   subjectContains: 'Confirm your signup'
 * });
 */
export async function waitForEmail(
  recipientEmail: string,
  options?: {
    timeout?: number;
    pollInterval?: number;
    subjectContains?: string;
  }
): Promise<InbucketMessage> {
  const timeout = options?.timeout || 30000; // 30 seconds
  const pollInterval = options?.pollInterval || 500; // 500ms
  const subjectFilter = options?.subjectContains;

  const startTime = Date.now();

  console.log(`📧 Waiting for email to: ${recipientEmail}...`);
  if (subjectFilter) {
    console.log(`   Subject filter: "${subjectFilter}"`);
  }

  while (Date.now() - startTime < timeout) {
    try {
      // Fetch all messages from Mailpit API
      const response = await fetch(`${MAILPIT_API_URL}/messages`);

      if (!response.ok) {
        throw new Error(`Mailpit API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const messages: any[] = data.messages || [];

      // Filter messages for recipient email
      const recipientMessages = messages.filter((msg: any) => {
        const recipients = msg.To || [];
        return recipients.some((to: any) => {
          const toAddress = typeof to === 'string' ? to : to.Address || to.address;
          return toAddress.toLowerCase() === recipientEmail.toLowerCase();
        });
      });

      // Filter by subject if specified
      let matchingMessage = recipientMessages[0]; // Latest message

      if (subjectFilter && recipientMessages.length > 0) {
        matchingMessage = recipientMessages.find((m: any) =>
          m.Subject?.toLowerCase().includes(subjectFilter.toLowerCase())
        );
      }

      if (matchingMessage) {
        // Normalize to InbucketMessage format
        const normalized: InbucketMessage = {
          id: matchingMessage.ID,
          from: matchingMessage.From,
          to: matchingMessage.To,
          subject: matchingMessage.Subject,
          created: matchingMessage.Created,
          size: matchingMessage.Size || 0,
        };

        console.log(`✅ Email received: "${normalized.subject}"`);
        const fromAddress = typeof normalized.from === 'string' ? normalized.from : normalized.from.address;
        console.log(`   From: ${fromAddress}`);
        console.log(`   ID: ${normalized.id}`);
        return normalized;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));

    } catch (error) {
      console.error(`⚠️  Error polling Mailpit:`, error);
      // Continue polling even if one request fails
    }
  }

  // Timeout reached
  throw new Error(
    `Timeout waiting for email to ${recipientEmail} after ${timeout}ms.\n` +
    `Check Mailpit UI: http://127.0.0.1:54324\n` +
    `Recipient: ${recipientEmail}`
  );
}

/**
 * Fetch full email content from Mailpit
 *
 * Retrieves the complete email including HTML, text, and headers.
 *
 * @param recipientEmail - Email address (e.g., "e2e-test@example.com") - not used with Mailpit
 * @param messageId - Message ID from InbucketMessage
 * @returns Promise<InbucketMessageDetail> - Full message content
 * @throws Error if message not found
 *
 * @example
 * const message = await waitForEmail('test@example.com');
 * const content = await getEmailContent('test@example.com', message.id);
 * console.log(content.html || content.HTML); // HTML content
 */
export async function getEmailContent(
  recipientEmail: string,
  messageId: string
): Promise<InbucketMessageDetail> {
  console.log(`📬 Fetching email content for message: ${messageId}`);

  const response = await fetch(`${MAILPIT_API_URL}/message/${messageId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch email content: ${response.status} ${response.statusText}\n` +
      `Message ID: ${messageId}`
    );
  }

  const content: any = await response.json();

  // Normalize to InbucketMessageDetail format
  const normalized: InbucketMessageDetail = {
    HTML: content.HTML || '',
    Text: content.Text || '',
    html: content.HTML || '', // Backward compatibility
    text: content.Text || '', // Backward compatibility
    Headers: content.Headers || {},
    header: content.Headers || {}, // Backward compatibility
  };

  console.log(`✅ Email content fetched (${normalized.HTML.length} chars HTML)`);

  return normalized;
}

/**
 * Extract magic link URL from Supabase email HTML
 *
 * Supabase magic link emails contain a confirmation URL with access_token.
 * This function parses the HTML to extract that URL.
 *
 * @param emailHtml - HTML content from Inbucket email
 * @returns string | null - Magic link URL or null if not found
 *
 * @example
 * const content = await getEmailContent('test@example.com', messageId);
 * const magicLink = extractMagicLink(content.html);
 * // Returns: "http://localhost:5173/#access_token=..."
 */
export function extractMagicLink(emailHtml: string): string | null {
  console.log(`🔍 Extracting magic link from email HTML...`);

  // Supabase magic links can have several patterns:
  // 1. http://localhost:5173/#access_token=...
  // 2. http://localhost:5173/auth/callback?access_token=...
  // 3. http://127.0.0.1:5173/#access_token=...
  // 4. URL might be in <a href="..."> tag

  // Pattern 1: Extract from <a> tag href attribute
  const hrefPattern = /href=["'](http[s]?:\/\/[^"']*(?:#|auth\/callback\?)access_token=[^"']+)["']/i;
  let match = emailHtml.match(hrefPattern);

  if (match && match[1]) {
    const url = match[1];
    console.log(`✅ Magic link found (from href): ${url.substring(0, 60)}...`);
    return url;
  }

  // Pattern 2: Direct URL in HTML (not in href)
  const urlPattern = /(http[s]?:\/\/(?:localhost|127\.0\.0\.1):5173[^\s<>'"]*(?:#|auth\/callback\?)access_token=[^\s<>'"&]+)/i;
  match = emailHtml.match(urlPattern);

  if (match && match[1]) {
    const url = match[1];
    console.log(`✅ Magic link found (direct URL): ${url.substring(0, 60)}...`);
    return url;
  }

  // Pattern 3: Look for any access_token parameter
  const tokenPattern = /access_token=([a-zA-Z0-9._-]+)/;
  const tokenMatch = emailHtml.match(tokenPattern);

  if (tokenMatch && tokenMatch[0]) {
    // Reconstruct URL with found token
    const url = `http://localhost:5173/#${tokenMatch[0]}`;
    console.log(`✅ Magic link reconstructed: ${url.substring(0, 60)}...`);
    return url;
  }

  console.error('❌ Failed to extract magic link from email');
  console.error('Email HTML preview:', emailHtml.substring(0, 500));
  return null;
}

/**
 * Delete all emails in Inbucket mailbox (cleanup)
 *
 * Useful for test cleanup to ensure fresh state between tests.
 *
 * @param recipientEmail - Email address mailbox to purge
 * @returns Promise<void>
 *
 * @example
 * await clearInbucketMailbox('e2e-test@example.com');
 */
export async function clearInbucketMailbox(recipientEmail: string): Promise<void> {
  const mailbox = recipientEmail.split('@')[0];

  console.log(`🧹 Clearing Inbucket mailbox: ${mailbox}`);

  try {
    const response = await fetch(`${INBUCKET_API_URL}/mailbox/${mailbox}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to clear mailbox: ${response.status} ${response.statusText}`);
    }

    console.log(`✅ Mailbox cleared: ${mailbox}`);
  } catch (error) {
    console.warn(`⚠️  Failed to clear mailbox (may be already empty):`, error);
  }
}

/**
 * Check if Inbucket is running and accessible
 *
 * Useful for debugging setup issues.
 *
 * @returns Promise<boolean> - True if Inbucket is accessible
 *
 * @example
 * if (!await isInbucketRunning()) {
 *   throw new Error('Inbucket not running. Run: supabase start');
 * }
 */
export async function isInbucketRunning(): Promise<boolean> {
  try {
    const response = await fetch(INBUCKET_API_URL, {
      method: 'GET',
    });

    // Inbucket root returns 404, but server is running
    // Any response (even 404) means server is accessible
    return response.status !== undefined;
  } catch (error) {
    console.error('❌ Inbucket not accessible:', error);
    return false;
  }
}
