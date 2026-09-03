## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-05-20 - Focus Management in Confirmation Dialogs
**Learning:** In destructive confirmation dialogs, placing autoFocus on the safe cancellation action prevents accidental destructive actions by keyboard users. Also, custom Tailwind buttons often lose default browser focus outlines and require explicit focus-visible utilities.
**Action:** Always add autoFocus to the Cancel button and include focus-visible utilities on interactive elements in dialogs.
