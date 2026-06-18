## 2026-06-03 - PyYAML `safe_load` Performance
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` gives an ~8x parsing speedup (Safe load: 60.6094s vs Fast load: 7.4903s).
**Action:** Implement a `fast_yaml_load` utility function that attempts to use `yaml.CSafeLoader` with a `try/except` fallback to `yaml.SafeLoader`, and use this function globally instead of `yaml.safe_load`.
