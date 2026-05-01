## 2025-02-28 - Optimize keyword subsumption lookup
**Learning:** In `keywordMatcher.ts`, nested array `find()` operations within loops lead to O(N^2) complexity, which can become a bottleneck when processing many keywords.
**Action:** Replacing the array `find()` with a pre-computed `Map` lookup reduces algorithmic complexity to O(N), which is an effective optimization strategy for frequency-based word subsumption logic.
