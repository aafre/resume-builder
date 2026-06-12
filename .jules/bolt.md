## 2025-06-12 - PyYAML CSafeLoader for 10x Faster Parsing
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` yields a ~10x parsing speedup. Evaluating the `try/except` import block for `CSafeLoader` once at the module level avoids import overhead on every function call.
**Action:** Always define a high-performance YAML loading utility `fast_yaml_load` that leverages `CSafeLoader` instead of `yaml.safe_load` globally for significantly faster parsing.
