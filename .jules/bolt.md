## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Dumping
**Learning:** `yaml.dump` without `CSafeDumper` is very slow. `CSafeDumper` does not support `width=float('inf')` and will raise an `OverflowError`. Use a large integer like `width=int(1e9)` instead to prevent line wrapping.
**Action:** Use `yaml.dump` with `Dumper=yaml.CSafeDumper` and `width=int(1e9)` to significantly speed up YAML serialization.
