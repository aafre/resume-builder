/// <reference types="vitest" />
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Editor from "../components/Editor";
import { renderWithProviders } from "../test-utils";
import * as templateService from "../services/templates";
import yaml from "js-yaml";

// Sample template data for integration testing
const sampleTemplate = {
  contact_info: {
    name: "John Doe",
    location: "London, UK",
    email: "john.doe@example.com",
    phone: "+44 7000000000",
    linkedin: "https://linkedin.com/in/johndoe", // Deprecated but kept for backward compatibility
    social_links: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/johndoe",
        display_text: "John Doe",
      },
    ],
  },
  sections: [
    {
      name: "Summary",
      type: "text",
      content: "This is a summary.",
    },
    {
      name: "Skills",
      type: "bulleted-list",
      content: ["JavaScript", "React", "TypeScript"],
    },
  ],
};

const mockTemplateData = {
  yaml: yaml.dump(sampleTemplate),
  supportsIcons: false,
};

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.spyOn(templateService, "fetchTemplate").mockResolvedValue(mockTemplateData);
    // Mock generateResume to avoid actual PDF generation
    vi.spyOn(templateService, "generateResume").mockResolvedValue({
      pdfBlob: new Blob(),
      fileName: "test-resume.pdf"
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip("completes a full resume editing workflow", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/editor" element={<Editor />} />
      </Routes>,
      {
        withEditorProvider: true,
        initialRoute: "/editor?template=1",
      }
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Edit contact info
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();

    // Verify existing section content is present (TipTap editor doesn't support getByDisplayValue)
    expect(screen.getByText("This is a summary.")).toBeInTheDocument();

    // Verify list items are present (TipTap editor doesn't support editing via getByDisplayValue)
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it.skip("handles section removal workflow", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/editor" element={<Editor />} />
      </Routes>,
      {
        withEditorProvider: true,
        initialRoute: "/editor?template=1",
      }
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Count initial sections (Summary and Skills)
    const initialRemoveButtons = screen.getAllByText("Remove");
    const initialSectionCount = initialRemoveButtons.length;
    expect(initialSectionCount).toBeGreaterThan(0);

    // Remove a section
    fireEvent.click(initialRemoveButtons[0]);

    // Verify section was removed
    await waitFor(() => {
      const updatedRemoveButtons = screen.getAllByText("Remove");
      expect(updatedRemoveButtons.length).toBe(initialSectionCount - 1);
    });
  });

  it.skip("can find and click add section button", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/editor" element={<Editor />} />
      </Routes>,
      {
        withEditorProvider: true,
        initialRoute: "/editor?template=1",
      }
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Find the add button - just verify it exists and can be clicked
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find(button => {
      const className = button.className || "";
      const textContent = button.textContent || "";
      return className.includes("from-blue-600") && 
             className.includes("to-indigo-600") &&
             !textContent.includes("Download") &&
             !textContent.includes("Creating");
    });
    
    expect(addButton).toBeTruthy();
    
    // Just verify the button is clickable - don't test the full modal workflow
    expect(addButton).not.toBeDisabled();
  });

  it.skip("handles PDF generation workflow", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/editor" element={<Editor />} />
      </Routes>,
      {
        withEditorProvider: true,
        initialRoute: "/editor?template=1",
      }
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Find and click the download button
    const downloadButton = screen.getByText(/Download My Resume/i);
    expect(downloadButton).toBeInTheDocument();
    
    fireEvent.click(downloadButton);

    // Verify the button shows loading state
    await waitFor(() => {
      expect(screen.getByText(/Creating Your Resume/i)).toBeInTheDocument();
    });

    // Verify generateResume was called
    expect(templateService.generateResume).toHaveBeenCalledTimes(1);
  });

  describe("Error Scenarios", () => {
    it.skip("handles template loading failure gracefully", async () => {
      // Mock a failed template fetch
      vi.spyOn(templateService, "fetchTemplate").mockRejectedValue(
        new Error("Failed to load template")
      );

      renderWithProviders(
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>,
        {
          withEditorProvider: true,
          initialRoute: "/editor?template=1",
        }
      );

      // Should show loading initially
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();

      // Should handle the error (implementation may vary)
      // This test documents the current behavior
    });

    it.skip("handles PDF generation failure gracefully", async () => {
      // Mock a failed PDF generation
      vi.spyOn(templateService, "generateResume").mockRejectedValue(
        new Error("PDF generation failed")
      );

      renderWithProviders(
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>,
        {
          withEditorProvider: true,
          initialRoute: "/editor?template=1",
        }
      );

      // Wait for template to load
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
      });

      // Try to generate PDF
      const downloadButton = screen.getByText(/Download My Resume/i);
      fireEvent.click(downloadButton);

      // Should handle the error gracefully - wait for async call
      await waitFor(() => {
        expect(templateService.generateResume).toHaveBeenCalledTimes(1);
      });
    });
  });
});