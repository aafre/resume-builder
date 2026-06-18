## 2024-06-10 - PyYAML CSafeLoader Performance
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for large files. `yaml.CSafeLoader` offers an 8.56x speedup.
**Action:** Always prefer `yaml.CSafeLoader` via `utils.yaml_converter.fast_yaml_load` with a fallback to `yaml.SafeLoader` when parsing YAML files to avoid I/O blocking.
