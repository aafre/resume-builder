## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-01-01 - Add keyboard focus rings to custom modals
**Learning:** Custom interactive components like `ResponsiveConfirmDialog` may overlook native-like keyboard focus indicators (`focus-visible`) despite having mouse hover states. Specifically, buttons handling destructive actions didn't offer a visual indication to keyboard-navigating users.
**Action:** When creating or refining custom modals/dialogs, enforce adding explicit `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2` (or red ring for destructive confirm actions) to all clickable targets (Close icons, Cancel/Confirm buttons) to guarantee screen-reader and keyboard accessibility parity.
