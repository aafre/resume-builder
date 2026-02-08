## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-17 - Section Renderer Optimization
**Learning:** Even if a parent component (like `SectionRenderer`) is memoized, inline callbacks that depend on props (like `section`) will change on every render if the prop changes (e.g., due to parent array update). Using `useRef` to hold the latest prop value allows creating stable callbacks that don't trigger child re-renders.
**Action:** Use `useRef` to stabilize callbacks passed to expensive child components when the callback logic depends on frequent prop updates but the child structure doesn't need to re-render.
