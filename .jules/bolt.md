## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-07-19 - Faster YAML Dumping
**Learning:** PyYAML's default `yaml.dump` is pure Python and slow. Using `yaml.dump(..., Dumper=yaml.CSafeDumper)` provides significantly faster serialization, similar to our findings with `CSafeLoader`. Note that `CSafeDumper` does not support `width=float('inf')` and requires a large integer (like `width=int(1e9)`) to prevent line wrapping without throwing an `OverflowError`.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` across the codebase to reduce CPU blocking during YAML serialization.
