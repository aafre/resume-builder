## 2024-04-24 - Concurrent File Reads in useIconRegistry
**Learning:** Sequential `await` calls inside loops for independent asynchronous tasks (like `FileReader` operations in `useIconRegistry.ts`) introduce unnecessary blocking and degrade export performance.
**Action:** Refactor sequential asynchronous operations for independent tasks into concurrent execution using `Promise.all` while maintaining individual try/catch blocks to ensure robust error handling.
