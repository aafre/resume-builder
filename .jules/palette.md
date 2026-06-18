
## 2024-06-18 - Keyboard Accessibility in Custom Dialogs
**Learning:** Custom dialog action buttons styled with Tailwind classes like `bg-accent` often lose default browser focus outlines. Modal components also need an Escape key listener.
**Action:** Explicitly add `focus:outline-none focus-visible:ring-2` to buttons, and `useEffect` for `keydown` with `Escape` handler to close custom dialogs.
