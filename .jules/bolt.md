## 2026-07-04 - High-performance YAML loading
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` offers a ~10x parsing speedup. To avoid import overhead on every function call, the `try/except` import block for `CSafeLoader` should be evaluated once at the module level.
**Action:** Abstract YAML parsing into a high-performance utility like `fast_yaml_load` using `CSafeLoader` and replace all pure Python `yaml.safe_load` usages globally.
