## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2023-10-24 - Safe Default Focus for Destructive Dialogs
**Learning:** In destructive confirmation dialogs (like `ResponsiveConfirmDialog`), if focus is not explicitly managed, users might accidentally trigger the destructive action by pressing 'Enter' immediately after the dialog mounts. Also, custom buttons often lose standard focus outlines.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in confirmation dialogs. Explicitly include focus-visible utilities (e.g., `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent`) on interactive elements to ensure clear visual indicators for keyboard navigation.
