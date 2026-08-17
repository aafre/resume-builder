## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2023-10-24 - AutoFocus and Focus-Visible on Destructive Dialogs
**Learning:** In destructive confirmation dialogs, users can accidentally trigger the destructive action (e.g. by pressing Enter) if the default focus is not managed. Furthermore, custom Tailwind buttons often lose default browser focus outlines.
**Action:** Always place `autoFocus={isDestructive}` on the safe cancellation action (like the 'Cancel' button) in destructive dialogs, and explicitly include `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` to ensure clear visual indicators for keyboard navigation.

## 2023-10-24 - AutoFocus and Focus-Visible on Destructive Dialogs
**Learning:** In destructive confirmation dialogs, users can accidentally trigger the destructive action (e.g. by pressing Enter) if the default focus is not managed. Furthermore, custom Tailwind buttons often lose default browser focus outlines.
**Action:** Always place `autoFocus={isDestructive}` on the safe cancellation action (like the 'Cancel' button) in destructive dialogs, and explicitly include `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` to ensure clear visual indicators for keyboard navigation.
