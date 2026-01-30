export const AD_CONFIG = {
  debug: true, // Toggle to see ad placements. Remove when done.
  clientId: "ca-pub-8976874751886843",
  slots: {
    landingIncontent: "1232650916",
    freepageIncontent: "3994545622",
    templatesIncontent: "6343391269",
    keywordsIncontent: "9055300614",
    blogInfeed: "7742218947",
    carouselInfeed: "3806186822",
    editorSidebar: "3691293294",
  },
} as const;

/** Reverse lookup: slot ID → human-readable name (for debug labels) */
export const AD_SLOT_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(AD_CONFIG.slots).map(([name, id]) => [id, name])
);

/**
 * Check if explicit ad placements are enabled via feature flag.
 * Default: disabled (Auto Ads only)
 */
export const isExplicitAdsEnabled = (): boolean =>
  import.meta.env.VITE_ENABLE_EXPLICIT_ADS === "true";
