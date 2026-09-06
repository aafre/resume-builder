## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2025-03-09 - Faster YAML Dumping
**Learning:** Using `yaml.dump` with the default Dumper for serializing resume configurations is significantly slower than using `yaml.CSafeDumper`. Our benchmarks showed a ~4.4x speedup when using `yaml.dump` with `CSafeDumper`. We also need to remember that `CSafeDumper` doesn't support `width=float('inf')` and throws an OverflowError, so we should use a large integer like `width=2147483646` instead.
**Action:** Use `yaml.CSafeDumper` instead of the default dumper when calling `yaml.dump` in `utils.yaml_converter.json_to_yaml_structure` to reduce CPU blocking during YAML serialization.
