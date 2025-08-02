import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ErrorPage from "../components/ErrorPage";

// Mock useNavigate from react-router-dom.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ErrorPage", () => {
  it("renders default message when no message prop is provided", () => {
    render(<ErrorPage />);

    // Verify the header is rendered.
    expect(screen.getByText("5XX")).toBeInTheDocument();

    // Verify that the default message is rendered.
    expect(
      screen.getByText("We're experiencing technical difficulties. Please try again in a few moments.")
    ).toBeInTheDocument();

    // Verify that the button is rendered.
    expect(
      screen.getByRole("button", { name: /Go Home/i })
    ).toBeInTheDocument();
  });

  it("renders provided message when message prop is provided", () => {
    render(<ErrorPage message="Custom error message" />);

    // Verify that the custom message is rendered.
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("calls navigate with '/' when the Go Back to Home button is clicked", () => {
    render(<ErrorPage />);

    const button = screen.getByRole("button", { name: /Go Home/i });
    fireEvent.click(button);

    // Verify that useNavigate's mock is called with "/".
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
