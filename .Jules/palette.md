## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2026-03-25 - Custom Modal Icon Buttons
**Learning:** Custom modals often implement manual close buttons (e.g., `XMarkIcon`) that lack native `aria-label`s and `focus-visible` styles against dark backgrounds.
**Action:** Always verify that all icon-only buttons in custom modal headers receive explicit `aria-label`s and `focus-visible:ring-white` (or contrasting color) combined with `focus:outline-none`.
