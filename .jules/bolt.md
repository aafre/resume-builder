## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Standard `yaml.dump` is significantly slower than using `yaml.CDumper`. However, `CDumper` throws an `OverflowError` if `width=float('inf')` is provided.
**Action:** Created `utils.yaml_converter.fast_yaml_dump` to wrap `yaml.dump` with `CDumper` and automatically convert `width=float('inf')` to `width=2147483646` (max int) for no line wrapping. Applied this across Python files.
