## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2026-07-22 - Interactive Control Accessibility and Destructive Dialogs
**Learning:** Custom Tailwind buttons (such as those in SectionControls) often lose browser default focus outlines, making keyboard navigation difficult. Furthermore, destructive actions in deeply nested components (like inline section deletion) often lack the global confirmations used at the page level.
**Action:** Always explicitly include focus-visible utilities (e.g., focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2) on interactive elements. Consistently use ResponsiveConfirmDialog for all destructive actions, even inline ones, to prevent accidental data loss.
