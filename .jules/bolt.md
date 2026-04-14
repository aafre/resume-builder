## 2024-04-14 - Hoist regex compilation in LaTeX escaping
**Learning:** Utility functions that escape special characters, like `_escape_latex`, are called frequently during document generation. Compiling the regex pattern and defining the mapping dictionary inside the function scope causes unnecessary overhead on every invocation.
**Action:** Always hoist static mapping dictionaries and regex compilations (using `re.compile`) to module-level constants for functions called recursively or in loops.
