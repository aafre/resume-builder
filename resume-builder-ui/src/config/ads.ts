export const AD_CONFIG = {
  debug: import.meta.env.VITE_ADS_DEBUG_MODE === "true",
  clientId: "ca-pub-8976874751886843",
  slots: {
    landingIncontent: "1232650916",
    freepageIncontent: "3994545622",
    templatesIncontent: "6343391269",
    keywordsIncontent: "9055300614",
    blogInfeed: "7742218947",
    carouselInfeed: "3806186822",
    editorSidebar: "3691293294",
    sideRailLeft: "TODO_SIDE_RAIL_LEFT",
    sideRailRight: "TODO_SIDE_RAIL_RIGHT",
    blogIncontent: "TODO_BLOG_INCONTENT",
    myresumesIncontent: "TODO_MYRESUMES_INCONTENT",
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
