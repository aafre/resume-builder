## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-05-18 - autoFocus on Safe Actions
**Learning:** In destructive confirmation dialogs (like `ResponsiveConfirmDialog`), users might accidentally press 'Enter' immediately after the dialog mounts, triggering the destructive action.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) to prevent users from accidentally triggering the destructive action and ensure the focus state is clearly visible.
