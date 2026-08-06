## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2025-03-09 - Faster YAML Dumping
**Learning:** Default pure Python `yaml.dump` is slow. Using `yaml.dump` with `CSafeDumper` provides significant speedups, but `CSafeDumper` does not support `width=float('inf')` and raises an `OverflowError`.
**Action:** Implemented `utils.yaml_converter.fast_yaml_dump` using `CSafeDumper` and `width=int(1e9)` as a large integer alternative to `float('inf')` for preventing line wrapping during serialization.
