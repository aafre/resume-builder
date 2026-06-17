## 2026-06-17 - Fast YAML Loading
**Learning:** PyYAML's `yaml.safe_load` is pure Python and relatively slow. The C extension `CSafeLoader` provides a ~7x speedup for parsing YAML, which is beneficial for PDF generation and template processing.
**Action:** Use `yaml.load(file, Loader=CSafeLoader)` with a fallback to `SafeLoader` instead of `yaml.safe_load()` in performance-sensitive paths.
