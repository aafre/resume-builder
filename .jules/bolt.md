## 2024-05-19 - Concurrent Async I/O Operations with Promise.all
**Learning:** Sequential `await` statements inside `for...of` loops for independent asynchronous tasks (like `FileReader` conversions in `useIconRegistry.ts`) introduce an I/O bottleneck, creating a linear time complexity $O(N)$ dependent on I/O.
**Action:** Refactor these loops to use `Promise.all` with `map` for concurrent execution, which executes independent async tasks concurrently, bounded only by internal resource limits, while maintaining individual `try/catch` blocks so one failure doesn't abort the entire batch.
