export const AD_CONFIG = {
  debug: import.meta.env.VITE_ADS_DEBUG_MODE === "true",
  clientId: "ca-pub-8976874751886843",
  slots: {
    templatesIncontent: "6343391269",
    carouselInfeed: "3806186822",
    sideRailLeft: "2941074550",
    sideRailRight: "4121894901",
    myresumesIncontent: "1958765996",
    mobileTop: "2808813237",
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
