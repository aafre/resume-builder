## 2024-07-01 - Optimizing YAML Parsing
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for large configurations or frequent parses. Using `yaml.load(..., Loader=yaml.CSafeLoader)` gives an ~10.28x speedup.
**Action:** Always prefer `yaml.CSafeLoader` over `yaml.safe_load` when parsing YAML, and abstract the fallback logic behind a utility function (e.g. `fast_yaml_load`) to handle environments where the C extension isn't available.
