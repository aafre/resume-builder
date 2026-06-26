## 2024-06-26 - High-Performance YAML Loading

**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow when parsing large or numerous YAML files. By switching to `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` if `CSafeLoader` isn't available, we get an order-of-magnitude parsing speedup (~10x).

**Action:** Created `fast_yaml_load` utility in `utils/yaml_converter.py` and globally replaced `yaml.safe_load` to use it, preventing performance bottlenecks in backend data parsing.
