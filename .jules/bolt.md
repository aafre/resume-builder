## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-31 - Faster YAML Dumping and width handling
**Learning:** Using `yaml.dump` with the default pure Python dumper is slow. `yaml.CSafeDumper` provides ~3-4x speedup. However, `CSafeDumper` cannot handle `width=float('inf')` and raises an `OverflowError`, requiring `width=int(1e9)` instead.
**Action:** Created `fast_yaml_dump` wrapper using `CSafeDumper` in `utils/yaml_converter.py` and replaced `yaml.dump` calls across `app.py` and scripts to optimize PDF generation pipelines.
