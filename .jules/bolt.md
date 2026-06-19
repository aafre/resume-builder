## 2024-06-25 - Prevent deep dependency re-evaluations with useMemo

**Learning:** Inline object literals passed to custom hooks (like `useCloudSave`) cause reference inequality on every render. This bypasses React's default shallow equality checks and can trigger expensive operations inside the hook, such as `JSON.stringify` used for deep dependency tracking and comparisons.

**Action:** Always wrap object literals passed as hook dependencies or props in `useMemo` to maintain referential equality when the underlying values haven't actually changed.
