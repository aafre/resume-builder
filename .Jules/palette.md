## 2026-02-19 - Consistent Destructive Actions
**Learning:** Users rely on consistent visual cues for destructive actions. Inconsistent hover states (e.g., one button showing a red background on hover, another showing nothing) degrade trust and usability.
**Action:** Standardized all "remove item" buttons to use `text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors` pattern. Always ensure `aria-label` is present for icon-only buttons.
