## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2023-10-24 - autoFocus on safe actions in destructive dialogs
**Learning:** Users can accidentally trigger destructive actions (like Delete) if the confirmation button is focused by default and they press 'Enter' too quickly when the dialog mounts.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in destructive confirmation dialogs to prevent accidental data loss.
