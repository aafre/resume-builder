## 2024-04-16 - Concurrent File Readers

**Learning:** Refactoring sequential `await` loops for independent asynchronous tasks (e.g., `FileReader` conversions in `useIconRegistry.ts`) into concurrent operations using `Promise.all` effectively optimizes I/O-bound tasks in this codebase. Keeping individual `try/catch` blocks within the `map` is crucial to ensure one failing operation does not abort the entire set.

**Action:** Look for independent asynchronous file reads or operations that are run sequentially inside `for...of` loops and refactor them to use `Promise.all(array.map(...))` to parallelize execution.
