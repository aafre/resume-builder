import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CompareBuildersCrossLinks, { ALL_COMPARISONS } from "../components/blog/CompareBuildersCrossLinks";

describe("CompareBuildersCrossLinks", () => {
  it("renders all 7 comparison links when no excludePath is given", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks />
      </MemoryRouter>
    );

    expect(screen.getByText("Zety Pricing Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Resume.io Pricing Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Resume Genius Pricing")).toBeInTheDocument();
    expect(screen.getByText("Novoresume Pricing")).toBeInTheDocument();
    expect(screen.getByText("Enhancv Pricing")).toBeInTheDocument();
    expect(screen.getByText("Canva Resume Builder Review")).toBeInTheDocument();
    expect(screen.getByText("FlowCV Review")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(7);
  });

  it("excludes the current page when excludePath is provided", () => {
    render(
      <MemoryRouter>
        <CompareBuildersCrossLinks excludePath="/blog/zety-vs-easy-free-resume" />
      </MemoryRouter>
    );

    expect(screen.queryByText("Zety Pricing Breakdown")).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
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
