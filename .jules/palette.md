## 2024-06-01 - Accessible custom modal close buttons
**Learning:** Custom modal close buttons (e.g. `MdClose` wrapper) without explicit focus outlines fail accessibility standard, even when they have a hover state.
**Action:** Always add explicit `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`, `type="button"`, and `aria-label` to custom modal close icon-buttons to ensure keyboard navigation is visible and screen readers are informed.
