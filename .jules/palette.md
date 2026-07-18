## 2025-02-14 - Custom Modal Accessibility
**Learning:** Custom modals and confirmation dialogs styled with Tailwind classes often lose default browser focus outlines and lack keyboard interaction support (like closing on Escape).
**Action:** Explicitly implement a `keydown` event listener for the Escape key to close custom modals, and restore keyboard focus visibility on all action buttons (close, cancel, confirm) using explicit `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (with contextual colors like `ring-red-500` or `ring-accent`).
