## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Accessible Custom Modals
**Learning:** Custom dialog action buttons (Confirm/Cancel) styled with Tailwind classes like `bg-accent` or `shadow-md` lose default browser focus outlines. Modal container elements also need explicit focus management (`tabIndex={-1}` and `useRef` auto-focusing) and an `Escape` key down event listener to be fully accessible.
**Action:** Explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (using contextual colors like `ring-red-500` for destructive actions or `ring-accent`) to restore keyboard accessibility on custom modal buttons. Handle the `Escape` key to close via a `keydown` event listener.
