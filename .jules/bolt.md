## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-18 - Hook Return Value Stability
**Learning:** Custom hooks returning objects (like `useIconRegistry`) break memoization of consumers if the return value is not memoized, even if internal methods are stable. This cascades re-renders down the tree.
**Action:** Always wrap the return object of a custom hook in `useMemo` if it's intended to be used as a stable dependency or prop.
