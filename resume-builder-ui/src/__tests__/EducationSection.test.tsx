import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DndContext } from "@dnd-kit/core";
import EducationSection from "../components/EducationSection";

// Wrapper component to provide DndContext for testing
const DndWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DndContext>{children}</DndContext>
);

// --- Mock the IconManager Component ---
vi.mock("../components/IconManager", () => {
  return {
    default: (props: { value: string; onChange: any; registerIcon: any; getIconFile: any; removeIcon: any }) => {
      return (
        <div data-testid="icon-manager" data-value={props.value}>
          IconManager
        </div>
      );
    },
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

// --- Define inline mock data for education entries ---
const mockEducation = [
  {
    degree: "MSc in Computer Science",
    school: "University of Oxford",
    year: "2021",
    field_of_study: "Artificial Intelligence",
    icon: "school_oxford.png",
  },
  {
    degree: "BSc in Computer Engineering",
    school: "Harvard University",
    year: "2017",
    field_of_study: "",
    icon: "school_harvard.png",
  },
];

// Helper to create default props
const createDefaultProps = (overrides = {}) => ({
  sectionName: "Education",
  education: mockEducation,
  onUpdate: vi.fn(),
  onTitleEdit: vi.fn(),
  onTitleSave: vi.fn(),
  onTitleCancel: vi.fn(),
  onDelete: vi.fn(),
  isEditingTitle: false,
  temporaryTitle: "Education",
  setTemporaryTitle: vi.fn(),
  supportsIcons: false,
  ...overrides,
});

describe("EducationSection", { timeout: 5000 }, () => {
  it("renders education entries with correct values", () => {
    const props = createDefaultProps();
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    expect(screen.getByText("Entry 1")).toBeInTheDocument();
    expect(screen.getByText("Entry 2")).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("MSc in Computer Science")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("University of Oxford")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("2021")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Artificial Intelligence")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("BSc in Computer Engineering")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Harvard University")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2017")).toBeInTheDocument();
  });

  it("calls onUpdate when an input value is changed", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    const degreeInput = screen.getByDisplayValue("MSc in Computer Science");
    fireEvent.change(degreeInput, {
      target: { value: "PhD in Computer Science" },
    });

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedEducation = onUpdateMock.mock.calls[0][0];
    expect(updatedEducation[0].degree).toBe("PhD in Computer Science");
    expect(updatedEducation[1]).toEqual(mockEducation[1]);
  });

  it("removes an education entry when the Remove button is clicked", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    // Get all delete buttons (the trash icon)
    const deleteButtons = screen.getAllByTitle("Delete this entry");
    fireEvent.click(deleteButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedEducation = onUpdateMock.mock.calls[0][0];
    expect(updatedEducation).toHaveLength(1);
    expect(updatedEducation[0].degree).toBe("BSc in Computer Engineering");
  });

  it("adds a new education entry when the Add Entry button is clicked", () => {
    const onUpdateMock = vi.fn();
    const props = createDefaultProps({ onUpdate: onUpdateMock });
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    const addButton = screen.getByText("Add Entry");
    fireEvent.click(addButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedEducation = onUpdateMock.mock.calls[0][0];
    expect(updatedEducation).toHaveLength(mockEducation.length + 1);

    const newEntry = updatedEducation[updatedEducation.length - 1];
    expect(newEntry.degree).toBe("");
    expect(newEntry.school).toBe("");
    expect(newEntry.year).toBe("");
    expect(newEntry.field_of_study).toBe("");
    expect(newEntry.icon).toBe(null);
    expect(newEntry.iconFile).toBe(null);
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
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    const iconManagerElements = screen.getAllByTestId("icon-manager");
    expect(iconManagerElements).toHaveLength(mockEducation.length);
  });

  it("renders IconManager with broken icon path as-is", () => {
    const educationWithBrokenIcon = [
      {
        degree: "MSc in Computer Science",
        school: "University of Oxford",
        year: "2021",
        field_of_study: "Artificial Intelligence",
        icon: "non-existent.png",
      },
    ];

    const mockIconRegistry = {
      registerIcon: vi.fn(),
      getIconFile: vi.fn(),
      removeIcon: vi.fn(),
    };

    const props = createDefaultProps({
      education: educationWithBrokenIcon,
      supportsIcons: true,
      iconRegistry: mockIconRegistry,
    });

    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    const iconManagerElement = screen.getByTestId("icon-manager");
    expect(iconManagerElement).toHaveAttribute("data-value", "non-existent.png");
  });

  it("calls onDeleteEntry when provided instead of deleting directly", () => {
    const onUpdateMock = vi.fn();
    const onDeleteEntryMock = vi.fn();
    const props = createDefaultProps({
      onUpdate: onUpdateMock,
      onDeleteEntry: onDeleteEntryMock,
    });
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    const deleteButtons = screen.getAllByTitle("Delete this entry");
    fireEvent.click(deleteButtons[0]);

    // Should call onDeleteEntry for confirmation, not onUpdate
    expect(onDeleteEntryMock).toHaveBeenCalledWith(0);
    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it("renders section header with correct title", () => {
    const props = createDefaultProps({ sectionName: "Academic Background" });
    render(<EducationSection {...props} />, { wrapper: DndWrapper });

    expect(screen.getByText("Academic Background")).toBeInTheDocument();
  });
});
