
## 2024-05-14 - Parallelize Icon Downloads with ThreadPoolExecutor
**Learning:** Sequential I/O operations (like downloading multiple icons one by one from Supabase in `app.py`) can cause significant bottlenecks in PDF and thumbnail generation. Refactoring these loops to use `ThreadPoolExecutor.map()` is a simple and safe way to drastically improve performance.
**Action:** Always look for `for` loops making network or disk requests. When refactoring Python code to handle multiple independent I/O tasks, utilize `concurrent.futures.ThreadPoolExecutor` (while adhering to repository concurrency limits like `MAX_ICON_COPY_WORKERS`) combined with `functools.partial` to safely parallelize operations and collect results/failures correctly.
