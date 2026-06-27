## 2024-05-19 - Replace pure-Python yaml.safe_load with fast_yaml_load
**Learning:** PyYAML's `yaml.safe_load` is pure Python and notoriously slow, often taking ~23s for 10k iterations of a basic structure. Using the C-based `CSafeLoader` provides a ~7x speedup (~3s for 10k iterations).
**Action:** When working with Python projects parsing YAML frequently, always verify if PyYAML's `CSafeLoader` is available and default to it via a wrapper like `fast_yaml_load`, instead of using `yaml.safe_load` directly.
