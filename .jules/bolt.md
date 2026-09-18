## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2025-03-09 - Faster YAML Dumping
**Learning:** Just like `yaml.safe_load`, using standard `yaml.dump` is noticeably slow, especially during PDF generation which blocks the server event loop. Using `yaml.CSafeDumper` provides a significant (~10x) performance boost. Additionally, using `width=float('inf')` with `CSafeDumper` raises an `OverflowError` (it expects an integer), so we must use a large integer like `2147483646` instead.
**Action:** Created `fast_yaml_dump` in `utils.yaml_converter` leveraging `yaml.CSafeDumper` and replaced slow `yaml.dump` calls across `app.py` and backend scripts.
