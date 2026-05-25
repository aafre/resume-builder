## 2024-05-21 - YAML CSafeLoader Performance
**Learning:** Python's default `yaml.safe_load` is significantly slower than `yaml.load(Loader=yaml.CSafeLoader)` because it relies on pure Python implementation instead of the underlying C library. In I/O bound tasks like loading resume templates or validating resume files, this makes a ~10x difference in parsing speed.
**Action:** When loading YAML files, especially large configurations or within a web request path, use `yaml.load(file, Loader=yaml.CSafeLoader)` with a fallback to the pure Python `SafeLoader`.
