## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-16 - Faster YAML Dumping
**Learning:** Similar to `yaml.safe_load`, PyYAML's `yaml.dump` is also slow and CPU blocking. Our benchmarks showed `yaml.dump` with `CSafeDumper` provides a ~4x speedup during serialization.
**Action:** Use a wrapper `fast_yaml_dump` with `CSafeDumper` (and fallback to `SafeDumper`) instead of pure `yaml.dump` for YAML generation, ensuring large width (like `1000000`) since `CSafeDumper` lacks `float('inf')` width support.
