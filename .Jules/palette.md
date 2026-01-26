## 2024-05-22 - [Modal Accessibility Gaps]
**Learning:** Destructive modals often lack basic keyboard accessibility (focus trap, escape key) and ARIA attributes, making them dangerous for screen reader users who might not know context or can't escape easily.
**Action:** Always implement `role="dialog"`, `aria-modal="true"`, focus management (focus cancel button by default), and escape key listener for all modals.
