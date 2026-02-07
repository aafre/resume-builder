## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-17 - Breaking Callback Dependency Cycles
**Learning:** When a child component requires a stable callback to prevent re-renders (via `React.memo`), but that callback depends on changing state (like a list of items), `useRef` can bridge the gap. By storing the latest state in a ref, the callback can read from `ref.current` without needing to be recreated on every render.
**Action:** Use `useRef` to store state/props when defining callbacks for memoized children if the callback would otherwise depend on frequently changing data.
