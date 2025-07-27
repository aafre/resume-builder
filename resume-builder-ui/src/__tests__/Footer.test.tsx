import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

describe("Footer", () => {
  it("renders Privacy and Terms links with correct hrefs", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Verify that the Privacy link is rendered and its href is correct.
    // The link text is 'Privacy', not 'Privacy Policy'
    const privacyLink = screen.getByRole("link", { name: /privacy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");

    const termsLink = screen.getByRole("link", { name: /terms/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms-of-service");
  });

  it("renders copyright text with the current year", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const currentYear = new Date().getFullYear().toString();
    // Use a regex to search for the current year in the copyright text.
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear}`, "i"));
    expect(copyrightText).toBeInTheDocument();
  });

  it("renders feature icons and their corresponding text", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Verify that the texts for the feature icons are present.
    expect(screen.getByText("GDPR")).toBeInTheDocument();
    expect(screen.getByText("SSL")).toBeInTheDocument();
  });
});
