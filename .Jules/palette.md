## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2024-06-26 - Accessible Modal Focus Management
**Learning:** Custom dialog action buttons styled with Tailwind lose default browser focus outlines. Modal dialog wrappers also lack automatic programmatic focus and `Escape` key handling natively, causing screen readers and keyboard users to lose context when opened.
**Action:** Explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` with contextual colors to custom buttons. Manage modal auto-focus by using a `useRef` and a `tabIndex={-1}` on the wrapper container triggered via `useEffect`, and separate the `Escape` keydown listener into its own targeted `useEffect` dependency array.
