## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2025-03-10 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with the default dumper is slow and blocking. Using `yaml.CSafeDumper` provides a significant speedup. Additionally, passing `width=float('inf')` to the C-based Dumper raises an `OverflowError`, so a large integer like `2147483646` must be used instead.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` with `width=2147483646` instead of `yaml.dump` across the codebase to reduce CPU blocking during YAML serialization.
