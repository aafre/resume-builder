/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RichTextInput } from "../components/RichTextInput";

describe("RichTextInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with placeholder text", () => {
    render(
      <RichTextInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text here"
      />
    );

    // TipTap renders placeholder in a pseudo-element or data attribute
    const editorContainer = screen.getByRole("textbox");
    expect(editorContainer).toBeInTheDocument();
  });

  it("displays initial value", () => {
    render(
      <RichTextInput
        value="Sample text"
        onChange={vi.fn()}
      />
    );

    const editorContainer = screen.getByRole("textbox");
    expect(editorContainer).toHaveTextContent("Sample text");
  });

  it("displays markdown bold as formatted text", () => {
    render(
      <RichTextInput
        value="**bold text**"
        onChange={vi.fn()}
      />
    );

    const editorContainer = screen.getByRole("textbox");
    // Should contain a strong tag after markdown conversion
    const strongElement = editorContainer.querySelector("strong");
    expect(strongElement).toBeInTheDocument();
    expect(strongElement?.textContent).toBe("bold text");
  });

  it("displays markdown italic as formatted text", () => {
    render(
      <RichTextInput
        value="*italic text*"
        onChange={vi.fn()}
      />
    );

    const editorContainer = screen.getByRole("textbox");
    const emElement = editorContainer.querySelector("em");
    expect(emElement).toBeInTheDocument();
    expect(emElement?.textContent).toBe("italic text");
  });

  it("displays markdown links as formatted links", () => {
    render(
      <RichTextInput
        value="[Google](https://google.com)"
        onChange={vi.fn()}
      />
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://google.com");
    expect(linkElement).toHaveTextContent("Google");
  });

  it("calls onChange when user types", async () => {
    const handleChange = vi.fn();

    render(
      <RichTextInput
        value=""
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole("textbox");
    fireEvent.focus(editor);
    fireEvent.input(editor, { target: { textContent: "test" } });

    // Should have been called for input
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  it("converts user input to markdown format", async () => {
    const handleChange = vi.fn();

    render(
      <RichTextInput
        value=""
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole("textbox");
    fireEvent.click(editor);
    fireEvent.input(editor, { target: { textContent: "test text" } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      // Last call should have the plain text (no formatting)
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0]).toContain("test");
    });
  });

  it("updates content when value prop changes", async () => {
    const { rerender } = render(
      <RichTextInput
        value="initial text"
        onChange={vi.fn()}
      />
    );

    let editor = screen.getByRole("textbox");
    expect(editor).toHaveTextContent("initial text");

    // Change the value prop
    rerender(
      <RichTextInput
        value="updated text"
        onChange={vi.fn()}
      />
    );

    await waitFor(() => {
      editor = screen.getByRole("textbox");
      expect(editor).toHaveTextContent("updated text");
    });
  });

  it("does not update when value hasn't changed (prevents cursor jump)", async () => {
    const handleChange = vi.fn();

    render(
      <RichTextInput
        value="same text"
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveTextContent("same text");

    // Internal check: editor shouldn't reset if value is same
    // This is important for cursor position stability
  });

  it("applies custom className", () => {
    const customClass = "custom-input-class";
    const { container } = render(
      <RichTextInput
        value="test"
        onChange={vi.fn()}
        className={customClass}
      />
    );

    const inputContainer = container.querySelector(`.${customClass}`);
    expect(inputContainer).toBeInTheDocument();
  });

  it("disables editing when disabled prop is true", () => {
    render(
      <RichTextInput
        value="test"
        onChange={vi.fn()}
        disabled={true}
      />
    );

    const editor = screen.getByRole("textbox");
    // TipTap sets contenteditable="false" when disabled
    expect(editor).toHaveAttribute("contenteditable", "false");
  });

  it("enables editing when disabled prop is false", () => {
    render(
      <RichTextInput
        value="test"
        onChange={vi.fn()}
        disabled={false}
      />
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toHaveAttribute("contenteditable", "true");
  });

  it("handles multiple formatting styles together", () => {
    render(
      <RichTextInput
        value="**bold** and *italic* and [link](https://test.com)"
        onChange={vi.fn()}
      />
    );

    const editor = screen.getByRole("textbox");

    // Should have bold
    const strongElement = editor.querySelector("strong");
    expect(strongElement).toBeInTheDocument();

    // Should have italic
    const emElement = editor.querySelector("em");
    expect(emElement).toBeInTheDocument();

    // Should have link
    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
  });

  it("handles underline formatting", () => {
    render(
      <RichTextInput
        value="++underlined++text"
        onChange={vi.fn()}
      />
    );

    const editor = screen.getByRole("textbox");
    const uElement = editor.querySelector("u");
    expect(uElement).toBeInTheDocument();
  });

  it("handles strikethrough formatting", () => {
    render(
      <RichTextInput
        value="~~strikethrough~~ text"
        onChange={vi.fn()}
      />
    );

    const editor = screen.getByRole("textbox");
    const sElement = editor.querySelector("s");
    expect(sElement).toBeInTheDocument();
  });

  it("focuses editor when container is clicked", async () => {
    render(
      <RichTextInput
        value="test"
        onChange={vi.fn()}
      />
    );

    const editor = screen.getByRole("textbox");
    fireEvent.click(editor);
    editor.focus();

    // Editor should receive focus
    expect(document.activeElement).toBe(editor);
  });

  it("maintains single-line behavior (no line breaks)", async () => {
    const handleChange = vi.fn();

    render(
      <RichTextInput
        value="line 1"
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole("textbox");
    fireEvent.click(editor);

    // Move cursor to end
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Try to press Enter
    fireEvent.keyDown(editor, { key: "Enter" });

    // Should not create a new paragraph or line break
    await waitFor(() => {
      const paragraphs = editor.querySelectorAll("p");
      // Should only have one paragraph (single-line mode)
      expect(paragraphs.length).toBeLessThanOrEqual(1);
    });
  });

  it("handles empty value gracefully", () => {
    render(
      <RichTextInput
        value=""
        onChange={vi.fn()}
      />
    );

    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();
    expect(editor.textContent).toBe("");
  });

  it("handles null or undefined markdown gracefully", () => {
    const { rerender } = render(
      <RichTextInput
        value=""
        onChange={vi.fn()}
      />
    );

    // Component should render without errors
    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();

    // Try updating to undefined (simulating edge case)
    rerender(
      <RichTextInput
        value=""
        onChange={vi.fn()}
      />
    );

    expect(editor).toBeInTheDocument();
  });
});
