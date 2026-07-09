## 2026-07-09 - ResponsiveConfirmDialog Keyboard Accessibility

**Learning:** Custom dialog action buttons styled with Tailwind lose default browser focus outlines. Modals also require explicit focus management (like focusing on mount) and an Escape key listener to close for screen reader compatibility and full keyboard navigation.
**Action:** Always add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` to styled modal buttons, explicitly manage focus with `useRef` and `useEffect` on mount, and bind a `keydown` listener for the Escape key on custom dialogs.
