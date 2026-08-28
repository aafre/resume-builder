## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-08-28 - Faster YAML Dumping
**Learning:** `yaml.dump` without `yaml.CDumper` is significantly slower when generating YAML strings. `CDumper` provides a ~6x speedup, but it throws an error if `width=float('inf')` is passed.
**Action:** Use `yaml.dump(..., Dumper=CDumper)` and pass a large integer `width=2147483646` instead of `float('inf')` to prevent line wrapping when generating YAML.
