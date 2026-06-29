## 2024-05-19 - YAML Parsing Optimization
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` provides a ~7-10x parsing speedup without sacrificing safety.
**Action:** When a Python application frequently parses YAML (e.g. template engines, data converters), evaluate creating a centralized utility like `fast_yaml_load` to encapsulate the `CSafeLoader` import block and replace `yaml.safe_load` calls throughout the codebase.
