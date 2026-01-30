import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { SideRailLayout } from "../components/ads/SideRailLayout";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();

  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  }));

  window.adsbygoogle = [];

  // Enable explicit ads feature flag for tests
  vi.stubEnv("VITE_ENABLE_EXPLICIT_ADS", "true");
});

describe("SideRailLayout", () => {
  it("renders children inside the content area when enabled", () => {
    render(
      <SideRailLayout>
        <p data-testid="child">Page content</p>
      </SideRailLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders both side rail ad containers when enabled", () => {
    render(
      <SideRailLayout>
        <p>Content</p>
      </SideRailLayout>
    );

    expect(screen.getByTestId("side-rail-left")).toBeInTheDocument();
    expect(screen.getByTestId("side-rail-right")).toBeInTheDocument();
  });

  it("renders the flex wrapper with correct layout classes", () => {
    const { container } = render(
      <SideRailLayout>
        <p>Content</p>
      </SideRailLayout>
    );

    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("flex", "justify-center", "gap-6");
  });

  it("renders accessible aside elements for each rail", () => {
    render(
      <SideRailLayout>
        <p>Content</p>
      </SideRailLayout>
    );

    expect(
      screen.getByLabelText("Left advertisement")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Right advertisement")
    ).toBeInTheDocument();
  });

  it("renders children directly without wrapper when enabled is false", () => {
    const { container } = render(
      <SideRailLayout enabled={false}>
        <p data-testid="child">Page content</p>
      </SideRailLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByTestId("side-rail-left")).not.toBeInTheDocument();
    expect(screen.queryByTestId("side-rail-right")).not.toBeInTheDocument();
    // No flex wrapper — child is rendered directly
    expect(container.querySelector(".flex")).not.toBeInTheDocument();
  });

  it("renders children directly when explicit ads are off and debug is off", async () => {
    // Must mock at module level since AD_CONFIG.debug is evaluated at import time.
    // Reset the module registry so the re-import picks up the mocked deps.
    vi.resetModules();

    vi.doMock("../config/ads", () => ({
      AD_CONFIG: {
        debug: false,
        clientId: "test",
        slots: { sideRailLeft: "left", sideRailRight: "right" },
      },
      AD_SLOT_NAMES: {},
      isExplicitAdsEnabled: () => false,
    }));
    vi.doMock("../components/ads/adUtils", () => ({
      isExplicitAdsEnabled: () => false,
    }));

    // Re-import to pick up the mock
    const { SideRailLayout: MockedLayout } = await import(
      "../components/ads/SideRailLayout"
    );

    const { container } = render(
      <MockedLayout>
        <p data-testid="child">Page content</p>
      </MockedLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByTestId("side-rail-left")).not.toBeInTheDocument();
    expect(container.querySelector(".flex")).not.toBeInTheDocument();
  });
});
