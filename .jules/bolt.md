## 2025-02-28 - Pre-compile Regex in Hot Paths
**Learning:** Dynamic compilation of regular expressions (e.g., `re.compile`) inside frequently called functions (hot paths, like `_escape_latex` which is called for all string fields in YAML processing) creates significant performance overhead. A local benchmark showed ~49% faster execution by pre-compiling.
**Action:** Always extract `re.compile` to the module level for patterns used in hot paths.
