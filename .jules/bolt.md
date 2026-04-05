## 2024-04-05 - Parallelizing FileReader in Icon Registry
**Learning:** Using sequential `await` for `FileReader` operations inside loops can unnecessarily block execution for I/O-bound tasks like base64 image conversions.
**Action:** Refactor sequential asynchronous loops into concurrent operations using `Promise.all` with individual `try/catch` blocks.
