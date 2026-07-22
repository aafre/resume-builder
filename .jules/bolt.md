## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-07-22 - PyYAML CSafeDumper OverflowError
**Learning:** PyYAML's default `yaml.dump` is pure Python and slow. Using `CSafeDumper` provides a significant speedup, but it does not support `width=float('inf')` and will raise an `OverflowError: cannot convert float infinity to integer`.
**Action:** Use `yaml.dump(..., Dumper=yaml.CSafeDumper)` for faster serialization, and instead of `width=float('inf')`, use a large integer like `width=int(1e9)` to prevent line wrapping when using C extensions.
