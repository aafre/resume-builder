## 2024-06-25 - Parallelize FileReader Conversions
**Learning:** Sequential `await` loops for I/O-bound tasks like `FileReader` conversions (e.g., converting multiple icons to base64) block the main thread unnecessarily and increase total execution time. This is a common bottleneck when exporting or syncing resources.
**Action:** Refactor sequential `await` loops for independent asynchronous tasks into concurrent operations using `Promise.all`. Maintain individual `try/catch` blocks within the concurrent map to ensure that one failing operation does not abort the entire set.
