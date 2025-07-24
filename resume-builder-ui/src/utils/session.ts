/**
 * Session management utilities for Resume Builder
 * Provides session isolation for user uploads and temporary files
 */

const SESSION_KEY = 'resume-builder-session-id';

/**
 * Generate a new session ID using crypto.randomUUID()
 * Fallback to timestamp-based ID if crypto is not available
 */
function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the current session ID from localStorage
 * If no session exists, generate a new one
 */
export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clear the current session ID
 * This will force a new session on next getSessionId() call
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get a fresh session ID (clears existing and generates new)
 */
export function getNewSessionId(): string {
  clearSession();
  return getSessionId();
}