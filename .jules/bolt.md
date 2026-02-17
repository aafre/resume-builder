## 2025-02-17 - Editor List Optimization
**Learning:** Extracting list items into a `React.memo` component (e.g., `SectionItem`) and passing conditional props for volatile state (like `temporaryTitle`) effectively isolates updates. This prevents the entire list from re-rendering when only one item is being edited.
**Action:** Use this pattern for all complex list renderings in the editor.
