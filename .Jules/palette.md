## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-04-19 - Accessible Close Buttons on Modals
**Learning:** Icon-only close buttons in custom modals (like `UploadResumeModal`) often lack accessible names for screen readers and lack visible focus states for keyboard users, making modal dismissal difficult for some users.
**Action:** When adding or updating custom modal close buttons (e.g., using `XMarkIcon`), explicitly add an `aria-label` and utilize explicit focus states (like `focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md`) to ensure proper keyboard navigation visibility and accessibility.
