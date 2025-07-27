import { vi, describe, it, expect, afterEach } from 'vitest';
import { fetchTemplate } from '../services/templates';

// Using the global Response provided by jsdom
describe("fetchTemplate", {}, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return template YAML and supportsIcons when response is OK", async () => {
    const templateId = "1";
    const mockData = { yaml: "sample: yaml content", supportsIcons: true };

    // Mock fetch to simulate a successful API response.
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 })
    );

    const result = await fetchTemplate(templateId);
    expect(result).toEqual(mockData);
  });

  it("should throw an error when the response is not OK", async () => {
    const templateId = "1";

    // Simulate a failed API call (e.g., HTTP 404)
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response("Not Found", { status: 404 })
    );

    await expect(fetchTemplate(templateId)).rejects.toThrow("Failed to fetch template");
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", async () => {
      const templateId = "1";

      // Simulate a network error
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(fetchTemplate(templateId)).rejects.toThrow("Network error");
    });

    it("should handle malformed JSON responses", async () => {
      const templateId = "1";

      // Simulate a response with invalid JSON
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response("Invalid JSON {", { status: 200 })
      );

      await expect(fetchTemplate(templateId)).rejects.toThrow();
    });

    it("should handle server errors (5xx)", async () => {
      const templateId = "1";

      // Simulate a server error
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response("Internal Server Error", { status: 500 })
      );

      await expect(fetchTemplate(templateId)).rejects.toThrow("Failed to fetch template");
    });

    it("should handle empty template ID", async () => {
      const templateId = "";

      // This should still make the API call (validation might be server-side)
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response("Bad Request", { status: 400 })
      );

      await expect(fetchTemplate(templateId)).rejects.toThrow("Failed to fetch template");
    });
  });
});
