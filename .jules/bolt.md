## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-29 - PyYAML Performance Bottleneck
**Learning:** PyYAML's default `yaml.dump` is pure Python and very slow. Using `yaml.CSafeDumper` provides a ~7x performance improvement, but requires fallback handling and cannot process `width=float('inf')` without throwing an `OverflowError`.
**Action:** Always create a `fast_yaml_dump` wrapper that uses `CSafeDumper` where possible and replaces infinite widths with a large integer.
