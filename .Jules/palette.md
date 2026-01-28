## 2024-05-22 - Modal Accessibility Pattern
**Learning:** Custom modals (like `DeleteResumeModal`) are currently implemented as raw `div`s without accessibility attributes or focus management, making them invisible to screen readers and trapping keyboard users.
**Action:** When touching any modal component, enforce the "Accessible Modal Standard": add `role="dialog"`, `aria-modal="true"`, focus the cancel/close button on mount, and add an Escape key listener.
