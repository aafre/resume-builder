## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with its default dumper is pure Python and slow for large dictionary conversions. Using `yaml.dump(..., Dumper=yaml.CSafeDumper)` provides a significant performance boost (~4.6x speedup). Note that `CSafeDumper` does not support `width=float('inf')` and will raise an `OverflowError`. Use a large integer like `width=int(1e9)` instead.
**Action:** Ensure `yaml.dump` calls use `CSafeDumper` for performance-critical paths, especially during JSON-to-YAML resume conversions for PDF generation.
