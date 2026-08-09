## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Serialization
**Learning:** `yaml.dump`'s default pure Python implementation is slow for large JSON/dictionary structures. However, PyYAML's `CSafeDumper` doesn't support `float('inf')` for the `width` parameter, raising an `OverflowError` from the underlying C code.
**Action:** When creating `fast_yaml_dump` wrappers using `CSafeDumper`, use a large integer like `width=int(1e9)` instead of `width=float('inf')` to achieve the ~8x speedup without line wrapping issues.
