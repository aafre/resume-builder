/**
 * Resume detection utility
 * Guard rail to prevent processing of non-resume files (invoices, books, etc.)
 */

// Keywords that typically appear in resumes
const RESUME_KEYWORDS = [
  'experience',
  'education',
  'employment',
  'work history',
  'skills',
  'qualifications',
  'university',
  'degree',
  'certification',
  'professional',
  'resume',
  'curriculum vitae',
  'cv',
  'objective',
  'summary',
  'career',
];

/**
 * Detect if text content is likely a resume
 * @param text - Extracted text from uploaded file
 * @returns True if text appears to be a resume (has >= 3 resume keywords)
 */
export function isLikelyResume(text: string): boolean {
  if (!text || text.length < 100) {
    return false; // Too short to be a meaningful resume
  }

  const normalized = text.toLowerCase();

  // Count how many resume keywords are present
  const matches = RESUME_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword)
  );

  // Require at least 3 resume keywords to be present
  // This prevents invoices, books, and other documents from passing
  return matches.length >= 3;
}
