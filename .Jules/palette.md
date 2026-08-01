## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-08-01 - Focus Safe Actions in Destructive Dialogs
**Learning:** In destructive confirmation dialogs, users can accidentally trigger the destructive action by pressing 'Enter' if the modal automatically receives generic focus or defaults to the primary action.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in destructive dialogs (like `ResponsiveConfirmDialog`) to prevent accidental data loss. Ensure the focused element has clear `focus-visible` styling.
