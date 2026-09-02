## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2024-10-24 - Faster YAML Dumping
**Learning:** Similar to parsing, using `yaml.dump` with the default python dumper is slow. `yaml.CSafeDumper` provides a ~10x speedup. However, `CSafeDumper` raises an `OverflowError` if `width=float("inf")` is used (which works in the default python dumper). We need to pass a large integer instead to achieve no line wrapping.
**Action:** Use `utils.yaml_converter.fast_yaml_dump` which wraps `CSafeDumper` and handles the `width=float("inf")` quirk automatically across the codebase.
