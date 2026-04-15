## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Custom File Input Keyboard Accessibility
**Learning:** Using `display: none` or Tailwind's `hidden` on a `<input type="file">` element completely removes it from the browser's accessibility tree and keyboard tab order, breaking keyboard navigation for file uploads.
**Action:** When styling custom file inputs, always place the `<input type="file">` before the visual `<label>` wrapper in the DOM, style it with `sr-only peer` to keep it focusable but visually hidden, and add `peer-focus-visible` styling (like `peer-focus-visible:ring-2`) to the subsequent `<label>` to visually indicate keyboard focus.
