## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-05-03 - Accessible Modal Close Buttons
**Learning:** Custom modals using React portals often have custom header implementations where icon-only close buttons lack both accessible names (`aria-label`) and visible focus states, which breaks keyboard navigation and screen reader experience.
**Action:** Always ensure custom modal close buttons include `aria-label="Close modal"` and explicit focus states like `focus-visible:ring-2 focus-visible:ring-accent` using Tailwind.
