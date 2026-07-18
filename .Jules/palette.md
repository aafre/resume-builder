## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-18 - ResponsiveConfirmDialog for SectionControls
**Learning:** Destructive actions like deleting a section were missing a confirmation dialog, leading to potential accidental data loss without a way to recover.
**Action:** Used `ResponsiveConfirmDialog` in `SectionControls` to add a confirmation prompt before deleting sections, ensuring a safer and more consistent user experience.
