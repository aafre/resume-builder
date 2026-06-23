## 2025-06-20 - Replace yaml.safe_load with fast_yaml_load
**Learning:** PyYAML's default yaml.safe_load is pure Python and slow (~21.5s for 100 iterations of large yaml). Using yaml.load(file, Loader=yaml.CSafeLoader) provides an ~8.4x speedup (~2.5s) while remaining safe.
**Action:** Created fast_yaml_load utility to try CSafeLoader with fallback to SafeLoader. Evaluate try/except once at module level to avoid import overhead.
