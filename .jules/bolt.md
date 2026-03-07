## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-18 - FileReader Caching in Auto-save Hooks
**Learning:** Frequent auto-save operations that perform expensive I/O operations (like converting `File` objects to base64 strings using `FileReader`) can unnecessarily block the main thread and impact editor performance. Caching the conversion results using a composite key (`name-size-lastModified`) in a `useRef` prevents redundant reads during state-change debounces.
**Action:** Always cache the results of expensive, repetitive operations (like file base64 conversions) in a stable reference (like `useRef`) during high-frequency auto-save hooks to prevent unnecessary thread blocking.
