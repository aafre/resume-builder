## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2026-07-15 - Modal Dialog Accessibility
**Learning:** Custom modal dialogs (like ResponsiveConfirmDialog) need explicit focus management. Adding `tabIndex={-1}` and auto-focusing on mount ensures screen readers announce the dialog. Additionally, handling the Escape key to close the dialog and ensuring visible focus states (`focus-visible:ring-2`) on custom buttons are critical for keyboard navigation.
**Action:** Always include focus trapping/auto-focus, Escape key event listeners, and visible focus rings when building custom modal or dialog components.
