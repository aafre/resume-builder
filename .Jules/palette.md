## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-29 - Focus states for interactive components
**Learning:** Custom Tailwind buttons (especially in reusable components like ResponsiveConfirmDialog) can lose default browser focus outlines. This breaks keyboard accessibility on critical destructive flows.
**Action:** Always explicitly include `focus-visible:outline-none focus-visible:ring-2` (and optionally `focus-visible:ring-offset-2`) utilities with appropriate colors when creating interactive elements or custom buttons to ensure clear visual indicators for keyboard users.
