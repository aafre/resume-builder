## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-03-30 - Custom File Upload Accessibility
**Learning:** When creating custom styled file upload zones, using `className="hidden"` on the actual `<input type="file">` removes it completely from the keyboard tab order, breaking accessibility for keyboard and screen reader users.
**Action:** Always use Tailwind's `sr-only` class to visually hide the input while keeping it focusable. Pair this by adding the `peer` class to the input, and using `peer-focus-visible:ring-...` on the custom visible wrapper to ensure keyboard focus is clearly indicated to the user.
