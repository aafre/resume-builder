## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2024-05-20 - Faster YAML Serialization
**Learning:** Using the default `yaml.dump` is pure Python and significantly slower than `yaml.CSafeDumper`. C extensions cannot handle `width=float('inf')` which raises an `OverflowError`, so a large integer like `width=int(1e9)` must be used instead.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` instead of `yaml.dump` across the backend to reduce blocking time during PDF and preview generation.
