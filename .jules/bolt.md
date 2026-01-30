## 2025-02-18 - React List Rendering Optimization
**Learning:** In complex editors with large lists, inline function props in `map` prevent child memoization even if children are memoized.
**Action:** Extract list items into a memoized `SectionItem` wrapper that handles callback creation internally using `index`.
