/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResumeCard } from "../components/ResumeCard";
import { ResumeListItem } from "../types";

const mockResume: ResumeListItem = {
  id: "test-id-123",
  title: "My Test Resume",
  template_id: "modern-with-icons",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  pdf_generated_at: new Date().toISOString(),
  thumbnail_url: "http://example.com/thumbnail.png",
};

describe("ResumeCard", () => {
  const defaultProps = {
    resume: mockResume,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onDownload: vi.fn(),
    onPreview: vi.fn(),
    onDuplicate: vi.fn(),
    onRename: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("renders resume title", () => {
      render(<ResumeCard {...defaultProps} />);
      expect(screen.getByText("My Test Resume")).toBeInTheDocument();
    });

    it("renders Edit Resume button", () => {
      render(<ResumeCard {...defaultProps} />);
      expect(screen.getByText("Edit Resume")).toBeInTheDocument();
    });

    it("renders template name", () => {
      render(<ResumeCard {...defaultProps} />);
      expect(screen.getByText("Modern With Icons")).toBeInTheDocument();
    });

    it("renders thumbnail image", () => {
      render(<ResumeCard {...defaultProps} />);
      const img = screen.getByAltText("My Test Resume");
      expect(img).toBeInTheDocument();
    });
  });

  describe("Edit Resume button interactions", () => {
    it("calls onEdit when clicked", () => {
      render(<ResumeCard {...defaultProps} />);

      const editButton = screen.getByText("Edit Resume");
      fireEvent.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith("test-id-123");
    });

    it("calls onEdit for each click when not loading", () => {
      render(<ResumeCard {...defaultProps} />);

      const editButton = screen.getByText("Edit Resume");
      fireEvent.click(editButton);
      fireEvent.click(editButton);
      fireEvent.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edit Resume button loading state", () => {
    it("shows spinner when isEditButtonLoading is true", () => {
      const { container } = render(
        <ResumeCard {...defaultProps} isEditButtonLoading={true} />
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("shows 'Opening...' text when loading", () => {
      render(<ResumeCard {...defaultProps} isEditButtonLoading={true} />);

      expect(screen.getByText("Opening...")).toBeInTheDocument();
      expect(screen.queryByText("Edit Resume")).not.toBeInTheDocument();
    });

    it("disables button when loading", () => {
      render(<ResumeCard {...defaultProps} isEditButtonLoading={true} />);

      const button = screen.getByRole("button", { name: /opening/i });
      expect(button).toBeDisabled();
    });

    it("does not call onEdit when loading", () => {
      render(<ResumeCard {...defaultProps} isEditButtonLoading={true} />);

      const button = screen.getByRole("button", { name: /opening/i });
      fireEvent.click(button);

      expect(defaultProps.onEdit).not.toHaveBeenCalled();
    });

    it("has cursor-not-allowed class when loading", () => {
      render(<ResumeCard {...defaultProps} isEditButtonLoading={true} />);

      const button = screen.getByRole("button", { name: /opening/i });
      expect(button.className).toContain("cursor-not-allowed");
    });

    it("has reduced opacity when loading", () => {
      render(<ResumeCard {...defaultProps} isEditButtonLoading={true} />);

      const button = screen.getByRole("button", { name: /opening/i });
      expect(button.className).toContain("opacity-75");
    });
  });

  describe("Preview thumbnail interactions", () => {
    it("calls onPreview when thumbnail is clicked", () => {
      render(<ResumeCard {...defaultProps} />);

      const thumbnail = screen.getByAltText("My Test Resume");
      fireEvent.click(thumbnail);

      expect(defaultProps.onPreview).toHaveBeenCalledWith("test-id-123");
    });

    it("shows hover overlay with Preview text", () => {
      render(<ResumeCard {...defaultProps} />);

      expect(screen.getByText("Preview")).toBeInTheDocument();
    });
  });

  describe("Preview thumbnail loading state", () => {
    it("shows loading overlay when isPreviewLoading is true", () => {
      render(<ResumeCard {...defaultProps} isPreviewLoading={true} />);

      expect(screen.getByText("Opening preview...")).toBeInTheDocument();
    });

    it("shows spinner in loading overlay", () => {
      const { container } = render(
        <ResumeCard {...defaultProps} isPreviewLoading={true} />
      );

      // Should have spinner in the overlay
      const overlay = container.querySelector(".bg-black\\/50");
      expect(overlay).toBeInTheDocument();

      const spinner = overlay?.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not call onPreview when loading", () => {
      render(<ResumeCard {...defaultProps} isPreviewLoading={true} />);

      const thumbnail = screen.getByAltText("My Test Resume");
      fireEvent.click(thumbnail);

      expect(defaultProps.onPreview).not.toHaveBeenCalled();
    });

    it("has cursor-wait class when loading", () => {
      const { container } = render(
        <ResumeCard {...defaultProps} isPreviewLoading={true} />
      );

      const thumbnailContainer = container.querySelector(".cursor-wait");
      expect(thumbnailContainer).toBeInTheDocument();
    });

    it("applies blur and scale effect to image when loading", () => {
      render(<ResumeCard {...defaultProps} isPreviewLoading={true} />);

      const img = screen.getByAltText("My Test Resume");
      expect(img.className).toContain("scale-105");
      expect(img.className).toContain("blur-[2px]");
    });

    it("hides hover overlay when loading", () => {
      render(<ResumeCard {...defaultProps} isPreviewLoading={true} />);

      // Should not show the hover "Preview" text (only "Opening preview..." should be visible)
      const previewTexts = screen.getAllByText(/preview/i);
      expect(previewTexts).toHaveLength(1);
      expect(previewTexts[0].textContent).toBe("Opening preview...");
    });
  });

  describe("Download button", () => {
    it("calls onDownload when clicked", () => {
      render(<ResumeCard {...defaultProps} />);

      const downloadButton = screen.getByTitle("Download PDF");
      fireEvent.click(downloadButton);

      expect(defaultProps.onDownload).toHaveBeenCalledWith("test-id-123");
    });
  });

  describe("title editing", () => {
    it("enters edit mode when title is clicked", () => {
      render(<ResumeCard {...defaultProps} />);

      const title = screen.getByText("My Test Resume");
      fireEvent.click(title);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("My Test Resume");
    });

    it("calls onRename when edited and blurred", async () => {
      const onRename = vi.fn().mockResolvedValue(undefined);
      render(<ResumeCard {...defaultProps} onRename={onRename} />);

      const title = screen.getByText("My Test Resume");
      fireEvent.click(title);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "New Title" } });
      fireEvent.blur(input);

      expect(onRename).toHaveBeenCalledWith("test-id-123", "New Title");
    });

    it("exits edit mode on Escape without saving", () => {
      render(<ResumeCard {...defaultProps} />);

      const title = screen.getByText("My Test Resume");
      fireEvent.click(title);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "New Title" } });
      fireEvent.keyDown(input, { key: "Escape" });

      expect(defaultProps.onRename).not.toHaveBeenCalled();
      expect(screen.getByText("My Test Resume")).toBeInTheDocument();
    });
  });

  describe("combined loading states", () => {
    it("can have both edit button and preview loading states simultaneously", () => {
      const { container } = render(
        <ResumeCard
          {...defaultProps}
          isEditButtonLoading={true}
          isPreviewLoading={true}
        />
      );

      // Both loading states should be visible
      expect(screen.getByText("Opening...")).toBeInTheDocument();
      expect(screen.getByText("Opening preview...")).toBeInTheDocument();

      // Both spinners should be present
      const spinners = container.querySelectorAll(".animate-spin");
      expect(spinners.length).toBe(2);
    });
  });

  describe("date formatting", () => {
    it("shows 'Just now' for recent updates", () => {
      const recentResume = {
        ...mockResume,
        updated_at: new Date().toISOString(),
      };

      render(<ResumeCard {...defaultProps} resume={recentResume} />);
      expect(screen.getByText(/Updated Just now/i)).toBeInTheDocument();
    });

    it("shows minutes ago for updates within an hour", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const recentResume = {
        ...mockResume,
        updated_at: fiveMinutesAgo,
      };

      render(<ResumeCard {...defaultProps} resume={recentResume} />);
      expect(screen.getByText(/Updated 5m ago/i)).toBeInTheDocument();
    });
  });
});
