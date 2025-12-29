/**
 * File hashing utilities
 * Provides SHA-256 hashing for file deduplication and cache lookups
 */

/**
 * Calculate SHA-256 hash of a file buffer
 * @param buffer - ArrayBuffer containing file bytes
 * @returns Hex string representation of SHA-256 hash (64 chars)
 */
export async function calculateSHA256(buffer: ArrayBuffer): Promise<string> {
  // Use Web Crypto API (available in Deno runtime)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}
