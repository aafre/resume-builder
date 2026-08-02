## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - PyYAML CSafeDumper OverflowError Edge Case
**Learning:** PyYAML's default `yaml.dump` is pure Python and slow. While replacing it with `yaml.dump(..., Dumper=yaml.CSafeDumper)` yields a massive speedup, `CSafeDumper` raises an `OverflowError` if you pass `width=float('inf')` to prevent line wrapping (which works fine in the pure-Python dumper).
**Action:** Use a large integer like `width=int(1e9)` instead of `float('inf')` when using `CSafeDumper` to achieve both speed and non-wrapping behavior.
