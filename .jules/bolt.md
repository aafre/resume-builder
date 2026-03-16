## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-17 - FileReader I/O Optimization in Auto-Save Hooks
**Learning:** Frequent auto-save operations that convert `File` objects to base64 strings using `FileReader` can redundantly block the main thread with expensive I/O operations if the same file is converted multiple times.
**Action:** Always cache `FileReader` base64 conversions in a `useRef` using a composite key (like `name-size-lastModified`) in frequent auto-save hooks to avoid unnecessary I/O operations.
