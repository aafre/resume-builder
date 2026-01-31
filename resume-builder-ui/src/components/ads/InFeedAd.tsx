import { CSSProperties, useState, useCallback } from "react";
import { AdContainer, AdContainerProps } from "./AdContainer";

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
  const [hidden, setHidden] = useState(false);
  const handleUnfilled = useCallback(() => setHidden(true), []);

  if (!enabled) {
    return null;
  }

  const layoutStyles: Record<typeof layout, CSSProperties> = {
    card: {
      minHeight: hidden ? "0px" : "280px",
      minWidth: hidden ? "0px" : "250px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hidden ? "transparent" : "#fafafa",
      borderRadius: "8px",
      border: hidden ? "none" : "1px solid #e5e7eb",
    },
    row: {
      minHeight: hidden ? "0px" : "100px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: hidden ? "transparent" : "#fafafa",
      borderRadius: "4px",
      border: hidden ? "none" : "1px solid #e5e7eb",
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
    opacity: hidden ? 0 : 1,
    overflow: "hidden",
    transition:
      "min-height 300ms ease, min-width 300ms ease, opacity 300ms ease, background-color 300ms ease, border 300ms ease",
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
        adFormat={layout === "card" ? "rectangle" : "auto"}
        minHeight={minHeight}
        minWidth={minWidth}
        testId="in-feed-ad-container"
        enabled={enabled}
        onUnfilled={handleUnfilled}
        {...rest}
      />
    </div>
  );
};

export default InFeedAd;
