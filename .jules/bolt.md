## 2024-05-26 - Fast YAML loading with CSafeLoader
**Learning:** PyYAML's `yaml.safe_load` is pure Python and slow.
**Action:** Used `yaml.load(file, Loader=yaml.CSafeLoader)` with a `try/except` fallback to `yaml.SafeLoader` for a ~10x parsing speedup.
