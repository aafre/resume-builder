## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - ResponsiveConfirmDialog Keyboard Accessibility
**Learning:** Custom dialog action buttons (Confirm/Cancel) styled with Tailwind classes like `bg-accent` or `shadow-md` often lose default browser focus outlines, making keyboard navigation difficult for visually impaired users. Modals also often lack `Escape` key support to close them.
**Action:** Always explicitly add focus visibility classes (`focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`) with appropriate contextual colors (e.g., `ring-red-500` for destructive actions or `ring-accent`) to custom buttons. Ensure custom modals handle the `Escape` key via a `keydown` event listener.
