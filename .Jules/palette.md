## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-03-26 - Action Buttons Keyboard Accessibility
**Learning:** Action buttons within mapping components (like `ResumeCard`) that have complex child combinations or custom styling often miss standard keyboard accessibility focus indicators (`focus-visible`).
**Action:** When creating custom action buttons or inline controls (e.g. edit, download, delete icons), explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent` to ensure interactive elements are visible to keyboard users.
