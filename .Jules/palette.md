## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-06-10 - Keyboard Accessibility for Custom Dialogs
**Learning:** Custom dialog action buttons (Confirm/Cancel) styled with Tailwind classes like `bg-accent` or `shadow-md` lose default browser focus outlines. This makes keyboard navigation difficult or impossible for visually impaired users or those who rely on a keyboard. Also, custom modals must explicitly handle the `Escape` key.
**Action:** Explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (using contextual colors like `ring-red-500` for destructive actions or `ring-accent`) to restore keyboard accessibility on custom buttons. Ensure custom modals handle the `Escape` key to close via a `keydown` event listener.
