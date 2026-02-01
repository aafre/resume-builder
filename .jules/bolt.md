## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-24 - Stable Handlers for Complex Lists
**Learning:** React.memo on list items is useless if the parent passes unstable handlers. When the handler needs access to the state (the list itself), using `useRef` to hold the latest state allows creating a stable `useCallback` that reads from the ref.
**Action:** Use `useRef` for list state in parent components to create stable CRUD handlers for memoized children.
