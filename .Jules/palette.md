## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2026-07-19 - Keyboard Accessibility for Modals
**Learning:** Custom React modals often lack proper focus management and keyboard interaction support (like Escape key to close). Adding `tabIndex={-1}` on the wrapper with auto-focus on mount, plus dedicated `useEffect` hooks for keyboard event listeners, ensures standard a11y compliance.
**Action:** Always include focus management (`tabIndex`, auto-focusing `useRef`, Escape listeners) and explicitly define `focus-visible` outline utility classes on all interactive elements within custom UI overlays.
