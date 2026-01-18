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

    // Verify that each section option is rendered with new titles.
    expect(screen.getByText("Text Block")).toBeInTheDocument();
    expect(screen.getByText("Bulleted List")).toBeInTheDocument();
    expect(screen.getByText("Inline List")).toBeInTheDocument();
    expect(screen.getByText("Smart Table")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Certifications")).toBeInTheDocument();
  });

  it("renders SVG wireframes for each section type", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Each card should have an SVG visual (7 section types)
    const svgElements = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgElements.length).toBe(7);
  });

  it("calls onSelect with the correct type and position when a section card is clicked", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Click the "Text Block" card.
    const textSectionCard = screen.getByText("Text Block");
    fireEvent.click(textSectionCard);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    // Default position is 'top'
    expect(onSelectMock).toHaveBeenCalledWith("text", "top");

    // Click the "Bulleted List" card.
    fireEvent.click(screen.getByText("Bulleted List"));
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

  it("renders cards as buttons for accessibility", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // All section cards should be buttons
    const sectionButtons = screen.getAllByRole("button");
    // 7 section cards + 1 cancel button = 8 buttons
    expect(sectionButtons.length).toBe(8);
  });

  it("displays 'Certifications' instead of 'Bullet List with Icons'", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Should show "Certifications"
    expect(screen.getByText("Certifications")).toBeInTheDocument();
    // Should NOT show old name
    expect(screen.queryByText("Bullet List with Icons")).not.toBeInTheDocument();
  });

  it("hides Certifications when supportsIcons is false", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(
      <SectionTypeModal
        onClose={onCloseMock}
        onSelect={onSelectMock}
        supportsIcons={false}
      />
    );

    // Should NOT show "Certifications" when icons not supported
    expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
    // Should have 6 section cards + 1 cancel button = 7 buttons
    const sectionButtons = screen.getAllByRole("button");
    expect(sectionButtons.length).toBe(7);
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
      fireEvent.click(screen.getByText("Text Block"));

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
      fireEvent.click(screen.getByText("Text Block"));

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

  describe("grid layout", () => {
    it("renders section cards in a grid container", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Find the grid container
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
    });
  });
});
