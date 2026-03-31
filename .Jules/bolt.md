## 2026-03-31 - Parallelizing FileReader base64 operations
**Learning:** Sequential `await` loops inside custom hooks handling multiple independent asynchronous file operations (like converting File to base64 via FileReader in `useIconRegistry.ts`) cause unnecessary performance bottlenecks since each file read delays the next one.
**Action:** Refactor sequential file read tasks into concurrent operations using `Promise.all()` mapped across the collection. Maintain individual `try/catch` blocks inside the concurrent map to ensure that one failing operation does not halt the entire set.
