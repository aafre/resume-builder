/**
 * Check if explicit ad placements are enabled via feature flag.
 * Default: disabled (Auto Ads only)
 */
export const isExplicitAdsEnabled = (): boolean =>
  import.meta.env.VITE_ENABLE_EXPLICIT_ADS === "true";
