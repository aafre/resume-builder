## 2024-05-15 - Memoizing objects passed to auto-save hooks
**Learning:** Passing inline object literals to custom hooks like `useCloudSave` causes reference inequality on every render. This forces `useCallback` and `useEffect` dependencies inside the hook to update continuously, resulting in expensive operations (like `JSON.stringify` for deep diffing) running unnecessarily on every component re-render.
**Action:** Always `useMemo` object parameters that are passed into hooks with deep dependency tracking, or structure the hook to accept primitives and stable references.
