import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IconUpload from "../components/IconUpload";

// Utility function to create a dummy File.
const createFile = (name: string, size: number, type: string) => {
  return new File(["a".repeat(size)], name, { type });
};

// --- Mock FileReader ---
// We define a mock FileReader that immediately sets a dummy data URL as the result.
class MockFileReader {
  result: string | null = null;
  onload: ((ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(_file: File): void {
    this.result = "data:image/png;base64,dummy";
    if (this.onload) {
      const event = new ProgressEvent("load") as ProgressEvent<FileReader>;
      this.onload(event);
    }
  }
}
// Override the global FileReader with our mock (cast to any to avoid full interface implementation)
(window as any).FileReader = MockFileReader;

describe("IconUpload", () => {
  it("displays the existing icon if provided", async () => {
    const onUploadMock = vi.fn();
    const onClearMock = vi.fn();

    render(
      <IconUpload
        onUpload={onUploadMock}
        onClear={onClearMock}
        existingIcon="test.png"
      />
    );

    // Wait for useEffect to run and set the preview.
    await waitFor(() => {
      const img = screen.getByAltText("Uploaded Icon");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/icons/test.png");
    });
  });

  it("displays placeholder when no existing icon is provided", () => {
    const onUploadMock = vi.fn();
    render(<IconUpload onUpload={onUploadMock} />);
    // There should be no image with alt "Uploaded Icon"
    expect(screen.queryByAltText("Uploaded Icon")).not.toBeInTheDocument();
    // Check for a rendered SVG (from FaImage). We'll use a query for an SVG element.
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  it("calls onUpload and sets preview when a file is selected", async () => {
    const onUploadMock = vi.fn();
    render(<IconUpload onUpload={onUploadMock} />);

    // Create a dummy file.
    const file = createFile("sample.png", 100, "image/png");

    // Find the hidden file input. (It is inside the label.)
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    // Fire a change event on the file input.
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verify onUpload is called.
    await waitFor(() => {
      expect(onUploadMock).toHaveBeenCalledTimes(1);
    });
    const callArgs = onUploadMock.mock.calls[0];
    const renamedFile = callArgs[0];
    const uploadedFile = callArgs[1];
    expect(typeof renamedFile).toBe("string");
    // Expect the renamed file to match a random string with extension "png".
    expect(renamedFile).toMatch(/^[a-z0-9]+\.(png)$/);
    expect(uploadedFile).toBe(file);

    // Also verify that the preview image is now set to the dummy data URL.
    await waitFor(() => {
      const img = screen.getByAltText("Uploaded Icon");
      expect(img).toHaveAttribute("src", "data:image/png;base64,dummy");
    });
  });

  it("calls onClear and clears preview when clear button is clicked", async () => {
    const onUploadMock = vi.fn();
    const onClearMock = vi.fn();

    // Render with an existing icon so that a preview is shown.
    render(
      <IconUpload
        onUpload={onUploadMock}
        onClear={onClearMock}
        existingIcon="test.png"
      />
    );
    // Wait for the image to appear.
    await waitFor(() => {
      expect(screen.getByAltText("Uploaded Icon")).toBeInTheDocument();
    });

    // The clear button is rendered when iconPreview is set.
    // Find the clear button by its role; since it is a <button>, we can use getByRole.
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    // onClear should be called.
    expect(onClearMock).toHaveBeenCalledTimes(1);
    // After clearing, the preview image should no longer be rendered.
    await waitFor(() => {
      expect(screen.queryByAltText("Uploaded Icon")).not.toBeInTheDocument();
    });
  });

  it("handles broken icon gracefully by showing the image with broken src", async () => {
    const onUploadMock = vi.fn();
    const onClearMock = vi.fn();

    // Render with a "broken" icon (simulate a file that doesn't exist)
    render(
      <IconUpload
        onUpload={onUploadMock}
        onClear={onClearMock}
        existingIcon="nonexistent.png"
      />
    );

    // The component should still render the img element, even with broken src
    // This is the current behavior - the browser will handle the broken image
    await waitFor(() => {
      const img = screen.getByAltText("Uploaded Icon");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/icons/nonexistent.png");
    });
  });

  describe("File Validation", () => {
    it("handles large file uploads", async () => {
      const onUploadMock = vi.fn();
      render(<IconUpload onUpload={onUploadMock} />);

      // Create a large file (5MB)
      const largeFile = createFile("large.png", 5 * 1024 * 1024, "image/png");

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      // The component should still handle the upload
      await waitFor(() => {
        expect(onUploadMock).toHaveBeenCalledTimes(1);
      });
    });

    it("handles non-image file types", async () => {
      const onUploadMock = vi.fn();
      render(<IconUpload onUpload={onUploadMock} />);

      // Create a non-image file
      const textFile = createFile("document.txt", 100, "text/plain");

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [textFile] } });

      // The component should still handle the upload (validation might be server-side)
      await waitFor(() => {
        expect(onUploadMock).toHaveBeenCalledTimes(1);
      });
    });

    it("handles files with special characters in names", async () => {
      const onUploadMock = vi.fn();
      render(<IconUpload onUpload={onUploadMock} />);

      // Create a file with special characters
      const specialNameFile = createFile("image-with spaces & symbols (1).png", 100, "image/png");

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [specialNameFile] } });

      await waitFor(() => {
        expect(onUploadMock).toHaveBeenCalledTimes(1);
        const callArgs = onUploadMock.mock.calls[0];
        const renamedFile = callArgs[0];
        // Should still generate a clean filename
        expect(renamedFile).toMatch(/^[a-z0-9]+\.(png)$/);
      });
    });

    it("handles empty file selection gracefully", () => {
      const onUploadMock = vi.fn();
      render(<IconUpload onUpload={onUploadMock} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [] } });

      // Should not call onUpload for empty file selection
      expect(onUploadMock).not.toHaveBeenCalled();
    });
  });
});
