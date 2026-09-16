## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-05-24 - Focus Management in Destructive Confirmation Dialogs
**Learning:** In destructive confirmation dialogs (like deleting a resume or section), not explicitly managing initial focus can lead to accidental destructive actions if the user reflexively presses 'Enter'.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in destructive confirmation modals to ensure a safer, keyboard-accessible UX.
