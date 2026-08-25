## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2023-10-24 - ResponsiveConfirmDialog Cancel Autofocus
**Learning:** Destructive confirmation dialogs must have `autoFocus` on the safe, non-destructive action (Cancel) to prevent users from accidentally completing the destructive action by hitting 'Enter' right as the dialog mounts.
**Action:** Always ensure that destructive UI patterns (like `ResponsiveConfirmDialog`) auto-focus their safe cancellation paths and include proper `focus-visible` styling for keyboard navigation clarity.
