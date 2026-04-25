## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - File Input Keyboard Accessibility via Peer Classes
**Learning:** Standard `<input type="file">` elements styled via `display: none` or Tailwind's `hidden` are completely removed from the DOM's accessibility tree, making them un-focusable via keyboard navigation.
**Action:** When creating custom styled file upload components, always apply `sr-only peer` to the `<input type="file">` and place it immediately before the custom `<label>` visual wrapper. Then, use `peer-focus-visible` classes on the label to render a visible focus ring, ensuring full keyboard and screen-reader accessibility without compromising the design.
