## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-06-19 - Accessible Dialog Patterns
**Learning:** Custom dialogs styled with utility classes often lose default browser focus outlines on action buttons. Additionally, standard accessibility requires explicit Escape key handling and modal container focus management for screen readers and keyboard users.
**Action:** When building or updating dialogs, always include `focus-visible:ring-2` on buttons, add `keydown` listeners for Escape to close, and use `tabIndex={-1}` with `useRef` to auto-focus the dialog wrapper on mount.
