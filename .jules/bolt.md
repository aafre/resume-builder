## 2024-05-24 - Passing inline objects to hooks with deep tracking
**Learning:** Passing an inline object literal (like `{ contact_info, sections, template_id }`) to a custom hook with deep dependency tracking (like `useCloudSave`) causes reference inequality on every render. This unintentionally triggers expensive internal effects, such as `JSON.stringify()` operations used for deep comparison or serialization.
**Action:** Always wrap such object parameters in `useMemo` before passing them into hooks that rely on deep equality checks or serialization in their internal `useEffect` arrays.
