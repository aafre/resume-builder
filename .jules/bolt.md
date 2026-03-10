## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-18 - Hook Return Value Stability
**Learning:** Custom hooks that return objects (like `useIconRegistry`) create new references on every render if not memoized, defeating `React.memo` optimizations in child components that receive these objects as props.
**Action:** Always wrap the return value of custom hooks in `useMemo` when they return objects or arrays, especially if those hooks are used in performance-critical paths like lists.
