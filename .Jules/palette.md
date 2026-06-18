## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Custom Clickable Cards Require Keyboard Accessibility
**Learning:** Custom interactive elements designed as cards or clickable block areas (such as `GhostCard`'s "Create New Resume" or `ResumeCard`'s thumbnail preview) often implement only `onClick` handlers. This creates a critical accessibility gap for keyboard navigation, as users cannot tab to or activate the action without a mouse, and screen readers fail to identify the element correctly.
**Action:** Always convert custom interactive components to accessible buttons by adding `role="button"`, `tabIndex={0}`, an `onKeyDown` handler for `Enter` and `Space` keys, and explicit focus indicators (e.g., `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`).
