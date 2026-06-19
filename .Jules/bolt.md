## 2024-06-19 - Replace yaml.safe_load with fast_yaml_load
**Learning:** The default `yaml.safe_load` is pure Python and relatively slow for large or numerous YAML files. Switching to `yaml.load(stream, Loader=yaml.CSafeLoader)` yields an ~5.9x speedup (2.7168s vs 0.4606s for 1000 iterations).
**Action:** Always import and use `fast_yaml_load` from `utils.yaml_converter` instead of standard `yaml.safe_load` throughout the application.
