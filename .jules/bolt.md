## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2023-10-24 - Faster YAML Dumping
**Learning:** Similar to `yaml.safe_load`, using standard `yaml.dump` or `yaml.safe_dump` is significantly slower than using `yaml.CSafeDumper`. Furthermore, `CSafeDumper` throws an `OverflowError` when passed `width=float('inf')`.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` or `yaml.safe_dump` to reduce CPU blocking during YAML serialization. For no line wrapping, pass a large integer (e.g., `width=2147483646`) instead of `float('inf')`.
