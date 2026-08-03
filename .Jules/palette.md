## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Accessible Buttons in Dialogs
**Learning:** Buttons in custom dialogs often lack visible focus states, which impairs keyboard accessibility. Destructive actions in dialogs need safe cancellation paths; adding `autoFocus` to the Cancel button prevents accidental confirmation on component mount.
**Action:** Always add `focus-visible` utilities to buttons in dialogs to ensure visual focus indicators, and apply `autoFocus` to the cancellation action in destructive confirmation dialogs.
