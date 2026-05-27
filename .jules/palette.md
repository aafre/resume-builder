## 2024-05-27 - Duplicate Resume Modal Accessibility
**Learning:** Custom modals like `DuplicateResumeModal` require explicit ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) and keyboard interactions (Escape key to close, backdrop click to close) to be fully accessible and provide a smooth user experience.
**Action:** When implementing custom modals, always include these standard accessibility and interaction patterns rather than just visual styling.
