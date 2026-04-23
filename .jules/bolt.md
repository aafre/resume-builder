## 2024-04-23 - Hoisting Regex Compilation in Recursive Functions
**Learning:** Recompiling a regex inside a utility function (like `_escape_latex`) that is called recursively on deeply nested data structures introduces a significant performance bottleneck in Python.
**Action:** Always hoist static dictionaries and regex compilations (`re.compile`) to module-level constants to avoid redundant instantiation on every function call.
