## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2023-10-24 - Faster YAML Dumping
**Learning:** Similar to `yaml.safe_load`, standard `yaml.dump` is noticeably slow for large datasets. Using `yaml.CSafeDumper` provides significant speedup. However, a PyYAML quirk with `CSafeDumper` causes `width=float('inf')` to throw an `OverflowError` (cannot convert float infinity to integer).
**Action:** Replaced `yaml.dump` and `yaml.safe_dump` with `utils.yaml_converter.fast_yaml_dump` utilizing `CSafeDumper`, and changed `width=float('inf')` to `width=2147483646` to prevent line wrapping without throwing errors.
