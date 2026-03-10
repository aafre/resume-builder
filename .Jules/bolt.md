## 2025-02-17 - Editor Re-render Optimization
**Learning:** In a list of complex components, inline callbacks in `.map` cause all items to re-render when one updates. Extracting the item renderer into a `React.memo` component and ensuring the parent passes stable callbacks (using `useRef` for state access if needed) effectively isolates updates.
**Action:** Always extract list items to memoized components when they have complex sub-trees and editing capabilities.

## 2025-02-17 - Semantic Matching Optimization
**Learning:** Extracting all candidate phrases (unigrams, bigrams, trigrams) from a long text and running transformer embeddings on them is extremely expensive (O(N) inference calls). Limiting to the top N frequent candidates before embedding preserves quality while capping worst-case performance.
**Action:** Always impose an upper bound on the number of items processed by heavy AI models in the browser, sorting by relevance/frequency first.
