## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-07-15 - Faster YAML Dumping
**Learning:** Similar to loading, PyYAML's default `yaml.dump` is pure Python and slow. Using `yaml.CSafeDumper` provides a significant speedup (~7.4x in benchmarks). However, `CSafeDumper` does not support `width=float('inf')` and will raise an OverflowError, so use a large integer like `width=int(1e9)` instead.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` with `CSafeDumper` and `width=int(1e9)` instead of `yaml.dump` across the codebase to reduce CPU blocking during YAML generation and PDF generation.
