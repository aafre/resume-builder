## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - AutoFocus on Cancel Button for Destructive Confirmation Dialogs
**Learning:** In destructive confirmation dialogs, always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) to prevent users from accidentally triggering the destructive action by pressing 'Enter' immediately after the dialog mounts.
**Action:** Add `autoFocus` to the cancellation button in `ResponsiveConfirmDialog`.
