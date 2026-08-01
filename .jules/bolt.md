## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-08-01 - Faster YAML Serialization
**Learning:** Using `yaml.dump` for large dictionaries is significantly slower in Python. Our tests show using `yaml.CSafeDumper` provides ~4x speedup, but it throws an `OverflowError` if `width=float('inf')` is passed.
**Action:** Created `fast_yaml_dump` wrapper to utilize `CSafeDumper` while converting `width=float('inf')` to a large integer (`width=int(1e9)`) to prevent line wrapping safely. Replaced standard `yaml.dump` calls across the codebase for improved performance.
