## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Custom Modal Accessibility
**Learning:** Custom modals (like `DuplicateResumeModal`) must include standard accessibility attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) and keyboard event handlers (such as listening for the `Escape` key) to ensure they behave predictably for keyboard and screen reader users.
**Action:** Always verify that newly created custom modals include proper ARIA roles, an `aria-labelledby` referencing the title ID, `tabIndex={-1}`, and keyboard accessibility (like 'Escape' to close and auto-focusing on mount).
