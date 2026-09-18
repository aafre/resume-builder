## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2025-02-14 - Keyboard accessibility in destructive dialogs
**Learning:** Destructive confirmation dialogs must have `autoFocus` on the safe cancellation action to prevent accidental deletions on keyboard 'Enter'. Furthermore, ensuring standard `focus-visible` utility classes are applied guarantees screen reader/keyboard users have a clear visual focus indicator without breaking mouse/touch aesthetics.
**Action:** Always ensure `autoFocus` targets the safe action in destructive prompts, and explicitly define `focus-visible` styles for all custom buttons.
