## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-03-05 - Complex List Rendering Optimization
**Learning:** When extracting list items to memoized components, ensuring stable callbacks is critical. Using `useRef` to hold the latest state in the parent component allows creating stable `useCallback` handlers that don't change on every render, thus enabling `React.memo` to work effectively.
**Action:** Use `useRef` + `useLayoutEffect` to store list state for event handlers when optimizing list rendering.
