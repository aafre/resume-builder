## 2024-03-22 - Parallelizing Async I/O in Hooks
**Learning:** Sequential `await` loops for independent asynchronous tasks (e.g., `FileReader` conversions in `useIconRegistry.ts`) cause significant performance bottlenecks, especially for I/O-bound tasks.
**Action:** Refactor sequential `await` loops into concurrent operations using `Promise.all`. Maintain individual `try/catch` blocks within the concurrent map to ensure that one failing operation does not abort the entire set.
