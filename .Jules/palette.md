## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-04-05 - Keyboard Focus Visibility on Icon Buttons
**Learning:** Custom inline icon buttons within mapped card components (like the Download PDF button on `ResumeCard`) often miss explicit keyboard focus indicators if they only use `hover` state classes, making them invisible to keyboard-only users navigating the card actions.
**Action:** Always verify keyboard focus states and explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent` (or similar design system focus tokens) to custom icon-only buttons to ensure they remain accessible and highly visible during keyboard navigation.
