## 2026-05-05 - Parallelize independent async file operations
**Learning:** Sequential `await` in loops over independent asynchronous file operations (like `FileReader` conversions in `useIconRegistry`) creates significant unnecessary delays. JavaScript's single-threaded nature allows `Promise.all` to safely map distinct keys on a shared object concurrently without race conditions.
**Action:** Refactor sequential asynchronous tasks in loops into concurrent operations using `Promise.all`, while ensuring individual error handling remains intact.
