## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-23 - Faster YAML Dumping
**Learning:** Using `yaml.dump` is slow for serialization. `yaml.CSafeDumper` provides a ~4x speedup but does not support `width=float('inf')`.
**Action:** Use `width=int(1e9)` as a workaround when using `CSafeDumper` for serialization.
