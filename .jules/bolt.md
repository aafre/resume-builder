## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-17 - Hook Return Memoization
**Learning:** Passing unstable objects (created fresh in custom hooks) as props to a memoized component (`EditorContent`) breaks optimization. Even if functions inside are stable, the object reference changes.
**Action:** Return memoized objects from custom hooks when they bundle multiple handlers/state for a child component.
