import { CSSProperties, useState, useCallback } from "react";
import { AdContainer, AdContainerProps } from "./AdContainer";

export interface InContentAdProps
  extends Omit<AdContainerProps, "adFormat" | "minHeight"> {
  /**
   * Vertical margin around the ad (in pixels)
   * Default: 24 (1.5rem)
   */
  marginY?: number;
  /**
   * Whether to show a subtle label above the ad
   * Default: false (AdSense handles labeling)
   */
  showLabel?: boolean;
  /**
   * Size variant for the ad
   * - "standard": 250px min-height (default)
   * - "large": 400px min-height
   * - "small": 100px min-height (for narrow placements)
   */
  size?: "small" | "standard" | "large";
}

/**
 * In-content ad component for placing ads within article/page content.
 *
 * Best used for:
 * - Below hero sections on landing pages
 * - Between content sections on long pages
 * - After main content on short pages
 *
 * Placement guidelines:
 * - Keep first ad **below initial viewport** to protect LCP
 * - Use at least 600px content before first ad
 * - Maximum 3 in-content ads per page
 *
 * @example
 * ```tsx
 * // Below hero section on landing page
 * <InContentAd adSlot="1234567890" marginY={32} />
 *
 * // After content section
 * <section>Content here...</section>
 * <InContentAd adSlot="1234567890" size="standard" />
 * ```
 */
export const InContentAd = ({
  adSlot,
  marginY = 24,
  showLabel = false,
  size = "standard",
  className = "",
  style,
  enabled = true,
  ...rest
}: InContentAdProps) => {
  const [hidden, setHidden] = useState(false);
  const handleUnfilled = useCallback(() => setHidden(true), []);

  if (!enabled) {
    return null;
  }

  const minHeightMap = {
    small: 100,
    standard: 250,
    large: 400,
  };

  const containerStyle: CSSProperties = {
    marginTop: hidden ? 0 : `${marginY}px`,
    marginBottom: hidden ? 0 : `${marginY}px`,
    maxHeight: hidden ? 0 : undefined,
    opacity: hidden ? 0 : 1,
    overflow: "hidden",
    transition:
      "margin 300ms ease, max-height 300ms ease, opacity 300ms ease",
    ...style,
  };

  return (
    <div
      className={`in-content-ad ${className}`}
      style={containerStyle}
      data-testid="in-content-ad-wrapper"
    >
      {showLabel && !hidden && (
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#6b7280",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Advertisement
        </div>
      )}
      <AdContainer
        adSlot={adSlot}
        adFormat="auto"
        minHeight={minHeightMap[size]}
        testId="in-content-ad"
        enabled={enabled}
        onUnfilled={handleUnfilled}
        {...rest}
      />
    </div>
  );
};

export default InContentAd;
