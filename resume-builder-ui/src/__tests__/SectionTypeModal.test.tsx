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

    const { container } = render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Each card should have an SVG visual (7 section types)
    const svgElements = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgElements.length).toBe(7);
  });

  it("calls onSelect with the correct type and position when a section card is selected and Add button clicked", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Click the "Text Block" card to select it
    const textSectionCard = screen.getByText("Text Block");
    fireEvent.click(textSectionCard);

    // onSelect should NOT be called yet (two-step flow)
    expect(onSelectMock).not.toHaveBeenCalled();

    // Click "Add Section" button to confirm
    fireEvent.click(screen.getByText("Add Section"));

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    // Default position is 'bottom'
    expect(onSelectMock).toHaveBeenCalledWith("text", "bottom");
  });

  it("allows changing selection before confirming", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Select Text Block first
    fireEvent.click(screen.getByText("Text Block"));

    // Change to Bulleted List
    fireEvent.click(screen.getByText("Bulleted List"));

    // Confirm
    fireEvent.click(screen.getByText("Add Section"));

    // Should call with the last selected type
    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith("bulleted-list", "bottom");
  });

  it("disables Add Section button when no type is selected", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Add Section button should be disabled initially
    const addButton = screen.getByText("Add Section");
    expect(addButton).toBeDisabled();

    // Select a type
    fireEvent.click(screen.getByText("Text Block"));

    // Now it should be enabled
    expect(addButton).not.toBeDisabled();
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
    // 7 section cards + 1 cancel button + 1 add section button + 2 position toggle buttons = 11 buttons
    const sectionButtons = screen.getAllByRole("button");
    expect(sectionButtons.length).toBe(11);
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
    // Should have 6 section cards + 1 cancel button + 1 add section button + 2 position buttons = 10 buttons
    const sectionButtons = screen.getAllByRole("button");
    expect(sectionButtons.length).toBe(10);
  });

  describe("position selection - segmented control", () => {
    it("renders segmented control with Top and Bottom options", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Find the position control label
      expect(screen.getByText("Where should it go?")).toBeInTheDocument();

      // Find the toggle buttons
      expect(screen.getByText("Top of Resume")).toBeInTheDocument();
      expect(screen.getByText("Bottom of Resume")).toBeInTheDocument();
    });

    it("defaults to 'bottom' position", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Select a section type without changing position
      fireEvent.click(screen.getByText("Text Block"));
      // Confirm by clicking Add Section
      fireEvent.click(screen.getByText("Add Section"));

      expect(onSelectMock).toHaveBeenCalledWith("text", "bottom");
    });

    it("calls onSelect with 'top' position when Top button is clicked", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Click the Top button
      fireEvent.click(screen.getByText("Top of Resume"));

      // Select a section type
      fireEvent.click(screen.getByText("Text Block"));
      // Confirm by clicking Add Section
      fireEvent.click(screen.getByText("Add Section"));

      expect(onSelectMock).toHaveBeenCalledWith("text", "top");
    });

    it("shows 'After specific section' toggle when sections exist", () => {
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

      // Should show the expand link
      expect(screen.getByText("+ Insert after a specific section")).toBeInTheDocument();
    });

    it("does not show 'After specific section' toggle when no sections exist", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      render(
        <SectionTypeModal
          onClose={onCloseMock}
          onSelect={onSelectMock}
          sections={[]}
        />
      );

      // Should NOT show the expand link
      expect(screen.queryByText("+ Insert after a specific section")).not.toBeInTheDocument();
    });

    it("displays section pills when 'After specific section' is expanded", () => {
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

      // Click to expand
      fireEvent.click(screen.getByText("+ Insert after a specific section"));

      // Check that section pills appear
      expect(screen.getByText("After: Experience")).toBeInTheDocument();
      expect(screen.getByText("After: Education")).toBeInTheDocument();
      expect(screen.getByText("After: Skills")).toBeInTheDocument();
    });

    it("calls onSelect with numeric position when section pill is clicked", () => {
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

      // Expand the section options
      fireEvent.click(screen.getByText("+ Insert after a specific section"));

      // Click "After: Experience" (index 1)
      fireEvent.click(screen.getByText("After: Experience"));

      // Select a section type
      fireEvent.click(screen.getByText("Text Block"));
      // Confirm by clicking Add Section
      fireEvent.click(screen.getByText("Add Section"));

      // Should be called with position = 1 (after first section)
      expect(onSelectMock).toHaveBeenCalledWith("text", 1);
    });

    it("collapses section options when hide is clicked", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();
      const sections = [
        { name: "Experience", type: "experience" },
      ];

      render(
        <SectionTypeModal
          onClose={onCloseMock}
          onSelect={onSelectMock}
          sections={sections}
        />
      );

      // Expand
      fireEvent.click(screen.getByText("+ Insert after a specific section"));
      expect(screen.getByText("After: Experience")).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByText("− Hide options"));
      expect(screen.queryByText("After: Experience")).not.toBeInTheDocument();
    });
  });

  describe("grid layout", () => {
    it("renders section cards in a grid container", () => {
      const onCloseMock = vi.fn();
      const onSelectMock = vi.fn();

      const { container } = render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

      // Find the grid container
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
    });
  });
});
