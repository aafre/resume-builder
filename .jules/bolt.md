## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.
## 2026-07-27 - Optimize PyYAML dump performance
**Learning:** By default, `yaml.dump` uses a pure Python dumper which is slow. Using `CSafeDumper` offers a significant (~10x) speedup. However, `CSafeDumper` does not support `width=float("inf")` and will raise an `OverflowError`.
**Action:** Always wrap `yaml.dump` with a function that defaults to `CSafeDumper` and replaces `width=float("inf")` with `width=int(1e9)` for performance without bugs.
