## 2024-06-25 - Python PyYAML Performance Optimization
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` provides a ~8x-10x parsing speedup. Evaluating the `try/except` import block for `CSafeLoader` once at the module level avoids import overhead on every function call.
**Action:** Replace `yaml.safe_load` with a custom `fast_yaml_load` utility in Python codebases when parsing configuration or data files, particularly in critical paths or repetitive operations.
