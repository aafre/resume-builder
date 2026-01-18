import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DndContext } from "@dnd-kit/core";
import IconListSection from "../components/IconListSection";

// Wrapper component to provide DndContext for testing
const DndWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DndContext>{children}</DndContext>
);

// --- Mock RichTextInput to return a simple input for testing ---
vi.mock("../components/RichTextInput", () => {
  return {
    RichTextInput: (props: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) => {
      return (
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className={props.className}
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

// --- Mock IconManager ---
vi.mock("../components/IconManager", () => {
  return {
    default: (props: { value: string; onChange: any }) => (
      <div data-testid="icon-manager" data-value={props.value}>
        IconManager
      </div>
    ),
  };
});

// Base mock data for certifications.
const baseCertifications = [
  {
    certification: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    date: "2022",
    icon: "certification_k8s.png",
  },
  {
    certification: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "2021",
    icon: "certification_aws.png",
  },
];

// Helper to deep clone the base mock data.
const getMockCertifications = () =>
  JSON.parse(JSON.stringify(baseCertifications));

describe("IconListSection", { timeout: 5000 }, () => {
  it("renders certification entries with correct values", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />,
      { wrapper: DndWrapper }
    );

    // Check that the header is rendered.
    expect(screen.getByText("Certifications")).toBeInTheDocument();

    // Verify that the inputs for certification, issuer, and date are rendered.
    expect(
      screen.getByDisplayValue("Certified Kubernetes Administrator (CKA)")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Cloud Native Computing Foundation")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("2022")).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("AWS Certified Solutions Architect – Associate")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2021")).toBeInTheDocument();
  });

  it("renders add button when no certifications are provided", () => {
    const onUpdateMock = vi.fn();
    render(<IconListSection data={[]} onUpdate={onUpdateMock} />, { wrapper: DndWrapper });
    // Component doesn't render empty state message, just the Add Item button
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onUpdate when a certification field is changed", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />,
      { wrapper: DndWrapper }
    );

    // Change the certification field of the first item.
    const certInput = screen.getByDisplayValue(
      "Certified Kubernetes Administrator (CKA)"
    );
    fireEvent.change(certInput, { target: { value: "Updated Certification" } });

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedData = onUpdateMock.mock.calls[0][0];
    expect(updatedData[0].certification).toBe("Updated Certification");
  });

  it("removes a certification when its delete button is clicked", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />,
      { wrapper: DndWrapper }
    );

    // The remove button is rendered with title "Remove Certification".
    const removeButtons = screen.getAllByTitle("Remove Certification");
    // Remove the first certification.
    fireEvent.click(removeButtons[0]);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedData = onUpdateMock.mock.calls[0][0];
    expect(updatedData).toHaveLength(getMockCertifications().length - 1);
    // The remaining certification should be the second one.
    expect(updatedData[0].certification).toBe(
      "AWS Certified Solutions Architect – Associate"
    );
  });

  it("adds a new certification when the Add Item button is clicked", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />,
      { wrapper: DndWrapper }
    );

    const addButton = screen.getByText("Add Item");
    fireEvent.click(addButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedData = onUpdateMock.mock.calls[0][0];
    expect(updatedData).toHaveLength(getMockCertifications().length + 1);
    // Verify that the new certification has empty/default values.
    const newCertification = updatedData[updatedData.length - 1];
    expect(newCertification.certification).toBe("");
    expect(newCertification.issuer).toBe("");
    expect(newCertification.date).toBe("");
    expect(newCertification.icon).toBe(null);
  });

  it("renders with custom section name when provided", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection
        data={getMockCertifications()}
        onUpdate={onUpdateMock}
        sectionName="Licenses & Awards"
      />,
      { wrapper: DndWrapper }
    );

    expect(screen.getByText("Licenses & Awards")).toBeInTheDocument();
  });

  it("calls onDeleteEntry when provided instead of deleting directly", () => {
    const onUpdateMock = vi.fn();
    const onDeleteEntryMock = vi.fn();
    render(
      <IconListSection
        data={getMockCertifications()}
        onUpdate={onUpdateMock}
        onDeleteEntry={onDeleteEntryMock}
      />,
      { wrapper: DndWrapper }
    );

    const removeButtons = screen.getAllByTitle("Remove Certification");
    fireEvent.click(removeButtons[0]);

    // Should call onDeleteEntry for confirmation, not onUpdate
    expect(onDeleteEntryMock).toHaveBeenCalledWith(0);
    expect(onUpdateMock).not.toHaveBeenCalled();
  });
});
