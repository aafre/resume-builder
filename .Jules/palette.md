## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-18 - Accessibility focus trap for destructive dialogs
**Learning:** In destructive confirmation dialogs (like `ResponsiveConfirmDialog`), it's dangerous if the focus isn't trapped or managed. If a user presses 'Enter' quickly, they could accidentally trigger the destructive action. Placing `autoFocus` on the safe cancellation action (e.g., 'Cancel') ensures that an accidental keystroke doesn't lead to unintended data loss.
**Action:** Add `autoFocus` to the Cancel button in `ResponsiveConfirmDialog` to provide a safer default focus state.
