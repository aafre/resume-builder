import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
  afterEach,
} from "vitest";
import Editor from "../components/Editor";
import { toast } from "react-toastify";
import yaml from "js-yaml";

// Define your sample template data.
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
          icon: "nonexistent.png", // A broken icon path
        },
      ],
    },
  ],
};

const mockTemplateData = {
  yaml: yaml.dump(sampleTemplate),
  supportsIcons: false,
};

// Ensure URL.createObjectURL exists (jsdom may not implement it).
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => "blob:http://dummy-url");
}

// Stub the global fetch function so that calls to the template endpoint return our mock data.
beforeAll(() => {
  vi.spyOn(window, "fetch").mockImplementation(
    (input: RequestInfo, init?: RequestInit) => {
      // Check if the URL includes "/api/template/"
      if (typeof input === "string" && input.includes("/api/template/")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              yaml: mockTemplateData.yaml,
              supportsIcons: mockTemplateData.supportsIcons,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }
      // For other fetch calls, return a default 404 response.
      return Promise.resolve(new Response(null, { status: 404 }));
    }
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks(); // Reset all mocks after each test
});

describe("Editor Component Integration", () => {
  // Helper: render Editor with template=1 query parameter.
  const renderEditor = () =>
    render(
      <MemoryRouter initialEntries={["/editor?template=1"]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MemoryRouter>
    );

  it("loads template and displays contact info and sections", async () => {
    renderEditor();
    // Initially, the component should display "Loading..."
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    // Wait for the contact info input to have "John Doe".
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    // Verify that the summary section is rendered.
    expect(screen.getByDisplayValue("This is a summary.")).toBeInTheDocument();
  });

  it.skip("exports YAML when Export button is clicked", async () => {
    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL");
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const exportButton = screen.getByTitle("Export your resume as a YAML file");
    fireEvent.click(exportButton);
    await waitFor(async () => {
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      expect(blobArg instanceof Blob).toBe(true);
      const text = await new Response(blobArg).text();
      const exportedYaml = yaml.load(text) as { sections?: any[] };
      expect(exportedYaml).toHaveProperty("sections");
      const certSection = exportedYaml.sections!.find(
        (s) => s.name === "Certifications"
      );
      expect(certSection).toBeTruthy();
      expect(certSection.content[0].icon).toBe("/icons/nonexistent.png");
    });
    createObjectURLSpy.mockRestore();
  });

  it.skip("opens the section type modal and adds a new section when a type is selected", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const addSectionButton = screen.getByText(/Add Section/i);
    fireEvent.click(addSectionButton);
    await waitFor(() => {
      expect(screen.getByText("Select Section Type")).toBeInTheDocument();
    });
    const textSectionOption = screen.getByText("Text Section");
    fireEvent.click(textSectionOption);
    await waitFor(() => {
      expect(screen.getAllByText("New Section").length).toBeGreaterThan(0);
    });
  });

  it.skip("removes a section when its Remove button is clicked", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);
    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("This is a summary.")
      ).not.toBeInTheDocument();
    });
  });

  it.skip("generates resume PDF when Generate PDF button is clicked", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const generateButton = screen.getByText(/Generate PDF/i);
    fireEvent.click(generateButton);
    expect(generateButton).toHaveTextContent("Generating...");
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Resume generated successfully!"
      );
    });
  });
});

describe("Editor Additional Scenarios", () => {
  const renderEditor = (initialEntry: string = "/editor?template=1") =>
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MemoryRouter>
    );

  it("logs error and renders nothing if templateId is missing", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    renderEditor("/editor"); // No query parameter provided.
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Template ID is undefined.");
    });
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  it("handles errors when fetching template", async () => {
    const fetchError = new Error("Network error");
    // Override fetchTemplate for this test by stubbing fetch (or using require if needed)
    vi.spyOn(window, "fetch").mockRejectedValueOnce(fetchError);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const toastErrorSpy = vi.spyOn(toast, "error");
    renderEditor();
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching template:",
        fetchError
      );
      expect(toastErrorSpy).toHaveBeenCalledWith("Failed to load template.");
    });
    consoleErrorSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });

  it.skip("processes sections correctly for Certifications", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL");
    const exportButton = screen.getByTitle("Export your resume as a YAML file");
    fireEvent.click(exportButton);
    await waitFor(async () => {
      expect(createObjectURLSpy).toHaveBeenCalled();
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      expect(blobArg instanceof Blob).toBe(true);
      const text = await new Response(blobArg).text();
      const exportedYaml = yaml.load(text) as { sections?: any[] };
      expect(exportedYaml).toHaveProperty("sections");
      const certSection = exportedYaml.sections!.find(
        (s) => s.name === "Certifications"
      );
      expect(certSection).toBeTruthy();
      expect(certSection.content[0].icon).toBe("/icons/nonexistent.png");
    });
    createObjectURLSpy.mockRestore();
  });

  it.skip("updates a section title when title editing is saved", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const editButtons = screen.getAllByTitle("Edit Title");
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]);
      const titleInput = screen
        .getAllByRole("textbox")
        .find((el) => el.tagName === "INPUT");
      expect(titleInput).toBeDefined();
      if (titleInput) {
        fireEvent.change(titleInput, {
          target: { value: "Updated Section Title" },
        });
        const saveButton = screen.getByTitle("Save Title");
        fireEvent.click(saveButton);
        await waitFor(() => {
          expect(
            screen.getByText((content) =>
              content.includes("Updated Section Title")
            )
          ).toBeInTheDocument();
        });
      }
    }
  });

  it.skip("imports YAML and updates contact info and sections", async () => {
    const importedTemplate = {
      contact_info: {
        name: "Jane Doe",
        location: "Paris, France",
        email: "jane.doe@example.com",
        phone: "+33 123456789",
        linkedin: "https://linkedin.com/in/janedoe",
      },
      sections: [
        {
          name: "Summary",
          type: "text",
          content: "Imported summary.",
        },
      ],
    };
    const yamlString = yaml.dump(importedTemplate);
    const file = new File([yamlString], "import.yaml", {
      type: "application/x-yaml",
    });
    const { container } = renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    // Query for the file input element within the rendered container.
    const fileInput = container.querySelector(
      'input[title="Import your resume as a YAML file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeDefined();
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Imported summary.")).toBeInTheDocument();
    });
  });

  it.skip("toggles the help modal when the Help button is clicked and then closed", async () => {
    renderEditor();
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
    const helpButton = screen.getByTitle("What is YAML Export/Import?");
    fireEvent.click(helpButton);
    await waitFor(() => {
      expect(
        screen.getByText("Why Use YAML Export/Import?")
      ).toBeInTheDocument();
    });
    const gotItButton = screen.getByText("Got It!");
    fireEvent.click(gotItButton);
    await waitFor(() => {
      expect(
        screen.queryByText("Why Use YAML Export/Import?")
      ).not.toBeInTheDocument();
    });
  });
});
