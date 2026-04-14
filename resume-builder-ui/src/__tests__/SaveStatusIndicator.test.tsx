import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SaveStatusIndicator } from "../components/SaveStatusIndicator";

describe("SaveStatusIndicator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Saved state", () => {
    it("renders 'Saved just now' when saved recently", () => {
      render(<SaveStatusIndicator status="saved" lastSaved={new Date()} />);
      expect(screen.getByText(/Saved just now/)).toBeInTheDocument();
    });

    it("renders saved text with time ago", () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      render(<SaveStatusIndicator status="saved" lastSaved={fiveMinAgo} />);
      expect(screen.getByText(/Saved 5m ago/)).toBeInTheDocument();
    });

    it("renders 'Saved' when no lastSaved date", () => {
      render(<SaveStatusIndicator status="saved" lastSaved={null} />);
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("has green checkmark SVG", () => {
      const { container } = render(
        <SaveStatusIndicator status="saved" lastSaved={new Date()} />
      );
      const svg = container.querySelector("svg");
      expect(svg?.classList.contains("text-green-500")).toBe(true);
    });
  });

  describe("Saving state", () => {
    it("renders 'Saving...' text", () => {
      render(<SaveStatusIndicator status="saving" lastSaved={null} />);
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    it("has spinning animation", () => {
      const { container } = render(
        <SaveStatusIndicator status="saving" lastSaved={null} />
      );
      const svg = container.querySelector("svg");
      expect(svg?.classList.contains("animate-spin")).toBe(true);
    });
  });

  describe("Error state", () => {
    it("renders 'Save failed' text", () => {
      render(<SaveStatusIndicator status="error" lastSaved={null} />);
      expect(screen.getByText("Save failed")).toBeInTheDocument();
    });

    it("has pulse animation on error icon", () => {
      const { container } = render(
        <SaveStatusIndicator status="error" lastSaved={null} />
      );
      const svg = container.querySelector("svg");
      expect(svg?.classList.contains("animate-pulse")).toBe(true);
    });

    it("has bold font styling for error", () => {
      const { container } = render(
        <SaveStatusIndicator status="error" lastSaved={null} />
      );
      const wrapper = container.firstElementChild;
      expect(wrapper?.className).toContain("font-medium");
    });
  });

  describe("Flash animation on save complete", () => {
    it("shows green flash background when transitioning saving -> saved", () => {
      const { container, rerender } = render(
        <SaveStatusIndicator status="saving" lastSaved={null} />
      );

      // Transition to saved
      rerender(<SaveStatusIndicator status="saved" lastSaved={new Date()} />);

      const wrapper = container.firstElementChild;
      expect(wrapper?.className).toContain("bg-green-50");
    });

    it("removes flash after timeout", () => {
      const { container, rerender } = render(
        <SaveStatusIndicator status="saving" lastSaved={null} />
      );

      rerender(<SaveStatusIndicator status="saved" lastSaved={new Date()} />);

      // Advance past the 1200ms timeout
      act(() => {
        vi.advanceTimersByTime(1300);
      });

      const wrapper = container.firstElementChild;
      expect(wrapper?.className).not.toContain("bg-green-50");
    });

    it("does not flash when status is already saved on mount", () => {
      const { container } = render(
        <SaveStatusIndicator status="saved" lastSaved={new Date()} />
      );

      const wrapper = container.firstElementChild;
      expect(wrapper?.className).not.toContain("bg-green-50");
    });
  });
});
