## 2024-05-24 - Editor List Rendering Optimization
**Learning:** Large lists with complex children (like sections with forms) can cause severe performance issues in React if inline handlers are used in the mapping function. Each render of the parent creates new handler functions, forcing all children to re-render even if they are memoized.
**Action:** Extract list items into a separate memoized component (`SectionItem`) and use `useCallback` to stabilize handlers passed to it. This isolates the parent's re-renders from the children, ensuring only the changed item re-renders.
