## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2024-05-05 - Consistent Keyboard Focus Visibility for Inline Controls
**Learning:** Inline icon-only controls (like ✕ or ✏️) often lose default browser outlines due to custom Tailwind padding or colors, rendering them invisible to keyboard-only navigation.
**Action:** Explicitly add `type="button"`, `aria-label`, and focus-visible outlines (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`) to all custom icon buttons to ensure proper accessibility.
