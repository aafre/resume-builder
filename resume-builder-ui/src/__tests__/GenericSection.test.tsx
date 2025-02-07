import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenericSection from "../components/GenericSection";

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
      />
    );

    // In non-editing mode, the title is rendered as text with an edit button.
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByTitle("Edit Title")).toBeInTheDocument();
    // For a text section, a textarea should be rendered.
    const textarea = screen.getByRole("textbox", { name: "" }); // the textarea doesn't have a visible label
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
      />
    );
    const textarea = screen.getByRole("textbox", { name: "" });
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
      />
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
      />
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
      />
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
      />
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
  it("renders title editing input when isEditing is true", () => {
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
        isEditing={true}
        temporaryTitle="Editing Title"
        setTemporaryTitle={setTemporaryTitleMock}
      />
    );

    // We want the title editing input, not the textarea.
    // Get all elements with role "textbox" and then filter for those that are INPUT elements.
    const textboxes = screen.getAllByRole("textbox");
    const inputElements = textboxes.filter((el) => el.tagName === "INPUT");
    expect(inputElements.length).toBeGreaterThan(0);
    // Assert that one of these has the expected value.
    expect(inputElements[0]).toHaveValue("Editing Title");

    // The Save and Cancel buttons should be present.
    expect(screen.getByTitle("Save Title")).toBeInTheDocument();
    expect(screen.getByTitle("Cancel")).toBeInTheDocument();
  });

  it("calls onSaveTitle and onCancelTitle when the respective buttons are clicked", () => {
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
        isEditing={true}
        temporaryTitle="Editing Title"
        setTemporaryTitle={setTemporaryTitleMock}
      />
    );
    fireEvent.click(screen.getByTitle("Save Title"));
    expect(onSaveTitleMock).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTitle("Cancel"));
    expect(onCancelTitleMock).toHaveBeenCalledTimes(1);
  });

  it("calls onEditTitle when the edit button is clicked in non-editing mode", () => {
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
      />
    );
    fireEvent.click(screen.getByTitle("Edit Title"));
    expect(onEditTitleMock).toHaveBeenCalledTimes(1);
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
      />
    );
    fireEvent.click(screen.getByText("Remove"));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
