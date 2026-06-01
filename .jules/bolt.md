
## 2024-06-01 - Optimizing YAML Parsing Performance
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow (~47.754s for large files in benchmarks). By using `yaml.load(stream, Loader=yaml.CSafeLoader)`, parsing speeds up dramatically (~4.877s).
**Action:** Created `fast_yaml_load` utility in `utils/yaml_converter.py` to use `CSafeLoader` with a fallback, and replaced all `yaml.safe_load` usages globally.
