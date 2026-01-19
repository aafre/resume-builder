import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AdContainer } from "../components/ads/AdContainer";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  // Reset mocks
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockIntersectionObserver.mockClear();

  // Setup IntersectionObserver mock
  mockIntersectionObserver.mockImplementation((callback) => {
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    };
  });
  window.IntersectionObserver = mockIntersectionObserver;

  // Setup adsbygoogle mock
  window.adsbygoogle = [];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("AdContainer", () => {
  it("renders ad container with correct test id", () => {
    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    expect(screen.getByTestId("test-ad")).toBeInTheDocument();
  });

  it("applies minimum height for CLS prevention", () => {
    render(<AdContainer adSlot="1234567890" minHeight={300} testId="test-ad" />);

    const container = screen.getByTestId("test-ad");
    expect(container).toHaveStyle({ minHeight: "300px" });
  });

  it("applies minimum width when provided", () => {
    render(
      <AdContainer adSlot="1234567890" minWidth={200} testId="test-ad" />
    );

    const container = screen.getByTestId("test-ad");
    expect(container).toHaveStyle({ minWidth: "200px" });
  });

  it("sets up IntersectionObserver on mount", () => {
    render(<AdContainer adSlot="1234567890" />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "200px",
        threshold: 0,
      })
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it("uses custom rootMargin for IntersectionObserver", () => {
    render(<AdContainer adSlot="1234567890" rootMargin="400px" />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "400px",
      })
    );
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<AdContainer adSlot="1234567890" />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("renders nothing when enabled is false", () => {
    render(<AdContainer adSlot="1234567890" enabled={false} testId="test-ad" />);

    expect(screen.queryByTestId("test-ad")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <AdContainer adSlot="1234567890" className="custom-class" testId="test-ad" />
    );

    const container = screen.getByTestId("test-ad");
    expect(container).toHaveClass("custom-class");
    expect(container).toHaveClass("ad-container");
  });

  it("applies custom styles", () => {
    render(
      <AdContainer
        adSlot="1234567890"
        style={{ padding: "20px" }}
        testId="test-ad"
      />
    );

    const container = screen.getByTestId("test-ad");
    expect(container).toHaveStyle({ padding: "20px" });
  });

  it("has accessible aria-label", () => {
    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    const container = screen.getByTestId("test-ad");
    expect(container).toHaveAttribute("aria-label", "Advertisement");
  });

  it("renders fallback content when provided and ad not loaded", () => {
    render(
      <AdContainer
        adSlot="1234567890"
        fallback={<div data-testid="fallback">Loading...</div>}
        testId="test-ad"
      />
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
  });

  it("pushes to adsbygoogle when visible", async () => {
    // Setup mock to trigger intersection immediately
    mockIntersectionObserver.mockImplementation((callback) => {
      // Simulate intersection
      setTimeout(() => {
        callback([{ isIntersecting: true }]);
      }, 0);
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      };
    });

    const pushSpy = vi.spyOn(window.adsbygoogle, "push");

    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith({});
    });
  });

  it("renders ins element with correct data attributes when visible", async () => {
    mockIntersectionObserver.mockImplementation((callback) => {
      setTimeout(() => {
        callback([{ isIntersecting: true }]);
      }, 0);
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      };
    });

    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    await waitFor(() => {
      const insElement = document.querySelector("ins.adsbygoogle");
      expect(insElement).toBeInTheDocument();
      expect(insElement).toHaveAttribute("data-ad-slot", "1234567890");
      expect(insElement).toHaveAttribute(
        "data-ad-client",
        "ca-pub-8976874751886843"
      );
    });
  });

  it("does not render ins element before becoming visible", () => {
    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    const insElement = document.querySelector("ins.adsbygoogle");
    expect(insElement).not.toBeInTheDocument();
  });
});
