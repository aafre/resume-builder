
## 2024-05-30 - Pre-compiling Regex in Python Hot Paths
**Learning:** In Python, dynamically calling `re.sub` or `re.search` with string patterns inside hot-path string manipulation functions (like markdown parsing or LaTeX escaping) incurs significant overhead because the regex engine must repeatedly compile or lookup the cached pattern. Pre-compiling these patterns at the module level (`re.compile`) yields substantial performance improvements.
**Action:** Always pre-compile regular expressions using `re.compile` at the module level when they are used inside frequently called functions, loops, or text processing pipelines.
