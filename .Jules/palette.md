## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - ResponsiveConfirmDialog UX & Accessibility Polish
**Learning:** The `ResponsiveConfirmDialog` handles destructive actions but missed two key patterns: 1) It lacked visible focus rings, making keyboard navigation difficult, and 2) the safest action (cancel) wasn't automatically focused on open. This means a user could accidentally trigger a destructive action just by pressing 'Enter' if the trigger button originally held focus.
**Action:** Always place `autoFocus` on the safe, cancellation action in confirmation dialogs. Also ensure all interactive dialog elements have `focus-visible` styles to clearly indicate keyboard focus.
