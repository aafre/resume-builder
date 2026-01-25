import { CSSProperties } from "react";
import { AdContainer, AdContainerProps } from "./AdContainer";
import { isExplicitAdsEnabled } from "./adUtils";

export interface InFeedAdProps
  extends Omit<AdContainerProps, "adFormat" | "minHeight" | "minWidth"> {
  /**
   * Layout variant matching the feed's card design
   * - "card": Matches typical card layouts (default)
   * - "row": Matches horizontal list items
   */
  layout?: "card" | "row";
  /**
   * Optional custom dimensions to match feed item sizes
   */
  dimensions?: {
    width?: string | number;
    height?: string | number;
  };
}

/**
 * In-feed ad component for placing native ads within gallery/list layouts.
 *
 * Best used for:
 * - Template galleries (every 6-8 cards)
 * - Blog post listings (every 6-8 posts)
 * - Any grid or list of repeating items
 *
 * Policy guidelines:
 * - Never show ad before first 4 cards in a grid
 * - Maintain consistent spacing with other feed items
 * - Ad should visually match the surrounding content style
 *
 * @example
 * ```tsx
 * // In a template grid
 * {templates.map((template, index) => (
 *   <>
 *     <TemplateCard key={template.id} {...template} />
 *     {(index + 1) % 6 === 0 && index >= 3 && (
 *       <InFeedAd key={`ad-${index}`} adSlot="1234567890" layout="card" />
 *     )}
 *   </>
 * ))}
 * ```
 */
export const InFeedAd = ({
  adSlot,
  layout = "card",
  dimensions,
  className = "",
  style,
  enabled = true,
  ...rest
}: InFeedAdProps) => {
  const explicitAdsEnabled = isExplicitAdsEnabled();

  // Return null early if ads are disabled - don't render the wrapper div
  if (!enabled || !explicitAdsEnabled) {
    return null;
  }

  const layoutStyles: Record<typeof layout, CSSProperties> = {
    card: {
      minHeight: "280px",
      minWidth: "250px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fafafa",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    row: {
      minHeight: "100px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fafafa",
      borderRadius: "4px",
      border: "1px solid #e5e7eb",
    },
  };

  const containerStyle: CSSProperties = {
    ...layoutStyles[layout],
    ...(dimensions?.width && {
      width:
        typeof dimensions.width === "number"
          ? `${dimensions.width}px`
          : dimensions.width,
    }),
    ...(dimensions?.height && {
      height:
        typeof dimensions.height === "number"
          ? `${dimensions.height}px`
          : dimensions.height,
    }),
    ...style,
  };

  const minHeight = layout === "card" ? 280 : 100;
  const minWidth = layout === "card" ? 250 : undefined;

  return (
    <div
      className={`in-feed-ad in-feed-ad--${layout} ${className}`}
      style={containerStyle}
      data-testid="in-feed-ad"
      aria-label="Sponsored content"
    >
      <AdContainer
        adSlot={adSlot}
        adFormat={layout === "card" ? "rectangle" : "horizontal"}
        minHeight={minHeight}
        minWidth={minWidth}
        testId="in-feed-ad-container"
        enabled={enabled}
        {...rest}
      />
    </div>
  );
};

export default InFeedAd;
