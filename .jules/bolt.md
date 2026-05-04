## 2024-05-04 - Concurrent FileReader I/O Optimization
**Learning:** Sequential `await` in loops over independent asynchronous operations (like `FileReader` conversions) needlessly blocks execution. JavaScript's single-threaded event loop ensures that concurrent modifications to distinct keys of a shared object within `Promise.all` callbacks do not cause race conditions.
**Action:** Always refactor sequential `for...await` loops over independent asynchronous I/O tasks into `Promise.all(array.map(...))` to parallelize execution, maintaining isolated error handling to prevent batch failure.
