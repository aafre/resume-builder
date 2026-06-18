## 2025-06-11 - Optimize YAML loading with CSafeLoader
**Learning:** PyYAML's `yaml.safe_load` is a pure Python implementation and is a bottleneck for large configurations or I/O bound tasks.
**Action:** Used `fast_yaml_load` utilizing `yaml.CSafeLoader` with a fallback to `yaml.SafeLoader` for a ~10x parsing speedup.
