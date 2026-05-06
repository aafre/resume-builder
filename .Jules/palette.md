## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2026-05-06 - Add type="button" and aria-labels to Section Controls
**Learning:** Many icon-only controls for inline list editing or removing items lack `type="button"` and `aria-label` attributes, which can cause accidental form submissions or unclear interactions for screen readers.
**Action:** When adding or modifying inline editing controls, always ensure they are properly designated as `type="button"` and have descriptive accessible names.
