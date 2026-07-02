## 2024-05-24 - CSafeLoader for faster YAML parsing
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` yields an ~8x parsing speedup.
**Action:** Always evaluate the `try/except` import block for `CSafeLoader` once at the module level and use it to parse large YAML files to reduce parsing overhead.
