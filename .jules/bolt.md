# Bolt's Journal

This journal tracks critical performance learnings.

## Entries

## 2025-02-18 - [React List Performance in Editor]
**Learning:** `EditorContent` was re-rendering all sections on every keystroke because it used inline arrow functions in `sections.map` (e.g., `onUpdate={() => ...}`). This defeated any potential memoization of child components.
**Action:** Extracted the rendering of individual sections into a memoized `SectionItem` component. Inside `SectionItem`, handlers are stabilized using `useCallback` and depend on `index` and `sectionManagement` (which is stable). This ensures that only the section being edited re-renders.
