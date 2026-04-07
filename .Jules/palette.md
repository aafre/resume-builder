## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-04-07 - Accessible Modal Close Buttons on Dark Backgrounds
**Learning:** In modals with dark headers (e.g. `bg-ink`), default focus rings (which are often blue or black) have poor contrast and fail accessibility standards for keyboard users. Furthermore, icon-only buttons (like `XMarkIcon`) often miss `aria-label`s, preventing screen readers from communicating their purpose.
**Action:** When adding close buttons or any icon-only actions on dark backgrounds, explicitly define `focus-visible:ring-white` alongside `focus:outline-none` and `rounded-md`, and always include a descriptive `aria-label` (e.g. "Close modal").
