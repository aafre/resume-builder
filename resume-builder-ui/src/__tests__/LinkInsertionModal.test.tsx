import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LinkInsertionModal } from "../components/LinkInsertionModal";

describe("LinkInsertionModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onInsert: vi.fn(),
    onRemove: vi.fn(),
    isEditMode: false,
  };

  it("renders when isOpen is true", () => {
    render(<LinkInsertionModal {...defaultProps} />);
    // Check for heading to distinguish from button
    expect(screen.getByRole("heading", { name: "Insert Link" })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<LinkInsertionModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("heading", { name: "Insert Link" })).not.toBeInTheDocument();
  });

  it("has accessible inputs (by label)", () => {
    render(<LinkInsertionModal {...defaultProps} />);
    // This expects <label for="id"> and <input id="id">
    expect(screen.getByLabelText(/Link Text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
  });

  it("has proper dialog role", () => {
    render(<LinkInsertionModal {...defaultProps} />);
    // Should have role="dialog" and aria-modal="true"
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "link-modal-title");
  });
});
