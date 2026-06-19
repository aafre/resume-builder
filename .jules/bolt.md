## 2025-06-04 - High-performance YAML loading
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` provides a ~8-10x parsing speedup on large configurations or I/O bound tasks like resume generation.
**Action:** When working with YAML parsing in Python, especially in performance-sensitive contexts like web requests or generating large quantities of documents, implement a fallback loader pattern to leverage `CSafeLoader` for significant performance gains.
