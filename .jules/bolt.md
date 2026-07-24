## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-24 - Faster YAML Dumping
**Learning:** The default `yaml.dump` in pure Python is slow. Using `yaml.CSafeDumper` provides a ~5x speedup during PDF generation when serializing large resume structures. However, `CSafeDumper` doesn't support `width=float('inf')` and raises an `OverflowError`, so we must use a large integer like `width=int(1e9)` as a fallback.
**Action:** Created `fast_yaml_dump` in `utils.yaml_converter` that safely wraps `yaml.dump` with `CSafeDumper` and automatically handles the `width` edge case. Use this across the codebase for serialization.
