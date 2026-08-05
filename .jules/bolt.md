## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with the default pure Python dumper is slow. `yaml.CSafeDumper` provides ~5x speedup, but it strictly requires `width` to be an integer (e.g., `int(1e9)`) rather than `float("inf")`.
**Action:** Use `fast_yaml_dump` to serialize YAML efficiently and avoid line wrapping without breaking the C-dumper.
