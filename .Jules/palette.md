## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-07-04 - Missing aria-labels on icon buttons in modals
**Learning:** Found that custom modal implementations often miss `aria-label`s on icon-only buttons like close buttons (using `XMarkIcon` or `MdClose`). Screen readers won't know what these buttons do without them.
**Action:** Always verify icon-only buttons have an `aria-label` or visually hidden text when implementing custom interactive elements.
