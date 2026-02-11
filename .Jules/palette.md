## 2025-02-19 - Accessible Dropdown Menu Pattern
**Learning:** Custom dropdown menus (like KebabMenu) often lack basic accessibility. Adding `role="menu"`, `role="menuitem"`, and managing focus programmatically with `useRef` and `requestAnimationFrame` significantly improves keyboard usability without external libraries.
**Action:** When implementing custom menus, always include: 1) ARIA roles, 2) Focus trapping/management (focus first item on open), 3) Keyboard navigation (Arrows, Escape, Home/End).
