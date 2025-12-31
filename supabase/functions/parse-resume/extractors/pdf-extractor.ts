/**
 * PDF text extraction utility
 * Extracts plain text from PDF files using pdf-parse library
 */

import pdf from 'npm:pdf-parse@1.1.1';
import { Buffer } from 'node:buffer';

/**
 * Extract text content from PDF file
 * @param fileBuffer - ArrayBuffer containing PDF bytes
 * @returns Extracted plain text
 * @throws Error if PDF extraction fails
 */
export async function extractTextFromPDF(
  fileBuffer: ArrayBuffer
): Promise<string> {
  try {
    // Convert ArrayBuffer to Node.js Buffer for pdf-parse
    const buffer = Buffer.from(fileBuffer);

    // Extract text using pdf-parse
    const data = await pdf(buffer);

    let text = data.text;

    // Clean up common PDF artifacts
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ');

    // Remove page numbers (common patterns)
    text = text.replace(/Page \d+ of \d+/gi, '');
    text = text.replace(/\d+\s*\/\s*\d+/g, '');

    // Remove form feed characters
    text = text.replace(/\f/g, '\n');

    return text.trim();
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}
