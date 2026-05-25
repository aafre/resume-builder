## 2024-05-25 - Python PyYAML Optimization
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and parses large YAML structures very slowly. There's a `CSafeLoader` available when built with libyaml support that can be nearly 10x faster for I/O bound parsing tasks.
**Action:** When working with yaml parsing, use `yaml.load(file, Loader=yaml.CSafeLoader)` with a `try/except` fallback to `yaml.SafeLoader` for a ~10x parsing speedup.
