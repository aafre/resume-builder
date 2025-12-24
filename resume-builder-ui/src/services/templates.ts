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
 * Generate thumbnail for a saved resume asynchronously.
 * This triggers PDF generation on the backend and extracts a thumbnail image.
 * Designed to be called when navigating away from the editor (fire-and-forget).
 *
 * @param {string} resumeId - The ID of the resume to generate a thumbnail for.
 * @returns {Promise<void>} Resolves when the request is sent (doesn't wait for completion).
 */
export async function generateThumbnail(resumeId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Fire-and-forget: we don't throw errors, just log them
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error(`Thumbnail generation failed for resume ${resumeId}:`, errorData.error);
    } else {
      const result = await response.json();
      console.log(`Thumbnail generation queued for resume ${resumeId}:`, result);
    }
  } catch (error) {
    // Silently fail - thumbnail generation is not critical
    console.error(`Error calling thumbnail generation for resume ${resumeId}:`, error);
  }
}

