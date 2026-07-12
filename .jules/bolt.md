## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-12 - CSafeDumper float("inf") overflow
**Learning:** Using `width=float("inf")` with pyyaml's `CSafeDumper` raises an `OverflowError: cannot convert float infinity to integer` because the underlying C code doesn't support float infinity.
**Action:** When migrating from python's default dumper to `CSafeDumper` and you need to prevent line wrapping, use a large integer like `int(1e9)` instead of `float("inf")`.
