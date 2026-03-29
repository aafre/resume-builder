## 2024-05-24 - Stabilize Inline Objects for Deep Dependency Hooks
**Learning:** Passing inline object literals to custom hooks with deep dependency tracking (like `useCloudSave`) causes reference inequality on every render. This forces child hooks to re-evaluate their dependencies and can trigger expensive redundant operations (like large `JSON.stringify` calls on every keystroke or render).
**Action:** Always wrap object and array parameters passed to custom hooks in `useMemo` if those parameters represent data structures used in dependency arrays internally.
