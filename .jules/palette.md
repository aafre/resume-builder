## 2024-05-18 - Dialog Button Accessibility
**Learning:** Custom dialog action buttons often lose default browser focus outlines due to custom Tailwind styling (like `bg-accent` or `shadow-md`), creating a critical accessibility trap for keyboard users in modals.
**Action:** Explicitly add `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (using appropriate contextual colors like `ring-red-500` or `ring-accent`) to all custom interactive elements, especially in shared dialog components.
