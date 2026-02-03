import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AdContainer } from "../components/ads/AdContainer";
import { AD_CONFIG } from "../config/ads";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

// Mock MutationObserver
let mutationCallback: MutationCallback;
const mockMutationObserve = vi.fn();
const mockMutationDisconnect = vi.fn();
const mockMutationObserver = vi.fn().mockImplementation((callback) => {
  mutationCallback = callback;
  return {
    observe: mockMutationObserve,
    disconnect: mockMutationDisconnect,
  };
});

beforeEach(() => {
  // Reset mocks
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockIntersectionObserver.mockClear();
  mockMutationObserve.mockClear();
  mockMutationDisconnect.mockClear();
  mockMutationObserver.mockClear();

  // Setup IntersectionObserver mock
  mockIntersectionObserver.mockImplementation((callback) => {
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    };
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.MutationObserver = mockMutationObserver;

  // Setup adsbygoogle mock
  window.adsbygoogle = [];

  // Enable explicit ads feature flag for tests
  vi.stubEnv("VITE_ENABLE_EXPLICIT_ADS", "true");
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
        AD_CONFIG.clientId
      );
    });
  });

  it("does not render ins element before becoming visible", () => {
    render(<AdContainer adSlot="1234567890" testId="test-ad" />);

    const insElement = document.querySelector("ins.adsbygoogle");
    expect(insElement).not.toBeInTheDocument();
  });

  describe("unfilled ad collapse", () => {
    const renderVisibleAd = async (props?: { onUnfilled?: () => void }) => {
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

      render(
        <AdContainer
          adSlot="1234567890"
          testId="test-ad"
          onUnfilled={props?.onUnfilled}
        />
      );

      // Wait for the ins element to render
      await waitFor(() => {
        expect(document.querySelector("ins.adsbygoogle")).toBeInTheDocument();
      });
    };

    it("sets up MutationObserver on the ins element when visible", async () => {
      await renderVisibleAd();

      expect(mockMutationObserver).toHaveBeenCalled();
      expect(mockMutationObserve).toHaveBeenCalledWith(
        expect.any(Element),
        { attributes: true, attributeFilter: ["data-ad-status"] }
      );
    });

    it("collapses container when data-ad-status is set to unfilled", async () => {
      await renderVisibleAd();

      const insElement = document.querySelector("ins.adsbygoogle")!;

      act(() => {
        insElement.setAttribute("data-ad-status", "unfilled");
        mutationCallback(
          [
            {
              type: "attributes",
              attributeName: "data-ad-status",
              target: insElement,
            } as unknown as MutationRecord,
          ],
          {} as MutationObserver
        );
      });

      const container = screen.getByTestId("test-ad");
      expect(container).toHaveStyle({ minHeight: "250px", opacity: "0" });
    });

    it("fires onUnfilled callback when ad is unfilled", async () => {
      const onUnfilled = vi.fn();
      await renderVisibleAd({ onUnfilled });

      const insElement = document.querySelector("ins.adsbygoogle")!;

      act(() => {
        insElement.setAttribute("data-ad-status", "unfilled");
        mutationCallback(
          [
            {
              type: "attributes",
              attributeName: "data-ad-status",
              target: insElement,
            } as unknown as MutationRecord,
          ],
          {} as MutationObserver
        );
      });

      expect(onUnfilled).toHaveBeenCalledTimes(1);
    });

    it("does not collapse when data-ad-status is filled", async () => {
      await renderVisibleAd();

      const insElement = document.querySelector("ins.adsbygoogle")!;

      act(() => {
        insElement.setAttribute("data-ad-status", "filled");
        mutationCallback(
          [
            {
              type: "attributes",
              attributeName: "data-ad-status",
              target: insElement,
            } as unknown as MutationRecord,
          ],
          {} as MutationObserver
        );
      });

      const container = screen.getByTestId("test-ad");
      expect(container).toHaveStyle({ minHeight: "250px", opacity: "1" });
    });

    it("collapses when mutation fires synchronously on observe", async () => {
      // MutationObserver mock that fires the callback synchronously during observe()
      // Note: The immediate getAttribute check in AdContainer (line 155) covers the
      // race condition where the attribute is set before the observer attaches, but
      // that path is not unit-testable because React effects run synchronously after
      // render — there's no gap to inject the attribute between <ins> mount and
      // the effect execution.
      window.MutationObserver = vi.fn().mockImplementation((callback: MutationCallback) => {
        return {
          observe: vi.fn().mockImplementation((el: HTMLElement) => {
            if (el && typeof el.setAttribute === "function") {
              el.setAttribute("data-ad-status", "unfilled");
              callback(
                [
                  {
                    type: "attributes",
                    attributeName: "data-ad-status",
                    target: el,
                  } as unknown as MutationRecord,
                ],
                {} as MutationObserver
              );
            }
          }),
          disconnect: mockMutationDisconnect,
        };
      });

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
        const container = screen.getByTestId("test-ad");
        expect(container).toHaveStyle({ minHeight: "250px", opacity: "0" });
      });
    });

    it("disconnects MutationObserver on unmount", async () => {
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

      const { unmount } = render(
        <AdContainer adSlot="1234567890" testId="test-ad" />
      );

      await waitFor(() => {
        expect(document.querySelector("ins.adsbygoogle")).toBeInTheDocument();
      });

      unmount();

      expect(mockMutationDisconnect).toHaveBeenCalled();
    });
  });
});
