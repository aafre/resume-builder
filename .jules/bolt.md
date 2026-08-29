## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2024-10-24 - Faster YAML Dumping
**Learning:** Using `yaml.dump` for writing resume configurations is slower than using `yaml.CSafeDumper`. Furthermore, `CSafeDumper` throws an error when `width=float('inf')` is passed.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` across the codebase and use a large integer like `2147483646` for the `width` parameter to achieve no line wrapping.
