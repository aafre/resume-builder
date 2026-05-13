## 2024-05-13 - Pre-compile regex in hot paths
**Learning:** In Python, dynamically building and compiling regular expressions inside functions that are called frequently in hot paths (like text parsing or escaping) introduces significant redundant overhead.
**Action:** Pre-compile regular expressions (`re.compile`) at the module level. This approach yielded a ~2x performance speedup in the LaTeX escaping logic.
