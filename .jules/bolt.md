## 2025-02-18 - Parallelize Independent Async Operations

**Learning:** Sequential `await` statements inside loops for independent asynchronous operations (like `FileReader` calls to convert multiple files to base64) create a performance bottleneck, taking $O(N)$ time instead of $O(1)$ concurrent time. This is especially impactful for I/O-bound tasks in a browser environment.

**Action:** Refactor sequential `await` loops for independent tasks into concurrent operations using `Promise.all`. When mapping these tasks, ensure each promise handles its own errors using an internal `try/catch` block so that a single failure doesn't reject the entire `Promise.all` set.
