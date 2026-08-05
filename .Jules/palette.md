## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-08-05 - Auto-focus Cancel on Destructive Actions
**Learning:** In destructive confirmation dialogs (like deleting a resume), immediately focusing on the safe "Cancel" button prevents users from accidentally triggering the destructive action if they hit "Enter" right after the dialog opens. Keyboard navigation focus styles are also crucial so users know what they are acting on.
**Action:** Always apply autoFocus={true} to the safe cancellation action in destructive dialogs, and ensure interactive elements have clear focus-visible utilities.
