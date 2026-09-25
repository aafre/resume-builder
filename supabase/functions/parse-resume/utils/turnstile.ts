/**
 * Cloudflare Turnstile server-side verification.
 *
 * Fail-closed once configured: TURNSTILE_SECRET set + missing/invalid token
 * = rejected. Fail-open until configured: no TURNSTILE_SECRET (e.g. this
 * function deployed before the secret is set) = verification skipped, so
 * rollout order (deploy code, then set secret) never breaks imports.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * @param token - `turnstile_token` form field from the client (may be null/empty).
 * @param secret - TURNSTILE_SECRET env value.
 * @param remoteip - client IP, if known (optional per Cloudflare's API).
 * @returns true if verified. Also true (fail-open) on network/parse errors,
 *   since a Cloudflare outage must never block legitimate imports; the
 *   parse-resume daily rate limit (#838) is the backstop.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  secret: string,
  remoteip: string | null
): Promise<boolean> {
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteip) body.set('remoteip', remoteip);

    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification request failed, failing open:', error);
    return true;
  }
}
