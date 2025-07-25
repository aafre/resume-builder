/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Editor from "../components/Editor";
import * as templateService from "../services/templates";
import yaml from "js-yaml";

// Sample template data that the backend might return.
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

  it.skip("renders loading state initially and then displays contact info and sections", async () => {
    render(
      <MemoryRouter initialEntries={["/editor?template=1"]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MemoryRouter>
    );

    // Initially, the component should display "Loading..."
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for the template to load and for contact info to appear.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Verify that a section with the Summary is rendered.
    expect(screen.getByDisplayValue("This is a summary.")).toBeInTheDocument();
  });

  it.skip("opens the section type modal when the Add Section button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/editor?template=1"]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the template to load.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Click the "Add Section" button.
    const addSectionButton = screen.getByText(/Add Section/i);
    fireEvent.click(addSectionButton);

    // Check that the SectionTypeModal is displayed.
    await waitFor(() => {
      expect(screen.getByText("Select Section Type")).toBeInTheDocument();
    });
  });

  // Additional tests (e.g., for exporting YAML, generating PDF, etc.) can be added here.
});
