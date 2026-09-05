## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2023-10-24 - Focus states and autoFocus for Confirm Dialogs
**Learning:** `ResponsiveConfirmDialog` handles destructive actions but initially lacked `autoFocus` on the safe 'Cancel' button and lacked `focus-visible` UI rings. This could lead to accidental destructive actions and makes keyboard navigation difficult.
**Action:** Always include `autoFocus` on safe cancellation actions in dialogs, and ensure custom buttons have appropriate `focus-visible` utility classes to clearly indicate keyboard focus.
