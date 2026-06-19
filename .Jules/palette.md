## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-05-24 - Escape Key Support in Custom Modals
**Learning:** Custom interactive dialogs and modals (like `ResponsiveConfirmDialog`) must implement an `Escape` key event listener to conform with standard accessibility guidelines. Without it, keyboard users are forced to manually tab to the close button or cancel button, creating a frustrating and non-standard experience.
**Action:** Always implement a global or modal-scoped `keydown` listener for the `Escape` key that triggers the modal's `onClose` handler, and ensure it cleans up properly on unmount.
