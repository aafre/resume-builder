## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** `yaml.dump` is pure Python and very slow for large dictionaries. We can speed it up ~6x by using `yaml.CSafeDumper`. However, `CSafeDumper` does not support `width=float("inf")` (raises an OverflowError), so we must use a large integer like `width=int(1e9)` instead to prevent line wrapping.
**Action:** Implemented `utils.yaml_converter.fast_yaml_dump` wrapper to use `CSafeDumper` and applied it to PDF generation in `app.py`.
