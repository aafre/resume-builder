## 2024-05-24 - High-Performance YAML Loading
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for large configurations or I/O bound tasks. We verified that using `CSafeLoader` gives a ~10x speedup in parsing time.
**Action:** Always prefer using a wrapper function that attempts to load `CSafeLoader` with a fallback to `SafeLoader` for any YAML loading needs.
