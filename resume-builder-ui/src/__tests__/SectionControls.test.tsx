import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SectionControls from "../components/SectionControls";

// Mock ResponsiveConfirmDialog since it's used in the component
vi.mock("../components/ResponsiveConfirmDialog", () => ({
  default: ({ isOpen, onConfirm, onClose, title, message }: any) => {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-label={title}>
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    );
  },
}));

describe("SectionControls", () => {
  const mockSetSections = vi.fn();
  const mockSections = [
    { id: 1, name: "Section 1" },
    { id: 2, name: "Section 2" },
    { id: 3, name: "Section 3" },
  ];

  beforeEach(() => {
    mockSetSections.mockClear();
  });

  it("renders move up, move down, and delete buttons", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByRole("button", { name: /move section up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /move section down/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete section/i })).toBeInTheDocument();
  });

  it("disables move up button when at the top", () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByRole("button", { name: /move section up/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /move section down/i })).not.toBeDisabled();
  });

  it("disables move down button when at the bottom", () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByRole("button", { name: /move section down/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /move section up/i })).not.toBeDisabled();
  });

  it("calls setSections when moving up", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /move section up/i }));

    // Expect setSections to be called with reordered array
    // Original: [1, 2, 3]. Move index 1 (2) up -> [2, 1, 3]
    const expectedSections = [mockSections[1], mockSections[0], mockSections[2]];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });

  it("calls setSections when moving down", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /move section down/i }));

    // Original: [1, 2, 3]. Move index 1 (2) down -> [1, 3, 2]
    const expectedSections = [mockSections[0], mockSections[2], mockSections[1]];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });

  it("opens confirmation dialog when delete is clicked", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete section/i }));

    // Check if dialog is open
    expect(screen.getByRole("dialog", { name: /delete section/i })).toBeInTheDocument();
  });

  it("deletes section when confirmed", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    // Open dialog
    fireEvent.click(screen.getByRole("button", { name: /delete section/i }));

    // Confirm
    fireEvent.click(screen.getByText("Confirm"));

    // Expect setSections to be called with section removed
    // Original: [1, 2, 3]. Remove index 1 (2) -> [1, 3]
    const expectedSections = [mockSections[0], mockSections[2]];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });

  it("does not delete section when cancelled", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    // Open dialog
    fireEvent.click(screen.getByRole("button", { name: /delete section/i }));

    // Cancel
    fireEvent.click(screen.getByText("Cancel"));

    expect(mockSetSections).not.toHaveBeenCalled();
    // Dialog should be closed (or unmounted)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
