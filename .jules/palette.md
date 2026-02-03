## 2024-05-22 - Modal Accessibility Pattern
**Learning:** Modals in the application consistently lack basic accessibility features (role="dialog", focus management, keyboard support).
**Action:** When touching any modal component, verify and add: `role="dialog"`, `aria-modal="true"`, focus trap (or at least initial focus), and Escape key listener.
