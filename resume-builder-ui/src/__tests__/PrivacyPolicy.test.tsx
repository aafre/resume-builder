/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

describe("PrivacyPolicy Component", () => {
  it("renders the privacy policy header and last updated text", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(
      screen.getByText(/Last Updated: 20 December 2024/i)
    ).toBeInTheDocument();
  });

  it("renders the policy content and a link to GitHub issues", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(screen.getByText(/EasyFreeResume\.com/)).toBeInTheDocument();
    const githubLink = screen.getByRole("link", { name: /here/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/aafre/resume-builder/issues"
    );
  });
});
