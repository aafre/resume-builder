import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExperienceSection from "../components/ExperienceSection";

// --- Mock the IconUpload Component ---
// This dummy component renders a div with a data attribute for the existing icon.
vi.mock("../components/IconUpload", () => {
  return {
    default: (props: { existingIcon: string; onUpload: any; onClear: any }) => (
      <div data-testid="icon-upload" data-existing-icon={props.existingIcon}>
        IconUpload
      </div>
    ),
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

describe("ExperienceSection", { timeout: 5000 }, () => {
  // Helper to deep clone the base mock data.
  const getMockExperiences = () =>
    JSON.parse(JSON.stringify(baseMockExperiences));

  it("renders experience entries with correct values", () => {
    const onUpdateMock = vi.fn();
    render(
      <ExperienceSection
        experiences={getMockExperiences()}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

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
    render(
      <ExperienceSection
        experiences={getMockExperiences()}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    // Change the company name for the first experience.
    const companyInput = screen.getByDisplayValue("Lorem Ipsum Corp");
    fireEvent.change(companyInput, { target: { value: "New Company Name" } });

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences[0].company).toBe("New Company Name");
    // Ensure the second experience remains unchanged.
    expect(updatedExperiences[1]).toEqual(getMockExperiences()[1]);
  });

  it("removes an experience entry when the Remove button is clicked", () => {
    const onUpdateMock = vi.fn();
    render(
      <ExperienceSection
        experiences={getMockExperiences()}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    // Click the Remove button for the first experience.
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences).toHaveLength(getMockExperiences().length - 1);
    expect(updatedExperiences[0].company).toBe("Dolor Sit Solutions");
  });

  it("adds a new experience entry when the Add Experience button is clicked", () => {
    const onUpdateMock = vi.fn();
    render(
      <ExperienceSection
        experiences={getMockExperiences()}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    const addButton = screen.getByText("Add Experience");
    fireEvent.click(addButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    expect(updatedExperiences).toHaveLength(getMockExperiences().length + 1);

    // Verify the new entry has empty/default values.
    const newExperience = updatedExperiences[updatedExperiences.length - 1];
    expect(newExperience.company).toBe("");
    expect(newExperience.title).toBe("");
    expect(newExperience.dates).toBe("");
    expect(newExperience.description).toEqual([]);
  });

  it("adds a new description line when the Add Description button is clicked", () => {
    const onUpdateMock = vi.fn();
    // Get a fresh copy and record the initial description length.
    const experiences = getMockExperiences();
    const initialLength = experiences[0].description.length;
    render(
      <ExperienceSection
        experiences={experiences}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    // For the first experience, click the Add Description button.
    const addDescButton = screen.getAllByText("Add Description")[0];
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
    // Get a fresh copy and record the initial description length.
    const experiences = getMockExperiences();
    const initialLength = experiences[0].description.length;
    render(
      <ExperienceSection
        experiences={experiences}
        onUpdate={onUpdateMock}
        supportsIcons={false}
      />
    );

    // For the first experience, click the delete button for the first description.
    const deleteButtons = screen.getAllByText("🗑️");
    fireEvent.click(deleteButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedExperiences = onUpdateMock.mock.calls[0][0];
    // Expect the new length to be the original length minus one.
    expect(updatedExperiences[0].description).toHaveLength(initialLength - 1);
  });

  it("renders the IconUpload component when supportsIcons is true", () => {
    const onUpdateMock = vi.fn();
    render(
      <ExperienceSection
        experiences={getMockExperiences()}
        onUpdate={onUpdateMock}
        supportsIcons={true}
      />
    );

    // Check that IconUpload is rendered for each experience entry.
    const iconUploadElements = screen.getAllByTestId("icon-upload");
    expect(iconUploadElements).toHaveLength(getMockExperiences().length);
    // Verify that the first experience's icon is passed correctly.
    expect(iconUploadElements[0]).toHaveAttribute(
      "data-existing-icon",
      "company_google.png"
    );
  });
});
