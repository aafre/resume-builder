## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-18 - Faster YAML Serialization
**Learning:** PyYAML's default `yaml.dump` is pure Python and slow. Using `yaml.CSafeDumper` provides a ~5x speedup for serialization. However, `CSafeDumper` doesn't support `width=float('inf')` (raises OverflowError), so we must use a large integer like `width=int(1e9)` to prevent line wrapping.
**Action:** Use a custom `fast_yaml_dump` wrapper that leverages `yaml.CSafeDumper` and `width=int(1e9)` instead of default `yaml.dump` for YAML generation.
