import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IconListSection from "../components/IconListSection";

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
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />
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
    render(<IconListSection data={[]} onUpdate={onUpdateMock} />);
    // Component doesn't render empty state message, just the Add Item button
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onUpdate when a certification field is changed", () => {
    const onUpdateMock = vi.fn();
    render(
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />
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
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />
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
      <IconListSection data={getMockCertifications()} onUpdate={onUpdateMock} />
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
});
