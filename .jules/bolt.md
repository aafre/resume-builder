## 2025-03-09 - Concurrent Asynchronous Exports
**Learning:** Refactoring sequential `await` loops for independent asynchronous tasks (like `FileReader` conversions in `useIconRegistry.ts`) into concurrent operations using `Promise.all` prevents unnecessary I/O delays, especially when processing multiple files.
**Action:** Always map independent asynchronous tasks to promises and execute them concurrently with `Promise.all` while maintaining individual error handling inside the map.
