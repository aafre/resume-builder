## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-07-26 - Faster YAML Dumping
**Learning:** Using `yaml.dump` without `CSafeDumper` is significantly slower for generating YAML files. Furthermore, `CSafeDumper` does not support `width=float('inf')` and will raise an `OverflowError`, so we must use a large integer like `width=int(1e9)` instead.
**Action:** Created `utils.yaml_converter.fast_yaml_dump` to wrap `yaml.dump` with `CSafeDumper` and handle the width correctly, applying it across the application for faster PDF generation.
