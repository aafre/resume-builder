## 2025-05-15 - Accessible Modal Patterns
**Learning:** Custom modals (like `DeleteResumeModal`) often miss critical accessibility features: `role="dialog"`, `aria-modal="true"`, focus management (initial focus), and Escape key handling.
**Action:** Always wrap custom modals with `role="dialog"`, trap or manage focus (focus first interactive or safe element), and add `keydown` listener for Escape. Use `aria-labelledby` and `aria-describedby` to link content.
