## 2024-05-27 - Use CSafeLoader for YAML Parsing
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for large configurations or I/O bound tasks. Using `yaml.CSafeLoader` provides a ~10x speedup for parsing.
**Action:** Always create a `fast_yaml_load` utility with a `try/except` fallback to `yaml.SafeLoader` to leverage the C extension safely.
