/// <reference types="vitest" />
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Editor from "../components/Editor";
import { EditorProvider } from "../contexts/EditorContext";
import * as templateService from "../services/templates";
import yaml from "js-yaml";

// Sample template data that the backend might return.
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
      {
        platform: "github",
        url: "https://github.com/johndoe",
        display_text: "johndoe",
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
      name: "Experience",
      content: [
        {
          company: "Company A",
          title: "Developer",
          dates: "2020-2021",
          description: ["Did awesome work."],
          icon: "company_a.png",
        },
      ],
    },
    {
      name: "Certifications",
      type: "icon-list",
      content: [
        {
          certification: "Test Cert",
          issuer: "Test Issuer",
          date: "2020",
          icon: "nonexistent.png", // Use a broken icon to test processSections behavior.
        },
      ],
    },
  ],
};

const mockTemplateData = {
  yaml: yaml.dump(sampleTemplate),
  supportsIcons: false,
};

describe("Editor Component", () => {
  // Mock fetchTemplate to resolve with our sample data.
  beforeEach(() => {
    vi.spyOn(templateService, "fetchTemplate").mockResolvedValue(
      mockTemplateData
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially and then displays contact info and sections", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Initially, the component should display "Loading..."
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for the template to load and for contact info to appear.
    await waitFor(() => {
      // Use getLabelText to be more specific about which "John Doe" we're looking for
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Verify that a section with the Summary is rendered.
    expect(screen.getByText("This is a summary.")).toBeInTheDocument();
  });

  it("renders the Add Section button correctly", async () => {
    render(
      <EditorProvider>
        <MemoryRouter initialEntries={["/editor?template=1"]}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </EditorProvider>
    );

    // Wait for the template to load.
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe");
    });

    // Find the "+" button (Add Section button) and verify it exists
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((button) => {
      const className = button.className || "";
      const textContent = button.textContent || "";
      return (
        className.includes("from-blue-600") &&
        className.includes("to-indigo-600") &&
        !textContent.includes("Download") &&
        !textContent.includes("Creating")
      );
    });

    // Verify the add button exists and is clickable
    expect(addButton).toBeTruthy();
    expect(addButton).not.toBeDisabled();

    // Verify it has the expected styling
    expect(addButton?.className).toContain("from-blue-600");
    expect(addButton?.className).toContain("to-indigo-600");
  });

  // Additional tests (e.g., for exporting YAML, generating PDF, etc.) can be added here.
});
