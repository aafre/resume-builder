/**
 * Mobile device detection utilities for PDF preview rendering
 */

/**
 * Detect if user is on mobile device (iOS or Android)
 *
 * @returns true if on mobile device, false otherwise
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod/.test(userAgent);
}
