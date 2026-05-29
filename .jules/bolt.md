## 2025-05-29 - Python YAML Parsing Bottleneck
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow (parsing takes ~3s for 1000 iterations of a simple resume). Using `yaml.load(file, Loader=yaml.CSafeLoader)` provides a significant speedup (~8x) because it uses the C extension.
**Action:** Always prefer `yaml.load(file, Loader=yaml.CSafeLoader)` with a `try/except` fallback to `yaml.SafeLoader` for any I/O bound or high-volume YAML parsing tasks.
