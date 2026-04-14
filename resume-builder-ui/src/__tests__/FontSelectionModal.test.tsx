import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FontSelectionModal from "../components/FontSelectionModal";

describe("FontSelectionModal", () => {
  let onClose: ReturnType<typeof vi.fn>;
  let onFontSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    onFontSelect = vi.fn();
  });

  const renderModal = (props = {}) =>
    render(
      <FontSelectionModal
        isOpen={true}
        onClose={onClose}
        currentFont="Arial"
        onFontSelect={onFontSelect}
        {...props}
      />
    );

  // ─── Rendering ──────────────────────────────────────────────

  describe("Rendering", () => {
    it("renders when isOpen is true", () => {
      renderModal();
      expect(screen.getByText("Choose a Font")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      renderModal({ isOpen: false });
      expect(screen.queryByText("Choose a Font")).not.toBeInTheDocument();
    });

    it("renders three category tabs", () => {
      renderModal();
      expect(screen.getByText("Professional")).toBeInTheDocument();
      expect(screen.getByText("Modern")).toBeInTheDocument();
      expect(screen.getByText("Classic")).toBeInTheDocument();
    });

    it("has dialog role and aria attributes", () => {
      renderModal();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "font-modal-title");
    });

    it("shows current font in footer", () => {
      renderModal({ currentFont: "Georgia" });
      // Footer has "Currently using:" text + font name
      expect(screen.getByText(/Currently using:/)).toBeInTheDocument();
      // Georgia appears in both card and footer — just verify at least one exists
      expect(screen.getAllByText("Georgia").length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Tab Navigation ─────────────────────────────────────────

  describe("Tab Navigation", () => {
    it("defaults to the tab containing the current font", () => {
      renderModal({ currentFont: "EB Garamond" });
      // EB Garamond is in Modern (Serif) group, should show serif fonts
      // Font names appear in cards as headings — find by role
      expect(screen.getAllByText("EB Garamond").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Crimson Pro").length).toBeGreaterThanOrEqual(1);
    });

    it("switches to Professional tab on click", async () => {
      const user = userEvent.setup();
      renderModal({ currentFont: "Arial" }); // starts on Classic

      await user.click(screen.getByText("Professional"));

      expect(screen.getByText("Source Sans 3")).toBeInTheDocument();
      expect(screen.getByText("IBM Plex Sans")).toBeInTheDocument();
    });

    it("switches to Classic tab on click", async () => {
      const user = userEvent.setup();
      renderModal({ currentFont: "Source Sans 3" }); // starts on Professional

      await user.click(screen.getByText("Classic"));

      expect(screen.getByText("Arial")).toBeInTheDocument();
      expect(screen.getByText("Times New Roman")).toBeInTheDocument();
    });
  });

  // ─── Font Selection ─────────────────────────────────────────

  describe("Font Selection", () => {
    it("calls onFontSelect and onClose when a font is clicked", async () => {
      const user = userEvent.setup();
      renderModal({ currentFont: "Arial" });

      // Find the Georgia font card button and click it
      const georgiaButton = screen.getByText("Georgia").closest("button");
      expect(georgiaButton).toBeTruthy();
      await user.click(georgiaButton!);

      expect(onFontSelect).toHaveBeenCalledWith("Georgia");
      expect(onClose).toHaveBeenCalled();
    });

    it("shows checkmark on the currently selected font", () => {
      renderModal({ currentFont: "Arial" });

      // The selected font card should have the accent border classes
      // Arial appears in card and footer — find the one in a button (the card)
      const arialElements = screen.getAllByText("Arial");
      const arialButton = arialElements
        .map((el) => el.closest("button"))
        .find((btn) => btn?.className.includes("border-accent"));
      expect(arialButton).toBeTruthy();
    });
  });

  // ─── Close Behavior ─────────────────────────────────────────

  describe("Close Behavior", () => {
    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      renderModal();

      const closeButton = screen.getByLabelText("Close font picker");
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when backdrop is clicked", async () => {
      const user = userEvent.setup();
      renderModal();

      // Click the backdrop (the outermost presentation div)
      const backdrop = screen.getByRole("presentation");
      await user.click(backdrop);

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when ESC is pressed", () => {
      renderModal();

      fireEvent.keyDown(window, { key: "Escape" });

      expect(onClose).toHaveBeenCalled();
    });
  });

  // ─── Accessibility ──────────────────────────────────────────

  describe("Accessibility", () => {
    it("shows subtitle text", () => {
      renderModal();
      expect(
        screen.getByText("Select a typeface for your resume")
      ).toBeInTheDocument();
    });

    it("renders font sample text for each visible font", () => {
      renderModal({ currentFont: "Arial" }); // Classic tab
      // Should show sample text instances
      const sampleTexts = screen.getAllByText("Professional Experience");
      expect(sampleTexts.length).toBeGreaterThan(0);
    });
  });
});
