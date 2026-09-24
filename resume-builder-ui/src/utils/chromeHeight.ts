/**
 * The height of the app's fixed top chrome, read from the CSS custom properties
 * that size it.
 *
 * There used to be three independent opinions about this number: the CSS vars
 * (64 / 72), a `|| 72` fallback in SectionNavigator that measured the DOM on a
 * `MutationObserver` watching the whole body, and a bare `-100` scroll offset in
 * useSectionNavigation that matched neither. Anything that offsets against the
 * header reads this instead. See DESIGN.md, Layout: "anything that needs to
 * offset against chrome reads these rather than hardcoding a number".
 */

const MOBILE_BREAKPOINT = 640; // Tailwind `sm:`, where the header steps up

/** Reads a px-valued CSS custom property off :root, with a fallback. */
function readPxVar(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Height of the sticky header at the current viewport width.
 *
 * `extraChrome` covers anything stacked above the header that is NOT a fixed
 * height — in practice the dev-environment banner, which exists only outside
 * production. Callers that can observe such an element pass its measured height.
 */
export function chromeHeight(extraChrome = 0): number {
  if (typeof window === "undefined") return 72 + extraChrome;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  return (
    readPxVar(
      isMobile ? "--header-height-mobile" : "--header-height-desktop",
      isMobile ? 64 : 72
    ) + extraChrome
  );
}
