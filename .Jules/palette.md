## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Keyboard Accessibility in Destructive Dialogs
**Learning:** Destructive dialogs without auto-focus on the cancel action can lead to accidental data loss if a user presses Enter. Additionally, custom styled buttons often lose default browser focus outlines.
**Action:** Always add `autoFocus` to the safe cancel action in destructive dialogs and explicitly include `focus-visible` utilities to ensure safe keyboard navigation and clear focus states.
