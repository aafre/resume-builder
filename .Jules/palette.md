## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-23 - Added Confirmation Dialog for Section Deletion
**Learning:** The SectionControls component allowed users to delete an entire resume section with a single click. This was a destructive action that could easily lead to accidental data loss.
**Action:** Used the existing `ResponsiveConfirmDialog` component to intercept the deletion, requiring the user to explicitly confirm before the section is permanently removed. This prevents accidental data loss and provides a consistent, accessible confirmation prompt.
