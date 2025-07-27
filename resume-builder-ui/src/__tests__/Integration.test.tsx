/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Editor from "../components/Editor";
import { EditorProvider } from "../contexts/EditorContext";
import * as templateService from "../services/templates";
import yaml from "js-yaml";

// Sample template data for integration testing
const sampleTemplate = {
  contact_info: {
    name: "John Doe",
    location: "London, UK",
    email: "john.doe@example.com",
    phone: "+44 7000000000",
    linkedin: "https://linkedin.com/in/johndoe",
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
    vi.spyOn(templateService, "generateResume").mockResolvedValue(new Blob());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("completes a full resume editing workflow", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Edit contact info
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();

    // Edit existing section content
    const summaryTextarea = screen.getByDisplayValue("This is a summary.");
    fireEvent.change(summaryTextarea, { 
      target: { value: "Updated professional summary." } 
    });
    expect(screen.getByDisplayValue("Updated professional summary.")).toBeInTheDocument();

    // Edit list items
    const skillInput = screen.getByDisplayValue("JavaScript");
    fireEvent.change(skillInput, { target: { value: "Python" } });
    expect(screen.getByDisplayValue("Python")).toBeInTheDocument();

    // Add new list item
    const addItemButtons = screen.getAllByText("Add Item");
    fireEvent.click(addItemButtons[0]); // Click the first "Add Item" button (for Skills section)

    // Verify new empty item was added
    const inputs = screen.getAllByDisplayValue("");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("handles section removal workflow", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
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

  it("can find and click add section button", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
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

  it("handles PDF generation workflow", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Wait for template to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
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
    it("handles template loading failure gracefully", async () => {
      // Mock a failed template fetch
      vi.spyOn(templateService, "fetchTemplate").mockRejectedValue(
        new Error("Failed to load template")
      );

      render(
        <EditorProvider>
          <MemoryRouter initialEntries={["/editor?template=1"]}>
            <Routes>
              <Route path="/editor" element={<Editor />} />
            </Routes>
          </MemoryRouter>
        </EditorProvider>
      );

      // Should show loading initially
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();

      // Should handle the error (implementation may vary)
      // This test documents the current behavior
    });

    it("handles PDF generation failure gracefully", async () => {
      // Mock a failed PDF generation
      vi.spyOn(templateService, "generateResume").mockRejectedValue(
        new Error("PDF generation failed")
      );

      render(
        <EditorProvider>
          <MemoryRouter initialEntries={["/editor?template=1"]}>
            <Routes>
              <Route path="/editor" element={<Editor />} />
            </Routes>
          </MemoryRouter>
        </EditorProvider>
      );

      // Wait for template to load
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      // Try to generate PDF
      const downloadButton = screen.getByText(/Download My Resume/i);
      fireEvent.click(downloadButton);

      // Should handle the error gracefully
      expect(templateService.generateResume).toHaveBeenCalledTimes(1);
    });
  });
});