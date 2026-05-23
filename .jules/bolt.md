## 2024-05-23 - Fast YAML Parsing with CSafeLoader
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and slow (~5.25s for 1000 iterations of a sample file). Using `yaml.load(..., Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` is ~10x faster (~0.53s).
**Action:** Always prefer `yaml.load` with `CSafeLoader` over `yaml.safe_load` when parsing YAML files, especially in performance-critical paths or loops.
