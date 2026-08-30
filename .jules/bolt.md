## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with standard dumpers is slow for large nested structures like resumes. Using `CSafeDumper` provides a ~10x speedup. Also learned that `width=float("inf")` raises an OverflowError with C dumpers, requiring a large integer like `width=2147483646` instead.
**Action:** Created `fast_yaml_dump` utilizing `CSafeDumper` and applied it to PDF generation endpoints and scripts to reduce latency.
