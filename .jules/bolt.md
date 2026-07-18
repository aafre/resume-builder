## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-09 - C-based YAML Serialization
**Learning:** PyYAML's default `yaml.dump` is slow. Using `yaml.CSafeDumper` gives a ~10x speedup for serialization. However, `CSafeDumper` has a bug where it throws an `OverflowError: cannot convert float infinity to integer` if `width=float("inf")` is passed. It must be substituted with a large integer (e.g., `width=1000000`).
**Action:** Always import and use `CSafeDumper` alongside `CSafeLoader` for YAML processing to maximize performance, but beware of using `float("inf")` for the width parameter when preventing line wraps.
