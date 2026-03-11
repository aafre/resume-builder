
## 2025-05-18 - LinkInsertionModal Accessibility Findings
**Learning:** Custom modals like `LinkInsertionModal` were missing explicit screen reader attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), unlinked form inputs (`id` to `htmlFor`), and explicit `focus-visible` states on their action buttons. This causes screen readers to misidentify the scope and keyboard users to lose track of focus.
**Action:** When building custom modals, always enforce explicit `role="dialog"`, `aria-modal="true"`, explicitly link `<label>` tags with input `id`s, and add `focus-visible:ring-2` to all action buttons to ensure robust screen reader and keyboard accessibility.
