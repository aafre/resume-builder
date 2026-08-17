## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Dumping
**Learning:** The default `yaml.dump` in pure Python is slow. Using `yaml.dump(..., Dumper=yaml.CSafeDumper)` speeds up serialization by ~4x. However, `CSafeDumper` throws an `OverflowError` for `width=float('inf')`, so we must pass a large int instead (e.g., `1e9`).
**Action:** Created `fast_yaml_dump` in `utils/yaml_converter.py` as a drop-in replacement that uses `CSafeDumper` to prevent blocking the main thread during heavy PDF generation endpoints.
