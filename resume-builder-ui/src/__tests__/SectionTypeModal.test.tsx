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

  it("calls onSelect with the correct type when a section card is clicked", () => {
    const onCloseMock = vi.fn();
    const onSelectMock = vi.fn();

    render(<SectionTypeModal onClose={onCloseMock} onSelect={onSelectMock} />);

    // Click the "Text Section" card.
    const textSectionCard = screen.getByText("Text Section");
    fireEvent.click(textSectionCard);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith("text");

    // Click the "Bulleted List" card.
    fireEvent.click(screen.getByText("List with Bullets"));
    expect(onSelectMock).toHaveBeenCalledWith("bulleted-list");
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
});
