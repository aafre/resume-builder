## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-17 - Faster YAML Serialization
**Learning:** PyYAML's default `yaml.dump` is slow. Using `yaml.CSafeDumper` provides a ~10x speedup but throws an `OverflowError` if `width=float('inf')` is used to disable wrapping.
**Action:** Use a very large integer like `int(1e9)` for `width` instead of infinity when using C-extensions to achieve fast, non-wrapping serialization.
