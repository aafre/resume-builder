import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { InFeedAd } from "../components/ads/InFeedAd";

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

describe("InFeedAd", () => {
  it("renders with correct test id", () => {
    render(<InFeedAd adSlot="1234567890" />);

    expect(screen.getByTestId("in-feed-ad")).toBeInTheDocument();
  });

  it("renders inner AdContainer with correct test id", () => {
    render(<InFeedAd adSlot="1234567890" />);

    expect(screen.getByTestId("in-feed-ad-container")).toBeInTheDocument();
  });

  it("applies card layout by default", () => {
    render(<InFeedAd adSlot="1234567890" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveClass("in-feed-ad--card");
    expect(wrapper).toHaveStyle({
      minHeight: "280px",
      minWidth: "250px",
    });
  });

  it("applies row layout when specified", () => {
    render(<InFeedAd adSlot="1234567890" layout="row" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveClass("in-feed-ad--row");
    expect(wrapper).toHaveStyle({
      minHeight: "100px",
      width: "100%",
    });
  });

  it("has accessible aria-label", () => {
    render(<InFeedAd adSlot="1234567890" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveAttribute("aria-label", "Sponsored content");
  });

  it("renders nothing when enabled is false", () => {
    render(<InFeedAd adSlot="1234567890" enabled={false} />);

    expect(screen.queryByTestId("in-feed-ad")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<InFeedAd adSlot="1234567890" className="my-feed-ad" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveClass("my-feed-ad");
    expect(wrapper).toHaveClass("in-feed-ad");
  });

  it("applies custom dimensions (number values)", () => {
    render(
      <InFeedAd
        adSlot="1234567890"
        dimensions={{ width: 300, height: 250 }}
      />
    );

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveStyle({
      width: "300px",
      height: "250px",
    });
  });

  it("applies custom dimensions (string values)", () => {
    render(
      <InFeedAd
        adSlot="1234567890"
        dimensions={{ width: "100%", height: "auto" }}
      />
    );

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveStyle({
      width: "100%",
      height: "auto",
    });
  });

  it("applies custom styles", () => {
    render(
      <InFeedAd
        adSlot="1234567890"
        style={{ margin: "16px", borderColor: "blue" }}
      />
    );

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveStyle({
      margin: "16px",
      borderColor: "blue",
    });
  });

  it("card layout has card styling (background, border, rounded corners)", () => {
    render(<InFeedAd adSlot="1234567890" layout="card" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveStyle({
      backgroundColor: "#fafafa",
      borderRadius: "8px",
    });
  });

  it("row layout has row styling (smaller border radius)", () => {
    render(<InFeedAd adSlot="1234567890" layout="row" />);

    const wrapper = screen.getByTestId("in-feed-ad");
    expect(wrapper).toHaveStyle({
      backgroundColor: "#fafafa",
      borderRadius: "4px",
    });
  });

  it("passes rootMargin to inner AdContainer", () => {
    render(<InFeedAd adSlot="1234567890" rootMargin="500px" />);

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "500px",
      })
    );
  });

  it("uses rectangle format for card layout", () => {
    render(<InFeedAd adSlot="1234567890" layout="card" />);

    const container = screen.getByTestId("in-feed-ad-container");
    // Rectangle format sets specific min dimensions
    expect(container).toHaveStyle({ minHeight: "280px" });
  });

  it("uses horizontal format for row layout", () => {
    render(<InFeedAd adSlot="1234567890" layout="row" />);

    const container = screen.getByTestId("in-feed-ad-container");
    expect(container).toHaveStyle({ minHeight: "100px" });
  });
});
