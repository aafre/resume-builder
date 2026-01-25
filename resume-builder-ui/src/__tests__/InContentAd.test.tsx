import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { InContentAd } from "../components/ads/InContentAd";

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

describe("InContentAd", () => {
  it("renders wrapper with correct test id", () => {
    render(<InContentAd adSlot="1234567890" />);

    expect(screen.getByTestId("in-content-ad-wrapper")).toBeInTheDocument();
  });

  it("renders inner AdContainer with correct test id", () => {
    render(<InContentAd adSlot="1234567890" />);

    expect(screen.getByTestId("in-content-ad")).toBeInTheDocument();
  });

  it("applies default vertical margins", () => {
    render(<InContentAd adSlot="1234567890" />);

    const wrapper = screen.getByTestId("in-content-ad-wrapper");
    expect(wrapper).toHaveStyle({
      marginTop: "24px",
      marginBottom: "24px",
    });
  });

  it("applies custom vertical margins", () => {
    render(<InContentAd adSlot="1234567890" marginY={48} />);

    const wrapper = screen.getByTestId("in-content-ad-wrapper");
    expect(wrapper).toHaveStyle({
      marginTop: "48px",
      marginBottom: "48px",
    });
  });

  it("does not show label by default", () => {
    render(<InContentAd adSlot="1234567890" />);

    expect(screen.queryByText("Advertisement")).not.toBeInTheDocument();
  });

  it("shows label when showLabel is true", () => {
    render(<InContentAd adSlot="1234567890" showLabel />);

    expect(screen.getByText("Advertisement")).toBeInTheDocument();
  });

  it("renders nothing when enabled is false", () => {
    render(<InContentAd adSlot="1234567890" enabled={false} />);

    expect(
      screen.queryByTestId("in-content-ad-wrapper")
    ).not.toBeInTheDocument();
  });

  it("applies standard size by default (250px min-height)", () => {
    render(<InContentAd adSlot="1234567890" />);

    const container = screen.getByTestId("in-content-ad");
    expect(container).toHaveStyle({ minHeight: "250px" });
  });

  it("applies small size (100px min-height)", () => {
    render(<InContentAd adSlot="1234567890" size="small" />);

    const container = screen.getByTestId("in-content-ad");
    expect(container).toHaveStyle({ minHeight: "100px" });
  });

  it("applies large size (400px min-height)", () => {
    render(<InContentAd adSlot="1234567890" size="large" />);

    const container = screen.getByTestId("in-content-ad");
    expect(container).toHaveStyle({ minHeight: "400px" });
  });

  it("applies custom className to wrapper", () => {
    render(<InContentAd adSlot="1234567890" className="my-custom-ad" />);

    const wrapper = screen.getByTestId("in-content-ad-wrapper");
    expect(wrapper).toHaveClass("my-custom-ad");
    expect(wrapper).toHaveClass("in-content-ad");
  });

  it("applies custom styles to wrapper", () => {
    render(
      <InContentAd
        adSlot="1234567890"
        style={{ padding: "16px", backgroundColor: "#f0f0f0" }}
      />
    );

    const wrapper = screen.getByTestId("in-content-ad-wrapper");
    expect(wrapper).toHaveStyle({
      padding: "16px",
      backgroundColor: "#f0f0f0",
    });
  });

  it("passes rootMargin to AdContainer", () => {
    render(<InContentAd adSlot="1234567890" rootMargin="300px" />);

    // Verify IntersectionObserver was called with custom rootMargin
    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "300px",
      })
    );
  });
});
