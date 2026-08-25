## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Using `yaml.dump` for generating resume configurations is slow. Our benchmarks showed a ~5x speedup when using `yaml.dump` with `CSafeDumper`. Also, `CSafeDumper` raises an `OverflowError` if `width=float('inf')` is passed. Passing a large integer like `2147483646` works instead to prevent wrapping.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` across the codebase to reduce CPU blocking during YAML writing and PDF generation.
