## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-03-24 - Accessibility: Focus Management in Destructive Dialogs
**Learning:** In destructive confirmation dialogs (like `ResponsiveConfirmDialog`), it is crucial to place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button). This prevents users from accidentally triggering the destructive action by pressing 'Enter' immediately after the dialog mounts. Additionally, custom buttons often lack visible focus states.
**Action:** Always add `autoFocus` to the non-destructive action in confirmation dialogs and ensure explicit `focus-visible` styles are added to all interactive elements for keyboard accessibility.
