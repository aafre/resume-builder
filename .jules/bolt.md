## 2024-05-01 - Regex Compilation Hoisting in LaTeX Generation
**Learning:** Recompiling static regular expressions inside utility functions like `_escape_latex` introduces a measurable overhead, especially since these functions are called frequently (often recursively or in loops) during the PDF generation process.
**Action:** Always hoist static mapping dictionaries and `re.compile()` calls to module-level constants to ensure they are evaluated only once at import time.
