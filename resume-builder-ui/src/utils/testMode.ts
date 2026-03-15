/**
 * Test mode utilities for E2E testing.
 *
 * When ?__test=1 is present in the URL:
 * - Onboarding tour is skipped
 * - CSS transitions/animations are disabled (reduces flakiness)
 *
 * This is checked once on app init and cached for the session.
 */

let _isTestMode: boolean | null = null;

export function isTestMode(): boolean {
  if (_isTestMode === null) {
    _isTestMode = new URLSearchParams(window.location.search).get('__test') === '1';
  }
  return _isTestMode;
}

/**
 * Apply test mode effects to the document.
 * Call once from App.tsx or main entry point.
 */
export function applyTestMode(): void {
  if (!isTestMode()) return;

  // Disable all CSS transitions and animations for deterministic tests
  const style = document.createElement('style');
  style.setAttribute('data-testmode', 'true');
  style.textContent = `
    *, *::before, *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      transition-delay: 0s !important;
      animation-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}
