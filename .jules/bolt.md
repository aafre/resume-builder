## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-21 - Faster YAML Dumping
**Learning:** Just like safe_load, `yaml.dump` is slow. Using `yaml.CSafeDumper` provides a ~5x speedup for YAML serialization. However, `CSafeDumper` does not support `width=float('inf')` and raises an `OverflowError`.
**Action:** Use a large integer like `width=int(1e9)` instead of `float('inf')` when using `CSafeDumper` to prevent line wrapping without throwing errors.
