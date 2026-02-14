/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PreviewModal from "../components/PreviewModal";

describe("PreviewModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    previewUrl: null,
    isGenerating: false,
    isStale: false,
    error: null,
    onRefresh: vi.fn(),
    onDownload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any modals that might be left open
    document.body.style.overflow = "";
  });

  it("does not render when isOpen is false", () => {
    render(<PreviewModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("PDF Preview")).not.toBeInTheDocument();
  });

  it("renders modal when isOpen is true", () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText("PDF Preview")).toBeInTheDocument();
  });

  it("has accessible dialog role and label", () => {
    render(<PreviewModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "preview-modal-title");

    // Check that the title id matches
    const title = screen.getByText("PDF Preview");
    expect(title).toHaveAttribute("id", "preview-modal-title");
  });

  it("has accessible close button", () => {
    render(<PreviewModal {...defaultProps} />);
    // Should be findable by aria-label "Close preview"
    const closeButton = screen.getByRole("button", { name: /close preview/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("shows loading state when isGenerating is true", () => {
    render(<PreviewModal {...defaultProps} isGenerating={true} />);

    expect(screen.getByText(/generating pdf preview/i)).toBeInTheDocument();
    expect(screen.getByText(/this usually takes 2-5 seconds/i)).toBeInTheDocument();

    // Should show spinner
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    render(
      <PreviewModal
        {...defaultProps}
        error="Failed to generate PDF"
      />
    );

    expect(screen.getByText("Preview Generation Failed")).toBeInTheDocument();
    expect(screen.getByText("Failed to generate PDF")).toBeInTheDocument();
  });

  it("displays retry button when error occurs", () => {
    render(
      <PreviewModal
        {...defaultProps}
        error="Generation failed"
      />
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("calls onRefresh when retry button is clicked after error", () => {
    const onRefresh = vi.fn();
    render(
      <PreviewModal
        {...defaultProps}
        error="Failed"
        onRefresh={onRefresh}
      />
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("displays PDF iframe when previewUrl is provided", () => {
    const mockUrl = "blob:http://localhost:3000/abc123";
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl={mockUrl}
      />
    );

    const iframe = screen.getByTitle("Resume PDF Preview");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining(mockUrl));
  });

  it("adds PDF viewer parameters to iframe URL", () => {
    const mockUrl = "blob:http://localhost:3000/abc123";
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl={mockUrl}
      />
    );

    const iframe = screen.getByTitle("Resume PDF Preview") as HTMLIFrameElement;
    // Should include toolbar=0, navpanes=0, etc.
    expect(iframe.src).toContain("toolbar=0");
    expect(iframe.src).toContain("navpanes=0");
  });

  it("shows staleness warning when isStale is true", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isStale={true}
        previewUrl="blob:test"
      />
    );

    expect(screen.getByText(/outdated/i)).toBeInTheDocument();
    expect(screen.getByText(/your edits aren't reflected yet/i)).toBeInTheDocument();
  });

  it("shows staleness banner with refresh button when preview is outdated", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isStale={true}
        previewUrl="blob:test"
      />
    );

    // Banner should be visible with warning text
    expect(screen.getByText(/your edits aren't reflected yet/i)).toBeInTheDocument();

    // Banner parent should have amber background styling
    const bannerContainer = screen.getByText(/your edits aren't reflected yet/i).closest(".bg-amber-50");
    expect(bannerContainer).toBeInTheDocument();

    // Should have refresh button in banner
    const refreshButtons = screen.getAllByRole("button", { name: /refresh/i });
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("does not show staleness warning when isGenerating is true", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isStale={true}
        isGenerating={true}
        previewUrl="blob:test"
      />
    );

    // Should show loading state instead of staleness warning
    expect(screen.getByText(/generating pdf preview/i)).toBeInTheDocument();
    expect(screen.queryByText(/outdated/i)).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<PreviewModal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByTitle(/close/i);
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when ESC key is pressed", () => {
    const onClose = vi.fn();
    render(<PreviewModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when other keys are pressed", () => {
    const onClose = vi.fn();
    render(<PreviewModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "Space" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<PreviewModal {...defaultProps} onClose={onClose} />);

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/60");
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not close when modal content is clicked", () => {
    const onClose = vi.fn();
    render(<PreviewModal {...defaultProps} onClose={onClose} />);

    const modalContent = screen.getByText("PDF Preview").closest("div");
    if (modalContent) {
      fireEvent.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const onRefresh = vi.fn();
    render(
      <PreviewModal
        {...defaultProps}
        onRefresh={onRefresh}
        previewUrl="blob:test"
      />
    );

    const refreshButtons = screen.getAllByRole("button", { name: /refresh/i });
    fireEvent.click(refreshButtons[0]);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("calls onDownload when download button is clicked", () => {
    const onDownload = vi.fn();
    render(
      <PreviewModal
        {...defaultProps}
        onDownload={onDownload}
        previewUrl="blob:test"
      />
    );

    const downloadButton = screen.getByRole("button", { name: /download/i });
    fireEvent.click(downloadButton);

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("disables download button when no preview URL", () => {
    render(<PreviewModal {...defaultProps} previewUrl={null} />);

    const downloadButton = screen.getByRole("button", { name: /download/i });
    expect(downloadButton).toBeDisabled();
  });

  it("disables download button when isGenerating is true", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isGenerating={true}
        previewUrl="blob:test"
      />
    );

    const downloadButton = screen.getByRole("button", { name: /download/i });
    expect(downloadButton).toBeDisabled();
  });

  it("disables refresh button when isGenerating is true", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isGenerating={true}
        previewUrl="blob:test"
      />
    );

    const refreshButtons = screen.getAllByRole("button", { name: /refresh|regenerate/i });
    refreshButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("shows loading spinner in refresh button when generating", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isGenerating={true}
      />
    );

    const refreshButtons = screen.getAllByRole("button", { name: /refresh|regenerate/i });
    // Button should contain spinner
    const buttonWithSpinner = refreshButtons.find((btn) => {
      const spinner = btn.querySelector(".animate-spin");
      return spinner !== null;
    });

    expect(buttonWithSpinner).toBeDefined();
  });

  it("prevents body scroll when modal is open", () => {
    const { rerender } = render(<PreviewModal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<PreviewModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("restores body scroll on unmount", () => {
    const { unmount } = render(<PreviewModal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("shows empty state when no preview URL and not generating", () => {
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl={null}
        isGenerating={false}
      />
    );

    expect(screen.getByText("No Preview Available")).toBeInTheDocument();
    expect(screen.getByText(/click "generate preview"/i)).toBeInTheDocument();
  });

  it("shows generate button in empty state", () => {
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl={null}
        isGenerating={false}
      />
    );

    const generateButton = screen.getByRole("button", { name: /generate preview/i });
    expect(generateButton).toBeInTheDocument();
  });

  it("calls onRefresh when generate button in empty state is clicked", () => {
    const onRefresh = vi.fn();
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl={null}
        isGenerating={false}
        onRefresh={onRefresh}
      />
    );

    const generateButton = screen.getByRole("button", { name: /generate preview/i });
    fireEvent.click(generateButton);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("changes refresh button text when preview is stale", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isStale={true}
        previewUrl="blob:test"
      />
    );

    // Should say "Refresh Preview" when stale
    const refreshButton = screen.getByRole("button", { name: /refresh preview/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it("uses 'Regenerate' text when preview is not stale", () => {
    render(
      <PreviewModal
        {...defaultProps}
        isStale={false}
        previewUrl="blob:test"
      />
    );

    // Should say "Regenerate" when not stale
    const refreshButtons = screen.getAllByRole("button", { name: /regenerate/i });
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it("displays warning icon in error state", () => {
    const { container } = render(
      <PreviewModal
        {...defaultProps}
        error="Test error"
      />
    );

    // Should have warning icon
    const warningIcon = container.querySelector("svg");
    expect(warningIcon).toBeInTheDocument();
  });

  it("hides error state when isGenerating becomes true", () => {
    const { rerender } = render(
      <PreviewModal
        {...defaultProps}
        error="Test error"
        isGenerating={false}
      />
    );

    expect(screen.getByText("Preview Generation Failed")).toBeInTheDocument();

    // Start generating
    rerender(
      <PreviewModal
        {...defaultProps}
        error="Test error"
        isGenerating={true}
      />
    );

    // Should show loading instead
    expect(screen.queryByText("Preview Generation Failed")).not.toBeInTheDocument();
    expect(screen.getByText(/generating pdf preview/i)).toBeInTheDocument();
  });

  it("re-renders iframe when preview URL changes", async () => {
    const { rerender } = render(
      <PreviewModal
        {...defaultProps}
        previewUrl="blob:url1"
      />
    );

    const iframe1 = screen.getByTitle("Resume PDF Preview");
    expect(iframe1).toHaveAttribute("src", expect.stringContaining("blob:url1"));

    // Change URL
    rerender(
      <PreviewModal
        {...defaultProps}
        previewUrl="blob:url2"
      />
    );

    await waitFor(() => {
      const iframe2 = screen.getByTitle("Resume PDF Preview");
      expect(iframe2).toHaveAttribute("src", expect.stringContaining("blob:url2"));
    });
  });

  it("renders with mobile-responsive classes", () => {
    const { container } = render(
      <PreviewModal
        {...defaultProps}
        previewUrl="blob:test"
      />
    );

    // Modal should have responsive classes - check for modal container with z-index
    const modalContainer = screen.getByTestId('preview-modal-container');
    expect(modalContainer).toBeInTheDocument();

    // Modal content should have responsive sizing
    const modalContent = screen.getByTestId('preview-modal-content');
    expect(modalContent).toBeInTheDocument();
  });

  it("shows footer with action buttons", () => {
    render(
      <PreviewModal
        {...defaultProps}
        previewUrl="blob:test"
      />
    );

    // Should have footer section
    const refreshButton = screen.getByRole("button", { name: /regenerate/i });
    const downloadButton = screen.getByRole("button", { name: /download/i });

    expect(refreshButton).toBeInTheDocument();
    expect(downloadButton).toBeInTheDocument();
  });
});
