## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-08-03 - Faster YAML Dumping
**Learning:** PyYAML's default `yaml.dump` is pure Python and slow. `yaml.CSafeDumper` offers a massive speedup but errors out when passed `width=float('inf')` with an `OverflowError`.
**Action:** Created `fast_yaml_dump` that wraps `CSafeDumper` and automatically converts `width=float('inf')` to a large integer (e.g. `1e9`) to prevent line wrapping safely while maximizing performance.
