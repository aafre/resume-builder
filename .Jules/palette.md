## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Accessible Close Buttons in Dialogs
**Learning:** Icon-only close buttons in custom modals (like `UploadResumeModal`) often miss `aria-label`, `type="button"`, and explicit focus styling, leading to an inaccessible keyboard and screen reader experience.
**Action:** Ensure all icon-only modal close buttons use `type="button"`, provide a descriptive `aria-label`, and include `focus-visible:outline-none focus-visible:ring-2` styling.
