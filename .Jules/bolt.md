
## 2024-05-18 - Concurrent Base64 Extraction for Image Files
**Learning:** Extracting base64 content via `FileReader` across multiple image files inside loops (e.g., when saving or exporting multiple icons like in `useIconRegistry.ts`) can create artificial I/O bottlenecks when done sequentially using standard `for...of` async/await.
**Action:** Always wrap independent I/O-bound mappings like `FileReader` parsing inside `Promise.all` mapping arrays to execute conversions concurrently, while retaining standard `try/catch` wrappers within the mapping function so single-file extraction failures do not abort the entire batch.
