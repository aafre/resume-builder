## 2024-05-28 - PyYAML SafeLoader Bottleneck
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for parsing large documents.
**Action:** Use `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` for a ~7x parsing speedup. To avoid import overhead on every function call, evaluate the `try/except` import block for `CSafeLoader` once at the module level.
