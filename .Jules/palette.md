## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-05-24 - Inline List Control Accessibility
**Learning:** Inline removal/addition controls inside dynamically mapped lists (e.g., experience bullets) often lose default browser focus outlines due to custom Tailwind padding/colors, making keyboard navigation difficult.
**Action:** Explicitly add `focus-visible:outline-none focus-visible:ring-2` (using `ring-red-500` for destructive, `ring-accent` for additive) with `ring-offset-1` to ensure consistent keyboard focus visibility. Add `type="button"` to prevent accidental form submission and `aria-label` for screen readers on icon-only or generic symbol buttons (like `✕`).
