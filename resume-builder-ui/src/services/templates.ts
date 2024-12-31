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

