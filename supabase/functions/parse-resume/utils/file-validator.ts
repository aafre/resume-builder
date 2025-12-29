/**
 * File validation utility
 * Validates uploaded files for type, size, and magic numbers (anti-spoofing)
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: 'pdf' | 'docx';
  mimeType?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const VALID_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Validate uploaded file
 * Checks: file size, MIME type, and magic numbers (prevents extension spoofing)
 * @param file - Uploaded File object
 * @returns Validation result with file type or error message
 */
export async function validateFile(
  file: File
): Promise<FileValidationResult> {
  // 1. Check file size (max 10MB)
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 10MB)`,
    };
  }

  // 2. Check MIME type
  if (!VALID_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only PDF and DOCX are supported.`,
    };
  }

  // 3. Magic number validation (prevent extension spoofing)
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // PDF magic number: %PDF (0x25 0x50 0x44 0x46)
  const isPdf =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46;

  // DOCX magic number: PK (ZIP header, as DOCX is a ZIP archive)
  const isDocx = bytes[0] === 0x50 && bytes[1] === 0x4b;

  // Validate magic numbers match MIME type
  if (file.type === 'application/pdf' && !isPdf) {
    return {
      valid: false,
      error: 'File claims to be PDF but header is invalid',
    };
  }

  if (file.type.includes('wordprocessing') && !isDocx) {
    return {
      valid: false,
      error: 'File claims to be DOCX but header is invalid',
    };
  }

  // All validations passed
  return {
    valid: true,
    fileType: isPdf ? 'pdf' : 'docx',
    mimeType: file.type,
  };
}
