## 2024-05-24 - PyYAML Parsing Bottleneck
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow for large config/files. Our benchmark showed a drop from 13.715s to 1.998s for 100k items.
**Action:** Use `yaml.load(file, Loader=yaml.CSafeLoader)` with a `try/except` fallback to `yaml.SafeLoader` for a ~6.8x parsing speedup on large configurations or I/O bound tasks.
