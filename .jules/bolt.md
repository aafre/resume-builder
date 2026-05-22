## 2024-05-22 - Optimize PyYAML Parsing Speed
**Learning:** PyYAML's default `yaml.safe_load` uses a pure Python implementation which becomes a bottleneck on large configurations or I/O bound tasks.
**Action:** Use `yaml.load(file, Loader=yaml.CSafeLoader)` wrapped in a `try/except ImportError` falling back to `yaml.SafeLoader` for a significant parsing speedup.
