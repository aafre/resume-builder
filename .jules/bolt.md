## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Similar to , PyYAML's default  is pure Python and slow. However, the C extension  crashes with an  if you pass  to prevent line wrapping, which is a common pattern in standard Python YAML serialization.
**Action:** When creating wrappers for fast YAML dumping, explicitly intercept  and convert it to a large integer like  to ensure compatibility with  while maintaining the intended "no line wrap" behavior.

## 2023-10-24 - Faster YAML Dumping
**Learning:** Similar to `yaml.safe_load`, PyYAML's default `yaml.dump` is pure Python and slow. However, the C extension `yaml.CSafeDumper` crashes with an `OverflowError` if you pass `width=float('inf')` to prevent line wrapping, which is a common pattern in standard Python YAML serialization.
**Action:** When creating wrappers for fast YAML dumping, explicitly intercept `width=float('inf')` and convert it to a large integer like `width=int(1e9)` to ensure compatibility with `CSafeDumper` while maintaining the intended "no line wrap" behavior.
