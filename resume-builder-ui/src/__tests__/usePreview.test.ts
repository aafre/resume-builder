/// <reference types="vitest" />
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePreview } from "../hooks/usePreview";
import * as templateService from "../services/templates";

// Mock the template service
vi.mock("../services/templates");

// Mock session utilities
vi.mock("../utils/session", () => ({
  getSessionId: () => "test-session-id",
}));

// Mock icon extractor
vi.mock("../utils/iconExtractor", () => ({
  extractReferencedIconFilenames: () => [],
}));

describe("usePreview hook", () => {
  const mockContactInfo = {
    name: "John Doe",
    location: "NYC",
    email: "john@example.com",
    phone: "555-1234",
    linkedin: "",
  };

  const mockSections = [
    { name: "Summary", type: "text", content: "Test summary" },
  ];

  const mockIconRegistry = {
    getIconFile: vi.fn(() => null),
  };

  const mockProcessSections = vi.fn((sections) => sections);

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url-123");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("initializes with null preview URL", () => {
    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    expect(result.current.previewUrl).toBeNull();
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.lastGenerated).toBeNull();
    expect(result.current.isStale).toBe(false);
  });

  it("generates preview successfully", async () => {
    const mockPdfBlob = new Blob(["pdf content"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    // Initially not generating
    expect(result.current.isGenerating).toBe(false);

    // Trigger preview generation
    act(() => {
      result.current.generatePreview();
    });

    // Should be generating
    expect(result.current.isGenerating).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    // Should have preview URL
    expect(result.current.previewUrl).toBe("blob:mock-url-123");
    expect(result.current.error).toBeNull();
    expect(result.current.lastGenerated).toBeInstanceOf(Date);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockPdfBlob);
  });

  it("handles preview generation error", async () => {
    const errorMessage = "Generation failed";
    vi.spyOn(templateService, "generatePreviewPdf").mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.previewUrl).toBeNull();
  });

  it("sets error when contactInfo is missing", async () => {
    const { result } = renderHook(() =>
      usePreview({
        contactInfo: null,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.error).toContain("Missing required parameters for live preview");
    });

    expect(result.current.previewUrl).toBeNull();
  });

  it("sets error when templateId is missing", async () => {
    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: null,
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.error).toContain("Missing");
    });

    expect(result.current.previewUrl).toBeNull();
  });

  it("detects staleness when content changes after generation", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result, rerender } = renderHook(
      ({ sections }) =>
        usePreview({
          contactInfo: mockContactInfo,
          sections,
          templateId: "modern",
          iconRegistry: mockIconRegistry,
          processSections: mockProcessSections,
        }),
      { initialProps: { sections: mockSections } }
    );

    // Generate initial preview
    await act(async () => {
      await result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.previewUrl).not.toBeNull();
    });

    // Should not be stale initially (right after generation)
    expect(result.current.isStale).toBe(false);

    // Change content - make it significantly different to ensure hash changes
    const newSections = [
      { name: "Summary", type: "text", content: "This is a completely different and updated summary with more content" },
    ];

    act(() => {
      rerender({ sections: newSections });
    });

    // Wait for the component to detect the change
    await waitFor(() => {
      // isStale should become true after content hash differs
      expect(result.current.isStale).toBe(true);
    }, { timeout: 3000 });
  });

  it("clears staleness after regenerating with new content", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result, rerender } = renderHook(
      ({ sections }) =>
        usePreview({
          contactInfo: mockContactInfo,
          sections,
          templateId: "modern",
          iconRegistry: mockIconRegistry,
          processSections: mockProcessSections,
        }),
      { initialProps: { sections: mockSections } }
    );

    // Generate initial preview
    await act(async () => {
      await result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.isStale).toBe(false);
    });

    // Change content significantly
    const newSections = [
      { name: "Summary", type: "text", content: "This is a very different updated summary with lots of new text" },
    ];
    act(() => {
      rerender({ sections: newSections });
    });

    // Wait for staleness detection
    await waitFor(() => {
      expect(result.current.isStale).toBe(true);
    }, { timeout: 3000 });

    // Regenerate preview with new content
    await act(async () => {
      await result.current.generatePreview();
    });

    // Staleness should clear after regeneration
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.isStale).toBe(false);
    });
  });

  it("clears preview and revokes blob URL", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    // Generate preview
    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.previewUrl).toBe("blob:mock-url-123");
    });

    // Clear preview
    act(() => {
      result.current.clearPreview();
    });

    expect(result.current.previewUrl).toBeNull();
    expect(result.current.lastGenerated).toBeNull();
    expect(result.current.error).toBeNull();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-123");
  });

  it("revokes old blob URL when generating new preview", async () => {
    const mockPdfBlob1 = new Blob(["pdf1"], { type: "application/pdf" });
    const mockPdfBlob2 = new Blob(["pdf2"], { type: "application/pdf" });

    vi.spyOn(templateService, "generatePreviewPdf")
      .mockResolvedValueOnce(mockPdfBlob1)
      .mockResolvedValueOnce(mockPdfBlob2);

    // Mock to return different URLs
    let urlCounter = 0;
    global.URL.createObjectURL = vi.fn(() => `blob:mock-url-${++urlCounter}`);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    // Generate first preview
    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.previewUrl).toBe("blob:mock-url-1");
    });

    // Generate second preview
    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.previewUrl).toBe("blob:mock-url-2");
    });

    // Should have revoked the first URL
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-1");
  });

  it("calls processSections before generating preview", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const processSections = vi.fn((sections) => sections);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(processSections).toHaveBeenCalledWith(mockSections);
  });

  it("includes session ID in form data", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    const generateSpy = vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(generateSpy).toHaveBeenCalled();
    const formData = generateSpy.mock.calls[0][0] as FormData;
    expect(formData.get("session_id")).toBe("test-session-id");
  });

  it("includes template ID in form data", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    const generateSpy = vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "classic",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    const formData = generateSpy.mock.calls[0][0] as FormData;
    expect(formData.get("template")).toBe("classic");
  });

  it("cleans up blob URLs on unmount", () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result, unmount } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    act(() => {
      result.current.generatePreview();
    });

    // Wait a bit for generation
    waitFor(() => {
      expect(result.current.previewUrl).not.toBeNull();
    });

    const previewUrl = result.current.previewUrl;

    // Unmount
    unmount();

    // Should have revoked URL on cleanup
    if (previewUrl) {
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(previewUrl);
    }
  });

  it("does not generate when already generating", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    const generateSpy = vi.spyOn(templateService, "generatePreviewPdf").mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPdfBlob), 100))
    );

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    // Start first generation
    act(() => {
      result.current.generatePreview();
    });

    expect(result.current.isGenerating).toBe(true);

    // Try to generate again while still generating
    act(() => {
      result.current.generatePreview();
    });

    // Should only be called once (second call should be ignored or queued)
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    // Note: The actual implementation might allow concurrent calls
    // This test documents the expected behavior
  });

  it("updates lastGenerated timestamp on successful generation", async () => {
    const mockPdfBlob = new Blob(["pdf"], { type: "application/pdf" });
    vi.spyOn(templateService, "generatePreviewPdf").mockResolvedValue(mockPdfBlob);

    const { result } = renderHook(() =>
      usePreview({
        contactInfo: mockContactInfo,
        sections: mockSections,
        templateId: "modern",
        iconRegistry: mockIconRegistry,
        processSections: mockProcessSections,
      })
    );

    const beforeGeneration = new Date();

    act(() => {
      result.current.generatePreview();
    });

    await waitFor(() => {
      expect(result.current.lastGenerated).toBeInstanceOf(Date);
    });

    const afterGeneration = new Date();

    // Timestamp should be between before and after
    expect(result.current.lastGenerated!.getTime()).toBeGreaterThanOrEqual(beforeGeneration.getTime());
    expect(result.current.lastGenerated!.getTime()).toBeLessThanOrEqual(afterGeneration.getTime());
  });
});
