## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-17 - Accessibility enhancements for custom Modals
**Learning:** Custom dialogs built with React need explicit focus management (auto-focusing on mount) and keyboard event listeners (Escape key to close) to be accessible. Standard Tailwind `shadow-md` buttons often lose default browser outlines and require explicit `focus-visible:ring` classes.
**Action:** Always place hooks before early returns (like `if (!isOpen) return null;`), add `tabIndex={-1}` to programmatic focus targets, and ensure custom action buttons have explicit `focus:outline-none focus-visible:ring-2` utilities.
