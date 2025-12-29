/**
 * DOCX text extraction utility
 * Extracts plain text from Word documents using mammoth library
 */

import mammoth from 'npm:mammoth@1.6.0';

/**
 * Extract text content from DOCX file
 * @param fileBuffer - ArrayBuffer containing DOCX bytes
 * @returns Extracted plain text
 * @throws Error if DOCX extraction fails
 */
export async function extractTextFromDOCX(
  fileBuffer: ArrayBuffer
): Promise<string> {
  try {
    // Extract raw text using mammoth
    const result = await mammoth.extractRawText({
      arrayBuffer: fileBuffer,
    });

    let text = result.value;

    // Clean up excessive whitespace
    text = text.replace(/\s+/g, ' ');

    // Log warnings if any (tables, images that couldn't be extracted)
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX extraction warnings:', result.messages);
    }

    return text.trim();
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}
