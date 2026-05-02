## 2026-05-02 - O(N^2) to O(N) Subsumption Optimization
**Learning:** In `keywordMatcher.ts`, replacing nested array `find()` operations within loops with a pre-computed `Map` lookup reduces algorithmic complexity from $O(N^2)$ to $O(N)$. This is especially useful for frequency-based word subsumption logic.
**Action:** Always refactor array `.find()` inside loops that iterate over similar sets of elements to use a pre-built `Map` to drastically reduce iteration complexity.
