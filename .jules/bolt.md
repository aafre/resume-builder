## 2024-06-13 - Fast YAML Parsing with PyYAML CSafeLoader

**Learning:** PyYAML's default `yaml.safe_load` is extremely slow because it's implemented in pure Python. The backend frequently parses YAML (for templates, previews, database conversions, and tests). Using `CSafeLoader` provides a ~8-10x performance improvement for parsing YAML data, but it needs to be imported carefully with a try/except block.

**Action:** Created `fast_yaml_load` utility in `utils/yaml_converter.py` to seamlessly use `CSafeLoader` when available, and replaced all instances of `yaml.safe_load` with `fast_yaml_load` across the application.
