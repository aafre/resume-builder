## 2025-02-14 - Improve accessibility of LinkInsertionModal buttons
**Learning:** Custom modal buttons without explicit `type="button"` and focus visible styles can lead to accidental form submissions and poor keyboard navigation experience.
**Action:** Always add `type="button"` to buttons not used for form submission and explicit `focus-visible:ring-2 focus-visible:ring-offset-2` classes for clear focus indicators on interactive elements.
