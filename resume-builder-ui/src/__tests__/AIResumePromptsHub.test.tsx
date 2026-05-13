import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AIResumePromptsHub from "../components/blog/AIResumePromptsHub";

function renderHub() {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <AIResumePromptsHub />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("AIResumePromptsHub", () => {
  it("renders the approved comparison scope and reviewed-date wording", () => {
    renderHub();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Resume Prompts Hub/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /Last reviewed 2026-05-13/i
      )[0]
    ).toBeInTheDocument();
    expect(screen.queryByText(/Last tested/i)).not.toBeInTheDocument();

    const table = screen.getByRole("table", {
      name: /AI resume prompts comparison/i,
    });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(9);

    [
      "Rewriting experience bullets",
      "Writing a professional summary",
      "Tailoring resume to a JD",
      "Quantifying achievements",
      "ATS keyword extraction",
      "Cover letter drafts",
      "Free tier availability",
      "Privacy / no training on your input",
    ].forEach((label) => {
      expect(within(table).getByText(label)).toBeInTheDocument();
    });
  });

  it("includes the required internal and outbound authority links", () => {
    renderHub();

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    [
      "/templates",
      "/free-resume-builder-no-sign-up",
      "/blog/claude-resume-prompts",
      "/blog/gemini-resume-prompts",
      "/blog/best-free-resume-builders-2026",
      "/blog/ai-cover-letter-prompts",
      "/blog/ai-resume-writing-guide",
      "/resume-keyword-scanner",
    ].forEach((href) => {
      expect(hrefs).toContain(href);
    });

    const outboundLinks = hrefs.filter((href): href is string =>
      Boolean(href?.startsWith("https://"))
    );
    expect(outboundLinks.length).toBeGreaterThanOrEqual(3);
  });
});
