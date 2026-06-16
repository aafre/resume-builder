## 2024-06-16 - Accessible Custom Dialogs
**Learning:** Custom dialogs built with Tailwind lose native keyboard accessibility features (like `Escape` to close) and default focus outlines when styled. Wrapper elements also need explicit focus management (`tabIndex={-1}`) so screen readers announce them properly upon opening.
**Action:** When building custom modals, always include an `Escape` keydown listener, manage focus on mount using `useRef`, and explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (with contextual colors) to all custom action buttons.
