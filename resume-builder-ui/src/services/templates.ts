import { supabase } from '../lib/supabase';

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
 * @returns {Promise<Blob>} The PDF blob for preview display.
 */
export async function generatePreviewPdf(formData: FormData): Promise<Blob> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);

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
 * @returns {Promise<{success: boolean, thumbnail_url?: string, pdf_generated_at?: string, error?: string}>}
 */
export async function generateThumbnail(resumeId: string): Promise<{
  success: boolean;
  thumbnail_url?: string;
  pdf_generated_at?: string;
  error?: string;
}> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`
      };
    }

    const result = await response.json();
    return {
      success: true,
      thumbnail_url: result.thumbnail_url,
      pdf_generated_at: result.pdf_generated_at
    };
  } catch (error) {
    console.error(`Thumbnail generation error for resume ${resumeId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

