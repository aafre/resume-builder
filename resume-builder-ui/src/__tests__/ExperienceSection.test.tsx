import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExperienceSection from "../components/ExperienceSection";

// --- Mock the IconManager Component ---
vi.mock("../components/IconManager", () => {
  return {
    default: (props: { value: string; onChange: any; registerIcon: any; getIconFile: any; removeIcon: any }) => (
      <div data-testid="icon-manager" data-value={props.value}>
        IconManager
      </div>
    ),
  };
});

// --- Mock RichTextInput to return a simple input for testing ---
vi.mock("../components/RichTextInput", () => {
  return {
    RichTextInput: (props: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) => {
      return (
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className={props.className}
          data-testid="rich-text-input"
        />
      );
    },
  };
});

// --- Mock SectionHeader to avoid complexity ---
vi.mock("../components/SectionHeader", () => {
  return {
    SectionHeader: (props: { title: string; onDelete: () => void }) => {
      return (
        <div data-testid="section-header">
          <h2>{props.title}</h2>
          <button onClick={props.onDelete}>Remove</button>
        </div>
      );
    },
  };
});

// --- Mock MarkdownHint ---
vi.mock("../components/MarkdownLinkPreview", () => {
  return {
    MarkdownHint: () => <div data-testid="markdown-hint">Markdown Hint</div>,
  };
});

// --- Define base mock data for experiences ---
const baseMockExperiences = [
  {
    company: "Lorem Ipsum Corp",
    title: "Senior Software Engineer",
    dates: "Sep 2023 – Present",
    description: [
      "Developed and maintained applications.",
      "Optimized performance by identifying inefficiencies.",
    ],
    icon: "company_google.png",
  },
  {
    company: "Dolor Sit Solutions",
    title: "Platform Engineer",
    dates: "Nov 2021 – Aug 2023",
    description: [
      "Enhanced application performance.",
      "Automated CI/CD pipelines.",
    ],
    icon: "company_apple.png",
  },
];

// Helper to create default props
const createDefaultProps = (overrides = {}) => ({
  sectionName: "Experience",
  experiences: JSON.parse(JSON.stringify(baseMockExperiences)),
  onUpdate: vi.fn(),
  onTitleEdit: vi.fn(),
  onTitleSave: vi.fn(),
  onTitleCancel: vi.fn(),
  onDelete: vi.fn(),
  isEditingTitle: false,
  temporaryTitle: "Experience",
  setTemporaryTitle: vi.fn(),
  supportsIcons: false,
  ...overrides,
});

describe("ExperienceSection", { timeout: 5000 }, () => {
  it("renders experience entries with correct values", () => {
    const props = createDefaultProps();
    render(<ExperienceSection {...props} />);

    // Check that each experience header is rendered.
    expect(screen.getByText("Experience #1")).toBeInTheDocument();
    expect(screen.getByText("Experience #2")).toBeInTheDocument();

    // Check input fields for company, title, dates.
    expect(screen.getByDisplayValue("Lorem Ipsum Corp")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Senior Software Engineer")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sep 2023 – Present")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Dolor Sit Solutions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Platform Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nov 2021 – Aug 2023")).toBeInTheDocument();

    // Check description inputs.
    expect(
      screen.getByDisplayValue("Developed and maintained applications.")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Optimized performance by identifying inefficiencies."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Enhanced application performance.")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Automated CI/CD pipelines.")
    ).toBeInTheDocument();
  });

  it("calls onUpdate when an input value is changed", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<ExperienceSection {...props} />);

    // Change the company name for the first experience.
    const companyInput = screen.getByDisplayValue("Lorem Ipsum Corp");
    fireEvent.change(companyInput, { target: { value: "New Company Name" } });

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences[0].company).toBe("New Company Name");
    // Ensure the second experience remains unchanged.
    expect(updatedExperiences[1]).toEqual(baseMockExperiences[1]);
  });

  it("removes an experience entry when the Remove button is clicked", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<ExperienceSection {...props} />);

    // Click the delete button (trash icon) for the first experience.
    const deleteButtons = screen.getAllByTitle("Delete this experience");
    fireEvent.click(deleteButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences).toHaveLength(baseMockExperiences.length - 1);
    expect(updatedExperiences[0].company).toBe("Dolor Sit Solutions");
  });

  it("adds a new experience entry when the Add Experience button is clicked", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<ExperienceSection {...props} />);

    const addButton = screen.getByText("Add Experience");
    fireEvent.click(addButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences).toHaveLength(baseMockExperiences.length + 1);

    // Verify the new entry has empty/default values.
    const newExperience = updatedExperiences[updatedExperiences.length - 1];
    expect(newExperience.company).toBe("");
    expect(newExperience.title).toBe("");
    expect(newExperience.dates).toBe("");
    expect(newExperience.description).toEqual([]);
  });

  it("adds a new description line when the Add Description Point button is clicked", () => {
    const onUpdateMock = vi.fn();
    const experiences = JSON.parse(JSON.stringify(baseMockExperiences));
    const initialLength = experiences[0].description.length;
    const props = createDefaultProps({ experiences, onUpdate: onUpdateMock });
    render(<ExperienceSection {...props} />);

    // For the first experience, click the Add Description Point button.
    const addDescButton = screen.getAllByText("+ Add Description Point")[0];
    fireEvent.click(addDescButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    // Expect the new length to be the original length plus one.
    expect(updatedExperiences[0].description).toHaveLength(initialLength + 1);
    expect(
      updatedExperiences[0].description[
        updatedExperiences[0].description.length - 1
      ]
    ).toBe("");
  });

  it("removes a description line when its delete button is clicked", () => {
    const onUpdateMock = vi.fn();
    const experiences = JSON.parse(JSON.stringify(baseMockExperiences));
    const initialLength = experiences[0].description.length;
    const props = createDefaultProps({ experiences, onUpdate: onUpdateMock });
    render(<ExperienceSection {...props} />);

    // For the first experience, click the delete button for the first description.
    const deleteButtons = screen.getAllByTitle("Remove description point");
    fireEvent.click(deleteButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    // Expect the new length to be the original length minus one.
    expect(updatedExperiences[0].description).toHaveLength(initialLength - 1);
  });

  it("renders the IconManager component when supportsIcons is true", () => {
    const mockIconRegistry = {
      registerIcon: vi.fn(),
      getIconFile: vi.fn(),
      removeIcon: vi.fn(),
    };
    const props = createDefaultProps({
      supportsIcons: true,
      iconRegistry: mockIconRegistry,
    });
    render(<ExperienceSection {...props} />);

    // Check that IconManager is rendered for each experience entry.
    const iconManagerElements = screen.getAllByTestId("icon-manager");
    expect(iconManagerElements).toHaveLength(baseMockExperiences.length);
    // Verify that the first experience's icon is passed correctly.
    expect(iconManagerElements[0]).toHaveAttribute(
      "data-value",
      "company_google.png"
    );
  });

  it("calls onDeleteEntry when provided instead of deleting directly", () => {
    const onUpdateMock = vi.fn();
    const onDeleteEntryMock = vi.fn();
    const props = createDefaultProps({
      onUpdate: onUpdateMock,
      onDeleteEntry: onDeleteEntryMock,
    });
    render(<ExperienceSection {...props} />);

    const deleteButtons = screen.getAllByTitle("Delete this experience");
    fireEvent.click(deleteButtons[0]);

    // Should call onDeleteEntry for confirmation, not onUpdate
    expect(onDeleteEntryMock).toHaveBeenCalledWith(0);
    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it("renders section header with correct title", () => {
    const props = createDefaultProps({ sectionName: "Work History" });
    render(<ExperienceSection {...props} />);

    expect(screen.getByText("Work History")).toBeInTheDocument();
  });
});
