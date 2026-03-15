## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.
## 2026-03-15 - Safe Ref Mutations for Memoized List Callbacks
**Learning:** When stabilizing callbacks for memoized list items using the `useRef` pattern, updating the ref synchronously during render is an anti-pattern that violates Concurrent Mode safety. However, waiting for `useEffect` introduces stale closures if the user types rapidly.
**Action:** Use `useLayoutEffect` to update the state ref. This ensures the ref has the latest state before the browser paints, keeping callbacks stable and safe from stale closures during rapid input without violating React rules.
