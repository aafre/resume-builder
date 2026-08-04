## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Dumping
**Learning:** The default `yaml.dump` is pure Python and very slow. Using `yaml.dump` with `CSafeDumper` provides significant speedups during serialization. `CSafeDumper` throws an error if `width=float('inf')` is passed, so `width=int(1e9)` must be used instead.
**Action:** Created `fast_yaml_dump` utility in `utils/yaml_converter.py` and replaced usages of `yaml.dump` across backend to reduce blocking time.
