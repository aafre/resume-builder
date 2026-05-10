## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-23 - Focus Outlines on Custom Controls
**Learning:** Custom inline removal/addition controls inside dynamically mapped lists often lose default browser focus outlines due to custom Tailwind padding and colors. This makes keyboard navigation difficult or impossible for screen readers.
**Action:** Always explicitly add `focus-visible:outline-none focus-visible:ring-2` (using `ring-red-500` for destructive actions and `ring-accent` for additive ones) with `ring-offset-1` to ensure consistent keyboard focus visibility on custom buttons.
