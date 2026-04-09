## 2025-03-05 - Hoist LaTeX escape regex compilation
**Learning:** Recompiling regular expressions and redefining large dictionaries inside heavily-called utility functions (like `_escape_latex` called per node in PDF generation) adds significant overhead and causes $O(N)$ string operations to behave with high constant factors.
**Action:** Hoist regex compilation (`re.compile`) and static mapping dictionaries to module-level constants instead of defining them within function scopes, particularly for recursive or loop-heavy text processing.
