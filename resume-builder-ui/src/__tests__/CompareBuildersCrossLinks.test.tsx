import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CompareBuildersCrossLinks, { ALL_COMPARISONS } from "../components/blog/CompareBuildersCrossLinks";

describe("CompareBuildersCrossLinks", () => {
  it("renders all comparison links when no excludePath is given", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks />
      </MemoryRouter>
    );

    ALL_COMPARISONS.forEach((c) => {
      expect(screen.getByText(c.label)).toBeInTheDocument();
    });

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(ALL_COMPARISONS.length);
  });

  it("excludes the current page when excludePath is provided", () => {
    const excludePath = ALL_COMPARISONS[0].path;
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks excludePath={excludePath} />
      </MemoryRouter>
    );

    expect(screen.queryByText(ALL_COMPARISONS[0].label)).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(ALL_COMPARISONS.length - 1);
  });

  it("renders default heading and description", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks />
      </MemoryRouter>
    );

    expect(screen.getByText("Compare Other Resume Builders")).toBeInTheDocument();
    expect(
      screen.getByText(
        "See how other popular resume builders compare on pricing, features, and hidden costs:"
      )
    ).toBeInTheDocument();
  });

  it("accepts custom title, description, and bgColor", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks
          title="See How Specific Builders Compare"
          description="Custom description text"
          bgColor="bg-blue-50"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("See How Specific Builders Compare")).toBeInTheDocument();
    expect(screen.getByText("Custom description text")).toBeInTheDocument();
  });

  it("renders correct hrefs for all links", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks />
      </MemoryRouter>
    );

    const expectedHrefs = ALL_COMPARISONS.map((c) => c.path);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(expectedHrefs);
  });
});
