import { ReactNode } from "react";
import { AD_CONFIG } from "../../config/ads";
import { AdContainer } from "./AdContainer";
import { InContentAd } from "./InContentAd";
import { isExplicitAdsEnabled } from "./adUtils";

interface SideRailLayoutProps {
  children: ReactNode;
  /** Disable side rails (e.g. on editor pages) */
  enabled?: boolean;
}

/**
 * Flex layout wrapper that renders sticky ad rails on both sides of the content.
 *
 * - Rails are 160px wide (standard skyscraper), hidden below the `2xl` breakpoint (1536px).
 * - Sticky positioning keeps the ad visible while scrolling, stopping at the parent boundary
 *   so it never overlaps the footer.
 * - When disabled or when explicit ads are off (and not in debug mode), renders children
 *   directly with zero extra DOM.
 */
export const SideRailLayout = ({
  children,
  enabled = true,
}: SideRailLayoutProps) => {
  const explicitAdsEnabled = isExplicitAdsEnabled();
  const showRails = enabled && (explicitAdsEnabled || AD_CONFIG.debug);

  if (!showRails) {
    return <>{children}</>;
  }

  return (
    <div className="flex justify-center gap-6">
      {/* Left rail */}
      <aside className="hidden 2xl:block w-[160px] flex-shrink-0" aria-label="Left advertisement">
        <div className="sticky top-[88px]">
          <AdContainer
            adSlot={AD_CONFIG.slots.sideRailLeft}
            adFormat="vertical"
            minHeight={600}
            minWidth={160}
            testId="side-rail-left"
          />
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 min-w-0">
        {/* Mobile-top ad — visible below md, compensates for hidden side rails */}
        <div className="block md:hidden">
          <InContentAd
            adSlot={AD_CONFIG.slots.mobileTop}
            size="small"
            marginY={16}
          />
        </div>
        {children}
      </div>

      {/* Right rail */}
      <aside className="hidden 2xl:block w-[160px] flex-shrink-0" aria-label="Right advertisement">
        <div className="sticky top-[88px]">
          <AdContainer
            adSlot={AD_CONFIG.slots.sideRailRight}
            adFormat="vertical"
            minHeight={600}
            minWidth={160}
            testId="side-rail-right"
          />
        </div>
      </aside>
    </div>
  );
};

export default SideRailLayout;
