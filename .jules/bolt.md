## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-03-06 - Auto-save Base64 Conversion Optimization
**Learning:** Performing `FileReader` conversions from `File` objects to base64 strings repeatedly during frequent hook executions (like debounced auto-saves) can introduce main thread blockage. We can bypass this overhead by implementing an in-memory cache mapped to a composite key derived from the file's properties (`name`, `size`, `lastModified`).
**Action:** When handling frequent serialization of unchanged objects inside a debounced React hook, memoize or cache the conversion outcome utilizing a stable combination of its properties to reduce repetitive CPU and I/O work.
