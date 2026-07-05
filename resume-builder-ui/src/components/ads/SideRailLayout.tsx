import { ReactNode } from "react";
import { AD_CONFIG, isExplicitAdsEnabled } from "../../config/ads";
import { AdContainer } from "./AdContainer";
import { InContentAd } from "./InContentAd";

interface SideRailLayoutProps {
  children: ReactNode;
  /** Disable side rails (e.g. on editor pages) */
  enabled?: boolean;
  /** Hide the global mobile-top ad (e.g. landing page renders its own below the hero) */
  showMobileTop?: boolean;
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
  showMobileTop = true,
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
        {showMobileTop && (
          <div className="block md:hidden">
            <InContentAd
              adSlot={AD_CONFIG.slots.mobileTop}
              size="large" // "large" (400px) reserves enough for the ~375px mobile fill — prevents CLS
              marginY={16}
            />
          </div>
        )}
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
