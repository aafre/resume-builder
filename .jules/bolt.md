## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2024-03-09 - Faster YAML Dumping
**Learning:** Using `yaml.dump` is significantly slower than using `CSafeDumper`. Furthermore, `CSafeDumper` does not accept `width=float("inf")`, so we must use a large integer like `width=int(1e9)` instead to prevent line wrapping when switching to it.
**Action:** Use `fast_yaml_dump` with `CSafeDumper` instead of `yaml.dump` across the codebase to reduce CPU blocking during YAML generation and PDF generation.
