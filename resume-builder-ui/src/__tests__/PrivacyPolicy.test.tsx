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
      screen.getByText(/Last updated 25 September 2026/i)
    ).toBeInTheDocument();
  });

  it("names the job feed and what is sent to it", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    const para = screen.getByText(/Job listings come from our job feed, Adzuna/);
    expect(para).toHaveTextContent(/job title, location and country/);
    expect(para).toHaveTextContent(/resume text, name and\s+contact details are never sent to Adzuna/);
    expect(para).toHaveTextContent(/AI job-title suggestion function/);
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

  it("renders the Google User Data section with all required disclosures", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    // Section heading
    expect(screen.getByRole("heading", { name: /Google User Data/ })).toBeInTheDocument();

    // Data usage disclosures
    expect(screen.getByText(/Data Accessed from Google:/)).toBeInTheDocument();
    expect(screen.getByText(/Email Address:/)).toBeInTheDocument();
    expect(screen.getByText(/Full Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Profile Picture:/)).toBeInTheDocument();
    expect(screen.getByText(/How We Use Google Data:/)).toBeInTheDocument();
    expect(screen.getByText(/What We Do NOT Do:/)).toBeInTheDocument();
    expect(
      screen.getByText(/do not use your Google data for advertisements/i)
    ).toBeInTheDocument();

    // Compliance statement and link
    expect(
      screen.getByText(/including the Limited Use requirements/i)
    ).toBeInTheDocument();
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
});
