import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import SectionControls from "../components/SectionControls";
import { describe, expect, it, vi } from "vitest";
import { Section, TextSection } from "../types";

describe("SectionControls", () => {
  const mockSetSections = vi.fn();
  const sections: Section[] = [
    { name: "Section 1", type: "text", content: "" } as TextSection,
    { name: "Section 2", type: "text", content: "" } as TextSection,
    { name: "Section 3", type: "text", content: "" } as TextSection,
  ];

  it("renders with accessible buttons", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByLabelText("Move section up")).toBeInTheDocument();
    expect(screen.getByLabelText("Move section down")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete section")).toBeInTheDocument();
  });

  it("calls moveSection (up) when up button is clicked", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText("Move section up"));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it("calls moveSection (down) when down button is clicked", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText("Move section down"));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it("calls deleteSection when delete button is clicked", () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText("Delete section"));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it("disables up button when at first index", () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    const upButton = screen.getByLabelText("Move section up");
    expect(upButton).toBeDisabled();
  });

  it("disables down button when at last index", () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    const downButton = screen.getByLabelText("Move section down");
    expect(downButton).toBeDisabled();
  });
});
