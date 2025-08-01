import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationSection from "../components/EducationSection";

// --- Mock the IconUpload Component ---
// We include the existingIcon prop as a data attribute to test its value.
vi.mock("../components/IconUpload", () => {
  return {
    default: (props: { existingIcon: string; onUpload: any; onClear: any }) => {
      return (
        <div data-testid="icon-upload" data-existing-icon={props.existingIcon}>
          IconUpload
        </div>
      );
    },
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

describe("EducationSection", { timeout: 5000 }, () => {
  it("renders education entries with correct values", () => {
    const onUpdateMock = vi.fn();
    render(
      <EducationSection
        education={mockEducation}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

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
    render(
      <EducationSection
        education={mockEducation}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

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
    render(
      <EducationSection
        education={mockEducation}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedEducation = onUpdateMock.mock.calls[0][0];
    expect(updatedEducation).toHaveLength(1);
    expect(updatedEducation[0].degree).toBe("BSc in Computer Engineering");
  });

  it("adds a new education entry when the Add Entry button is clicked", () => {
    const onUpdateMock = vi.fn();
    render(
      <EducationSection
        education={mockEducation}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

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
    expect(newEntry.icon).toBe("");
    expect(newEntry.iconFile).toBeUndefined();
  });

  it("renders the IconUpload component when supportsIcons is true", () => {
    const onUpdateMock = vi.fn();
    render(
      <EducationSection
        education={mockEducation}
        onUpdate={onUpdateMock}
        supportsIcons={true}
      />
    );

    const iconUploadElements = screen.getAllByTestId("icon-upload");
    expect(iconUploadElements).toHaveLength(mockEducation.length);
  });

  it("renders IconUpload with broken icon path as-is", () => {
    const onUpdateMock = vi.fn();
    // Simulate an education item with a broken icon path.
    const educationWithBrokenIcon = [
      {
        degree: "MSc in Computer Science",
        school: "University of Oxford",
        year: "2021",
        field_of_study: "Artificial Intelligence",
        icon: "non-existent.png", // This is the broken icon path.
      },
    ];

    render(
      <EducationSection
        education={educationWithBrokenIcon}
        onUpdate={onUpdateMock}
        supportsIcons={true}
      />
    );

    // The current behavior is that the component passes the icon path as-is to IconUpload
    // IconUpload will handle the broken image display
    const iconUploadElement = screen.getByTestId("icon-upload");
    expect(iconUploadElement).toHaveAttribute("data-existing-icon", "non-existent.png");
  });
});
