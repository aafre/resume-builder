## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-03-12 - FileReader Base64 Caching Optimization in Auto-Save
**Learning:** In frequent auto-save hooks (like `useCloudSave`), converting `File` objects to Base64 strings using `FileReader` on every save triggers expensive, redundant I/O operations that synchronously block the main thread. This is especially noticeable during fast typing when the 800ms debounce fires repeatedly and the same image files are converted over and over.
**Action:** Always cache the result of `FileReader` conversions in a `useRef` using a composite key (e.g., `name-size-lastModified`) to uniquely identify unchanged files and bypass the redundant conversion.
