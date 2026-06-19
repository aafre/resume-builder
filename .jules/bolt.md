## 2024-06-06 - Replace PyYAML safe_load with CSafeLoader
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow for parsing large configurations or I/O bound tasks. Using `yaml.load(file, Loader=yaml.CSafeLoader)` offers a ~10x parsing speedup.
**Action:** Always prefer `yaml.load` with `CSafeLoader` over `yaml.safe_load` for significant performance improvements on YAML parsing tasks.
