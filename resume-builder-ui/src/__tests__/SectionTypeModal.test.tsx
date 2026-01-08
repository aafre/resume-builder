// src/__tests__/SectionTypeModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SectionTypeModal from "../components/SectionTypeModal";

describe("SectionTypeModal", () => {
  it("renders the modal with the correct header and section options", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Verify the header is rendered.
    expect(screen.getByText("Select Section Type")).toBeInTheDocument();

    // Verify that each section option is rendered.
    expect(screen.getByText("Text Section")).toBeInTheDocument();
    expect(screen.getByText("List with Bullets")).toBeInTheDocument();
    expect(screen.getByText("Horizontal List")).toBeInTheDocument();
    expect(screen.getByText("Smart Table")).toBeInTheDocument();

    // For the "Text Section" card, check the "Use for:" text.
    const textSectionCard = screen.getByText("Text Section").closest("div");
    expect(textSectionCard).toBeTruthy();

    // Within this card, locate the paragraph with the "Use for:" text.
    const useForParagraph = textSectionCard?.querySelector(
      "p.text-gray-500.italic"
    );
    expect(useForParagraph).toBeTruthy();

    // Normalize the text content (collapse multiple spaces and trim).
    const normalizedText = (useForParagraph?.textContent ?? "")
      .replace(/\s+/g, " ")
      .trim();
    // Assert that the normalized text contains the expected use-for description.
    expect(normalizedText).toContain(
      "Summary, Objective, About Me, Career Goal, Personal Statement"
    );
  });

  it("calls onSelect with the correct type and position when a section card is clicked", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Click the "Text Section" card.
    const textSectionCard = screen.getByText("Text Section");
    fireEvent.click(textSectionCard);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    // Default position is 'top'
    expect(onSelectMock).toHaveBeenCalledWith("text", "top");

    // Click the "Bulleted List" card.
    fireEvent.click(screen.getByText("List with Bullets"));
    expect(onSelectMock).toHaveBeenCalledWith("bulleted-list", "top");
  });

  it("calls onClose when the Cancel button is clicked", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Click the Cancel button.
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  describe("position selection", () => {
    it("renders position selector with default 'top' selected", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Find the position selector
      const positionLabel = screen.getByText("Insert Position");
      expect(positionLabel).toBeInTheDocument();

      // Find the select element
      const selectElement = screen.getByRole("combobox");
      expect(selectElement).toBeInTheDocument();
      expect(selectElement).toHaveValue("top");
    });

    it("shows 'bottom' option in position selector", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      const selectElement = screen.getByRole("combobox");
      const bottomOption = screen.getByText("At the bottom (last section)");
      expect(bottomOption).toBeInTheDocument();
    });

    it("calls onSelect with 'bottom' position when selected", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Change position to bottom
      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "bottom" } });

      // Click a section type
      fireEvent.click(screen.getByText("Text Section"));

      expect(onSelectMock).toHaveBeenCalledWith("text", "bottom");
    });

    it("displays existing sections in 'After specific section' optgroup", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();
      const sections = [
        { name: "Experience", type: "experience" },
        { name: "Education", type: "education" },
        { name: "Skills", type: "bulleted-list" },
      ];

      render(
        <SectionTypeModal
          onClose={onCloseMock}
          onSelect={onSelectMock}
          sections={sections}
        />
      );

      // Check that section names appear in the dropdown
      expect(screen.getByText("After: Experience")).toBeInTheDocument();
      expect(screen.getByText("After: Education")).toBeInTheDocument();
      expect(screen.getByText("After: Skills")).toBeInTheDocument();
    });

    it("calls onSelect with numeric position for 'after section' selection", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();
      const sections = [
        { name: "Experience", type: "experience" },
        { name: "Education", type: "education" },
      ];

      render(
        <SectionTypeModal
          onClose={onCloseMock}
          onSelect={onSelectMock}
          sections={sections}
        />
      );

      // Select "After: Experience" (index 1)
      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "1" } });

      // Click a section type
      fireEvent.click(screen.getByText("Text Section"));

      // Should be called with position = 1 (after first section)
      expect(onSelectMock).toHaveBeenCalledWith("text", 1);
    });

    it("does not show 'After specific section' when no sections exist", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(
        <SectionTypeModal
          onClose={onCloseMock}
          onSelect={onSelectMock}
          sections={[]}
        />
      );

      // Should only have top and bottom options
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(screen.getByText("At the top (first section)")).toBeInTheDocument();
      expect(screen.getByText("At the bottom (last section)")).toBeInTheDocument();
    });
  });
});
