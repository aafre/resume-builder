## 2025-03-09 - Hash Map Optimization for Word Subsumption Algorithm

**Learning:** When scanning texts for job descriptions and subsuming multi-word bigrams, looking up words inside nested loops (to check frequencies) using array methods like `.find()` causes O(N^2) complexity. This causes significant performance impacts in frequency-based word subsumption logic algorithms.

**Action:** Replace nested array `.find()` operations within text parsing algorithms with a pre-computed `Map` (Hash Map) lookup to reduce algorithmic complexity from O(N^2) to O(N).
