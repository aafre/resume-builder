## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2025-03-09 - Faster YAML Dumping
**Learning:** Using standard `yaml.dump` is significantly slower than using `CSafeDumper`. Furthermore, when using `CSafeDumper`, passing `width=float('inf')` to prevent line wrapping raises an `OverflowError`. A large integer (e.g., `2147483646`) must be used instead.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` across the codebase to ensure high-performance YAML serialization without encountering the C-based dumper float infinity error.
