## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-27 - Focus indicators for Interactive Icon Buttons
**Learning:** Custom Tailwind interactive elements (like icon buttons for delete, remove, etc.) frequently lack explicit visual focus indicators in this application's forms, hiding their focus state from keyboard users.
**Action:** When adding or updating custom interactive UI components (especially icon-only buttons), ensure that `focus-visible:outline-none` combined with `focus-visible:ring-2` (and `ring-offset`) utilities are consistently applied.
