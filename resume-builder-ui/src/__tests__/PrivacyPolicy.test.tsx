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
      screen.getByText(/Last Updated: 1 January 2026/i)
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

  it("renders the Google User Data section heading", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(screen.getByText("2. Google User Data")).toBeInTheDocument();
  });

  it("renders the Google API Services User Data Policy link", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    const googlePolicyLink = screen.getByRole("link", {
      name: /Google API Services User Data Policy/i,
    });
    expect(googlePolicyLink).toBeInTheDocument();
    expect(googlePolicyLink).toHaveAttribute(
      "href",
      "https://developers.google.com/terms/api-services-user-data-policy"
    );
    expect(googlePolicyLink).toHaveAttribute("target", "_blank");
    expect(googlePolicyLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Google data usage disclosures", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(screen.getByText(/Data Accessed from Google:/)).toBeInTheDocument();
    expect(screen.getByText(/Email Address:/)).toBeInTheDocument();
    expect(screen.getByText(/Full Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Profile Picture:/)).toBeInTheDocument();
    expect(screen.getByText(/How We Use Google Data:/)).toBeInTheDocument();
    expect(
      screen.getByText(/What We Do NOT Do:/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not use your Google data for advertisements/i)
    ).toBeInTheDocument();
  });

  it("renders the Limited Use compliance statement", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/including the Limited Use requirements/i)
    ).toBeInTheDocument();
  });
});
