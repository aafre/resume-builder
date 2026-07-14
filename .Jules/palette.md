## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-14 - Dialog Accessibility Enhancement
**Learning:** Custom modal containers lack standard keyboard navigation and focus management hooks by default.
**Action:** Ensure custom dialogs implement auto-focus on mount with `tabIndex={-1}`, and handle the `Escape` key via a `keydown` event listener to ensure proper screen reader compatibility and keyboard navigation.
