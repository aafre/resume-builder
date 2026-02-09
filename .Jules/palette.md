## 2026-02-09 - Accessible Modals
**Learning:** Custom modal implementations often miss critical ARIA attributes (`role="dialog"`, `aria-modal="true"`) and label associations, making them inaccessible.
**Action:** Always audit modal components for these attributes and ensure inputs have `id`s matching their label `htmlFor`.
