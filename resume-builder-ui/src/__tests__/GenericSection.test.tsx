import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DndContext } from "@dnd-kit/core";
import GenericSection from "../components/GenericSection";

// Wrapper component to provide DndContext for testing
const DndWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DndContext>{children}</DndContext>
);

// --- Mock RichTextArea to return a simple textarea for testing ---
vi.mock("../components/RichTextArea", () => {
  return {
    RichTextArea: (props: { value: string; onChange: (value: string) => void; placeholder?: string }) => {
      return (
        <textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          data-testid="rich-text-area"
        />
      );
    },
  };
});

// --- Mock RichTextInput to return a simple input for testing ---
vi.mock("../components/RichTextInput", () => {
  return {
    RichTextInput: (props: { value: string; onChange: (value: string) => void; placeholder?: string }) => {
      return (
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          data-testid="rich-text-input"
        />
      );
    },
  };
});

// --- Mock MarkdownHint ---
vi.mock("../components/MarkdownLinkPreview", () => {
  return {
    MarkdownHint: () => <div data-testid="markdown-hint">Markdown Hint</div>,
  };
});

// Sample section data for testing.
const textSection = {
  name: "Summary",
  type: "text",
  content: "This is a text section content.",
};

const listSection = {
  name: "Key Skills",
  type: "bulleted-list",
  content: ["Skill 1", "Skill 2"],
};

describe("GenericSection (Text Type)", () => {
  it("renders a textarea with correct content when type is text", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={textSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );

    // The title is rendered as a clickable button for inline editing
    expect(screen.getByRole('button', { name: /edit: summary/i })).toBeInTheDocument();
    // For a text section, a textarea should be rendered (via RichTextArea mock).
    const textarea = screen.getByRole("textbox");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveValue("This is a text section content.");
  });

  it("calls onUpdate when the textarea value changes", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={textSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Updated text content" } });
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedSection = onUpdateMock.mock.calls[0][0];
    expect(updatedSection.content).toBe("Updated text content");
  });
});

describe("GenericSection (List Type)", () => {
  it("renders list items for a bulleted-list section", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={listSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );
    // Verify that inputs for each list item are rendered.
    expect(screen.getByDisplayValue("Skill 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Skill 2")).toBeInTheDocument();
    // "Add Item" button should be present.
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onUpdate when a list item is changed", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={listSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );
    const firstItemInput = screen.getByDisplayValue("Skill 1");
    fireEvent.change(firstItemInput, { target: { value: "Updated Skill" } });
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedSection = onUpdateMock.mock.calls[0][0];
    expect(updatedSection.content[0]).toBe("Updated Skill");
  });

  it("adds a new item when the Add Item button is clicked", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={listSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );
    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedSection = onUpdateMock.mock.calls[0][0];
    // Original listSection.content length is 2; expect new length to be 3.
    expect(updatedSection.content).toHaveLength(3);
    expect(updatedSection.content[2]).toBe("");
  });

  it("removes an item when its delete button is clicked", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={listSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );
    // For each list item, there's a delete button with title "Remove Item".
    const deleteButtons = screen.getAllByTitle("Remove Item");
    fireEvent.click(deleteButtons[0]);
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedSection = onUpdateMock.mock.calls[0][0];
    // Original length is 2; after removing, it should be 1.
    expect(updatedSection.content).toHaveLength(1);
    expect(updatedSection.content[0]).toBe("Skill 2");
  });
});

describe("GenericSection Title Editing", () => {
  it("renders section title that is clickable for inline editing", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={textSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );

    // The title should be rendered as a clickable button for inline editing
    const titleButton = screen.getByRole('button', { name: /edit: summary/i });
    expect(titleButton).toBeInTheDocument();

    // Click to enter edit mode
    fireEvent.click(titleButton);

    // Should now have an input field for editing with aria-label
    expect(screen.getByRole('textbox', { name: /edit text/i })).toBeInTheDocument();
  });

  it("calls onDelete when the Remove Section button is clicked", () => {
    const onUpdateMock = vi.fn();
    const onEditTitleMock = vi.fn();
    const onSaveTitleMock = vi.fn();
    const onCancelTitleMock = vi.fn();
    const onDeleteMock = vi.fn();
    const setTemporaryTitleMock = vi.fn();

    render(
      <GenericSection
        section={textSection}
        onUpdate={onUpdateMock}
        onEditTitle={onEditTitleMock}
        onSaveTitle={onSaveTitleMock}
        onCancelTitle={onCancelTitleMock}
        onDelete={onDeleteMock}
        isEditing={false}
        temporaryTitle=""
        setTemporaryTitle={setTemporaryTitleMock}
      />,
      { wrapper: DndWrapper }
    );

    // Click calls onDelete directly (modal handles confirmation)
    fireEvent.click(screen.getByRole('button', { name: /remove section/i }));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
