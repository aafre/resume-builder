import { useEffect, useRef, useState, useCallback, CSSProperties, ReactNode } from "react";
import { AD_CONFIG, AD_SLOT_NAMES, isExplicitAdsEnabled } from "../../config/ads";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export interface AdContainerProps {
  /**
   * AdSense ad slot ID
   */
  adSlot: string;
  /**
   * Ad format - responsive or fixed dimensions
   */
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  /**
   * Minimum height for the ad container to prevent CLS
   */
  minHeight?: number;
  /**
   * Minimum width for the ad container
   */
  minWidth?: number;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Additional inline styles
   */
  style?: CSSProperties;
  /**
   * Root margin for IntersectionObserver (how early to start loading)
   * Default: "200px" - starts loading when ad is 200px from viewport
   */
  rootMargin?: string;
  /**
   * Test ID for testing
   */
  testId?: string;
  /**
   * Fallback content to show while ad is loading or if it fails
   */
  fallback?: ReactNode;
  /**
   * Whether the ad is enabled (useful for conditional rendering)
   */
  enabled?: boolean;
  /**
   * Callback fired when AdSense marks the ad slot as unfilled
   */
  onUnfilled?: () => void;
}

/**
 * Base ad container component with CLS prevention and lazy loading.
 *
 * Features:
 * - Reserved space via min-height/min-width to prevent Cumulative Layout Shift (CLS)
 * - Lazy loading with IntersectionObserver to defer ad loading until near viewport
 * - Proper AdSense integration with window.adsbygoogle.push()
 *
 * @example
 * ```tsx
 * <AdContainer
 *   adSlot="1234567890"
 *   adFormat="auto"
 *   minHeight={250}
 *   rootMargin="200px"
 * />
 * ```
 */
export const AdContainer = ({
  adSlot,
  adFormat = "auto",
  minHeight = 250,
  minWidth,
  className = "",
  style,
  rootMargin = "200px",
  testId = "ad-container",
  fallback,
  enabled = true,
  onUnfilled,
}: AdContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adUnfilled, setAdUnfilled] = useState(false);
  const adPushed = useRef<string | null>(null);

  const handleUnfilled = useCallback(() => {
    setAdUnfilled(true);
    onUnfilled?.();
  }, [onUnfilled]);

  const explicitAdsEnabled = isExplicitAdsEnabled();

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, enabled]);

  // Push ad to AdSense when visible
  useEffect(() => {
    if (!isVisible || adPushed.current === adSlot || !enabled) return;

    // Check if AdSense script is available
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
        adPushed.current = adSlot;
        setAdLoaded(true);
      } catch {
        // AdSense push failed - likely ad blocker or script not loaded
        console.debug("AdSense push failed - ad may be blocked");
      }
    }
  }, [isVisible, enabled, adSlot]);

  // Watch for AdSense setting data-ad-status="unfilled" on the <ins> element
  useEffect(() => {
    const insEl = insRef.current;
    if (!insEl || !enabled) return;

    // Check immediately in case the attribute was set before the observer attached
    if (insEl.getAttribute("data-ad-status") === "unfilled") {
      handleUnfilled();
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-ad-status" &&
          insEl.getAttribute("data-ad-status") === "unfilled"
        ) {
          handleUnfilled();
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(insEl, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => observer.disconnect();
  }, [isVisible, enabled, handleUnfilled]);

  if (!enabled || (!explicitAdsEnabled && !AD_CONFIG.debug)) {
    return null;
  }

  if (AD_CONFIG.debug && !explicitAdsEnabled) {
    const slotName = AD_SLOT_NAMES[adSlot] ?? adSlot;
    const isFullWidth = adFormat === "horizontal" || adFormat === "auto";
    return (
      <div
        ref={containerRef}
        className={`ad-container ${className}`}
        style={{
          minHeight: `${minHeight}px`,
          ...(minWidth && { minWidth: `${minWidth}px` }),
          ...(isFullWidth && { width: "100%" }),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fce4ec",
          border: "2px dashed #e91e63",
          borderRadius: "6px",
          overflow: "hidden",
          ...style,
        }}
        data-testid={testId}
        role="complementary"
        aria-label="Advertisement (debug)"
      >
        <span
          style={{
            color: "#e91e63",
            fontWeight: 700,
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          [{slotName}]
        </span>
      </div>
    );
  }

  const containerStyle: CSSProperties = {
    minHeight: `${minHeight}px`,
    ...(minWidth && !adUnfilled && { minWidth: `${minWidth}px` }),
    display: "block",
    textAlign: "center",
    overflow: "hidden",
    opacity: adUnfilled ? 0 : 1,
    transition: "opacity 300ms ease",
    ...style,
  };

  // Determine data-ad-format based on adFormat prop
  const getAdLayoutProps = () => {
    switch (adFormat) {
      case "rectangle":
        return {
          "data-ad-format": "rectangle",
          style: { display: "inline-block", width: "336px", height: "280px" },
        };
      case "horizontal":
        return {
          "data-ad-format": "horizontal",
          "data-full-width-responsive": "true",
        };
      case "vertical":
        return {
          "data-ad-format": "vertical",
        };
      case "auto":
      default:
        return {
          "data-ad-format": "auto",
          "data-full-width-responsive": "true",
        };
    }
  };

  const adLayoutProps = getAdLayoutProps();

  return (
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={containerStyle}
      data-testid={testId}
      role="complementary"
      aria-label="Advertisement"
    >
      {!adLoaded && fallback}
      {isVisible && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", ...adLayoutProps.style }}
          data-ad-client={AD_CONFIG.clientId}
          data-ad-slot={adSlot}
          {...adLayoutProps}
        />
      )}
    </div>
  );
};

export default AdContainer;
