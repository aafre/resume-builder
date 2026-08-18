## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Serialization
**Learning:** The default `yaml.dump` is pure Python and slow. Using `yaml.dump(..., Dumper=yaml.CSafeDumper)` provides a massive speedup (~5x). However, unlike the default dumper, `CSafeDumper` does not support `width=float('inf')` and will raise an `OverflowError` (cannot convert float infinity to integer).
**Action:** Use `CSafeDumper` (via `SafeDumper` fallback) for performance, and replace `width=float('inf')` with a large integer like `width=int(1e9)` to prevent line wrapping when using C-based dumpers.
