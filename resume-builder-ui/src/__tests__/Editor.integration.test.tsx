/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Editor from "../components/Editor";
import * as templateService from "../services/templates";
import { toast } from "react-toastify";
import yaml from "js-yaml";

// Define URL.createObjectURL if it doesn't exist (jsdom may not implement it).
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => "blob:http://dummy-url");
}

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
  ],
};

const mockTemplateData = {
  yaml: yaml.dump(sampleTemplate),
  supportsIcons: false,
};

describe("Editor Component Integration", () => {
  // Mock fetchTemplate to always resolve with our sample data.
  beforeEach(() => {
    vi.spyOn(templateService, "fetchTemplate").mockResolvedValue(
      mockTemplateData
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper: render Editor with MemoryRouter using template=1 query param.
  const renderEditor = () => {
    render(
      <MemoryRouter initialEntries={["/editor?template=1"]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("loads template and displays contact info and sections", async () => {
    renderEditor();

    // Initially, the component should display "Loading..."
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait until contact info is rendered.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Verify that a section with the Summary is rendered.
    expect(screen.getByDisplayValue("This is a summary.")).toBeInTheDocument();
  });

  it("exports YAML when Export button is clicked", async () => {
    // Spy on URL.createObjectURL.
    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL");

    renderEditor();

    // Wait until template loads.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Click the Export button (by title).
    const exportButton = screen.getByTitle("Export your resume as a YAML file");
    fireEvent.click(exportButton);

    // Verify that URL.createObjectURL is called with a Blob.
    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      expect(blobArg instanceof Blob).toBe(true);
    });

    createObjectURLSpy.mockRestore();
  });

  it("opens the section type modal and adds a new section when a type is selected", async () => {
    renderEditor();

    // Wait until the template loads.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Click the "Add Section" button.
    const addSectionButton = screen.getByText(/Add Section/i);
    fireEvent.click(addSectionButton);

    // The modal should now be displayed.
    await waitFor(() => {
      expect(screen.getByText("Select Section Type")).toBeInTheDocument();
    });

    // Click the "Text Section" option.
    const textSectionOption = screen.getByText("Text Section");
    fireEvent.click(textSectionOption);

    // Now, a new section should be added with the default name "New Section".
    await waitFor(() => {
      expect(screen.getAllByText("New Section").length).toBeGreaterThan(0);
    });
  });

  it("removes a section when its Remove button is clicked", async () => {
    renderEditor();

    // Wait for the template to load.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // In our sampleTemplate, the "Summary" section is rendered via GenericSection.
    // Find the Remove button for a generic section.
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    // After removal, the Summary section should no longer be in the DOM.
    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("This is a summary.")
      ).not.toBeInTheDocument();
    });
  });

  it("generates resume PDF when Generate PDF button is clicked", async () => {
    // Spy on toast.success.
    const toastSuccessSpy = vi.spyOn(toast, "success");
    // Mock generateResume to resolve with a dummy PDF blob and file name.
    const dummyPdfBlob = new Blob(["dummy pdf content"], {
      type: "application/pdf",
    });
    const dummyFileName = "resume.pdf";
    const generateResumeSpy = vi
      .spyOn(templateService, "generateResume")
      .mockResolvedValue({ pdfBlob: dummyPdfBlob, fileName: dummyFileName });

    renderEditor();

    // Wait until template loads.
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // Click the "Generate PDF" button.
    const generateButton = screen.getByText(/Generate PDF/i);
    fireEvent.click(generateButton);

    // While generating, the button text should change.
    expect(generateButton).toHaveTextContent("Generating...");

    // Wait for the resume generation process to complete and the toast to be triggered.
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "Resume generated successfully!"
      );
    });

    expect(generateResumeSpy).toHaveBeenCalled();

    generateResumeSpy.mockRestore();
    toastSuccessSpy.mockRestore();
  });
});
