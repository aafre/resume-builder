import type { Session } from '@supabase/supabase-js';
import { apiClient, ApiError } from '../lib/api-client';

const API_BASE_URL = "/api";
const API_URL = `${API_BASE_URL}/templates`;

/**
 * Fetch available templates.
 * @returns {Promise<any[]>} List of templates with metadata.
 */
export async function fetchTemplates() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }
  const data = await response.json();
  if (!data.success || !data.templates) {
    throw new Error("Invalid API response");
  }
  return data.templates; // Extract templates array
}

/**
 * Fetch template YAML data by template ID.
 * @param {string} templateId - The ID of the template to fetch.
 * @returns {Promise<any>} The YAML data of the template.
 */
export async function fetchTemplate(templateId: string) {
  const response = await fetch(`${API_BASE_URL}/template/${templateId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch template");
  }
  const { yaml, supportsIcons } = await response.json();
  return { yaml, supportsIcons }; 
}

/**
 * Generate a resume PDF by submitting YAML and template ID, along with icons.
 * @param {FormData} formData - The FormData containing YAML, template ID, and icons.
 * @returns {Promise<any>} The response from the backend with the PDF blob and filename.
 */
export async function generateResume(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Failed to generate resume");
  }

  const contentType = response.headers.get("content-type");
  const contentDisposition = response.headers.get("Content-Disposition");

  if (contentType && contentType.includes("application/pdf")) {
    const pdfBlob = await response.blob();

    // Extract filename from Content-Disposition header
    const fileName = contentDisposition?.split("filename=")[1]?.replace(/"/g, "") || "resume.pdf";

    return { pdfBlob, fileName };
  } else {
    const errorResponse = await response.json();
    throw new Error(
      errorResponse.error || "Unexpected response: Expected a PDF file"
    );
  }
}

/**
 * Generate a PDF preview for display in modal (returns blob only, no download).
 * Uses the same endpoint as generateResume but returns only the blob for preview purposes.
 * @param {FormData} formData - The FormData containing YAML, template ID, and icons.
 * @param {Object} options - Optional configuration.
 * @param {AbortSignal} options.signal - Optional abort signal for request cancellation.
 * @returns {Promise<Blob>} The PDF blob for preview display.
 */
export async function generatePreviewPdf(
  formData: FormData,
  options?: { signal?: AbortSignal }
): Promise<Blob> {
  const controller = options?.signal ? null : new AbortController();
  const signal = options?.signal || controller?.signal;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 30000) : null;

  try {
    const response = await fetch(`${API_BASE_URL}/generate?preview=true`, {
      method: "POST",
      body: formData,
      signal: signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = "Failed to generate preview";
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.error || errorMessage;
      } catch {
        // Response might not be JSON
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/pdf")) {
      return await response.blob();
    } else {
      let errorMessage = "Unexpected response: Expected a PDF file";
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.error || errorMessage;
      } catch {
        // Response might not be JSON
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Preview generation timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Generate thumbnail for a saved resume.
 * Returns structured response with success status and thumbnail data.
 *
 * @param {string} resumeId - The ID of the resume to generate a thumbnail for.
 * @returns {Promise<{success: boolean, thumbnail_url?: string | null, pdf_generated_at?: string | null, error?: string, retryable?: boolean, error_type?: string}>}
 */
export async function generateThumbnail(
  resumeId: string,
  session: Session | null
): Promise<{
  success: boolean;
  thumbnail_url?: string | null;
  pdf_generated_at?: string | null;
  error?: string;
  retryable?: boolean;
  error_type?: string;
}> {
  try {
    if (!session) {
      return { success: false, error: 'Not authenticated', retryable: false };
    }

    const result = await apiClient.post(`/api/resumes/${resumeId}/thumbnail`, null, { session });
    return {
      success: result.success !== false, // Backend may return success:true with null thumbnail
      thumbnail_url: result.thumbnail_url,
      pdf_generated_at: result.pdf_generated_at,
      retryable: result.retryable || false,
      error_type: result.error_type
    };
  } catch (error) {
    console.error(`Thumbnail generation error for resume ${resumeId}:`, error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        retryable: error.data?.retryable || false,
        error_type: error.data?.error_type
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      retryable: true  // Network errors are retryable
    };
  }
}

