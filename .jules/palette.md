## 2026-02-20 - Modal Accessibility Gaps
**Learning:** Custom modals (like `LinkInsertionModal` and `AuthModal`) consistently lack `role="dialog"`, `aria-modal="true"`, and proper label associations.
**Action:** When touching any modal, always audit for these specific ARIA attributes and add them.
