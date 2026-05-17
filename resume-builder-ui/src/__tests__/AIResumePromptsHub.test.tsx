import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AIResumePromptsHub from "../components/blog/AIResumePromptsHub";

function renderHub() {
  return render(
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

    // 6 rating rows × 6 providers = 36 star-rating cells, each with an
    // accessible name conveying the value. Text rows render strings, not images.
    const ratingCells = within(table).getAllByRole("img", { name: /out of 5/i });
    expect(ratingCells).toHaveLength(36);
    expect(within(table).queryByText("★★★★★")).not.toBeInTheDocument();
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

  it("uses approved heading typography without placeholder version copy", () => {
    const { container } = renderHub();
    const hubContent = container.querySelector(".space-y-10");
    expect(hubContent).toBeInTheDocument();

    const h2Headings = Array.from(hubContent!.querySelectorAll("h2"));
    h2Headings.forEach((heading) => {
      expect(heading).toHaveClass(
        "font-display",
        "text-3xl",
        "md:text-4xl",
        "font-extrabold",
        "tracking-tight"
      );
    });

    Array.from(hubContent!.querySelectorAll("h3")).forEach((heading) => {
      expect(heading).toHaveClass("font-display", "text-xl", "font-bold", "text-ink");
    });

    expect(screen.queryByText(/Reviewed as .* current public assistant experience/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Turn the Prompt Output Into a Finished Resume",
      })
    ).toBeInTheDocument();
  });

  it("marks comparison table headers with explicit scope attributes", () => {
    const { container } = renderHub();

    const columnHeaders = Array.from(container.querySelectorAll("thead th"));
    expect(columnHeaders).toHaveLength(7);
    columnHeaders.forEach((header) => {
      expect(header).toHaveAttribute("scope", "col");
    });

    const rowHeaders = Array.from(container.querySelectorAll("tbody th"));
    expect(rowHeaders).toHaveLength(8);
    rowHeaders.forEach((header) => {
      expect(header).toHaveAttribute("scope", "row");
    });
  });
});
