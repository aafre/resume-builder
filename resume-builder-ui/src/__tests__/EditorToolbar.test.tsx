import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditorToolbar from "../components/EditorToolbar";

describe("EditorToolbar", () => {
  const defaultProps = {
    onAddSection: vi.fn(),
    onGenerateResume: vi.fn(),
    onExportYAML: vi.fn(),
    onImportYAML: vi.fn(),
    onToggleHelp: vi.fn(),
    onLoadEmptyTemplate: vi.fn(),
    loadingAddSection: false,
    generating: false,
    loadingSave: false,
    loadingLoad: false,
    showAdvancedMenu: false,
    setShowAdvancedMenu: vi.fn(),
    mode: "floating" as const,
  };

  it("should have accessible buttons with aria-labels", () => {
    render(<EditorToolbar {...defaultProps} />);

    // These should fail initially as aria-labels are missing
    expect(screen.getByLabelText("Add New Section")).toBeInTheDocument();
    expect(screen.getByLabelText("Download My Resume")).toBeInTheDocument();
    expect(screen.getByLabelText("More options")).toBeInTheDocument();
  });

  it("should have accessible menu items when menu is open", () => {
    render(<EditorToolbar {...defaultProps} showAdvancedMenu={true} />);

    // These should fail initially as aria-labels are missing
    expect(screen.getByLabelText("Save My Work")).toBeInTheDocument();
    expect(screen.getByLabelText("Load Previous Work")).toBeInTheDocument();
    expect(screen.getByLabelText("Help & Tips")).toBeInTheDocument();
    expect(screen.getByLabelText("Clear Template")).toBeInTheDocument();
  });
});
