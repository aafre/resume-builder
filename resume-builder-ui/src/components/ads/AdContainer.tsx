import { useEffect, useRef, useState, CSSProperties, ReactNode } from "react";

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
}: AdContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const adPushed = useRef<string | null>(null);

  // Feature flag for explicit ad placements (default: disabled, Auto Ads only)
  const explicitAdsEnabled =
    import.meta.env.VITE_ENABLE_EXPLICIT_ADS === "true";

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

  if (!enabled || !explicitAdsEnabled) {
    return null;
  }

  const containerStyle: CSSProperties = {
    minHeight: `${minHeight}px`,
    ...(minWidth && { minWidth: `${minWidth}px` }),
    display: "block",
    textAlign: "center",
    overflow: "hidden",
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
      aria-label="Advertisement"
    >
      {!adLoaded && fallback}
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", ...adLayoutProps.style }}
          data-ad-client="ca-pub-8976874751886843"
          data-ad-slot={adSlot}
          {...adLayoutProps}
        />
      )}
    </div>
  );
};

export default AdContainer;
