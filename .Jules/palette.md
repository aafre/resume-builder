## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2025-02-14 - AutoFocus on Destructive Modals
**Learning:** Destructive actions (like Delete) in modals can be triggered accidentally if the user presses 'Enter' immediately after the modal mounts, especially if the destructive button is the default focus.
**Action:** Always place `autoFocus` on the safe cancellation action (e.g., the 'Cancel' button) in destructive confirmation dialogs to prevent unintended data loss and improve accessibility.
