## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-03-20 - Safe Default Focus in Destructive Dialogs
**Learning:** In destructive confirmation dialogs (like deleting a resume), users can accidentally trigger the destructive action by pressing 'Enter' immediately after the dialog mounts if the default focus is not managed.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in confirmation dialogs, and ensure all buttons have explicit `focus-visible` styling for clear keyboard navigation indicators.
