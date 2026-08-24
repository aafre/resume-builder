## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2024-08-24 - Faster YAML Dumping
**Learning:** Using `yaml.safe_dump` or standard `yaml.dump` is significantly slower than using `yaml.CSafeDumper`. Our tests showed a ~5x speedup when using `CSafeDumper`. Also, `CSafeDumper` throws an `OverflowError` if `float('inf')` is passed for `width`, so a large integer like `2147483646` must be used instead to prevent line wrapping.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.safe_dump` or `yaml.dump` across the codebase to reduce CPU blocking during YAML serialization.
