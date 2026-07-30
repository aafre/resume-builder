## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-30 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with the default dumper is significantly slower than using `yaml.CSafeDumper`. Our benchmarks showed a ~10x speedup when dumping YAML configuration for PDFs. `CSafeDumper` does not support `width=float('inf')` natively (raises OverflowError), so passing a large integer like `width=int(1e9)` is required.
**Action:** Implement and use `utils.yaml_converter.fast_yaml_dump` across the codebase to reduce CPU blocking during YAML string generation and PDF exports.
