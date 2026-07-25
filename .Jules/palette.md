## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-25 - ResponsiveConfirmDialog for Destructive Actions Update
**Learning:** Even internal app components like SectionControls require confirmation dialogs for destructive actions to maintain accessible and secure UX consistency, despite it seemingly slowing down the flow slightly.
**Action:** Consistently replace simple JS 'confirm' dialogs or direct actions with `ResponsiveConfirmDialog` anywhere a destructive action like "Delete section" is present.
