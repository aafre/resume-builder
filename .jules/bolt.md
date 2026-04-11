## 2026-04-11 - Hoisting Regex and Static Mappings
**Learning:** In heavily used utility functions like `_escape_latex` (used for document compilation), defining mapping dictionaries and recompiling regular expressions via `re.compile()` inside the function scope introduces significant overhead.
**Action:** Always hoist static mapping dictionaries and `re.compile` calls to module-level constants. This avoids recompilation on every function invocation and provides a ~3.5x speedup for text-processing utilities called repeatedly in loops or recursion.
