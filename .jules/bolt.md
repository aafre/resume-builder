## 2024-06-09 - PyYAML CSafeLoader Optimization
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow for large configurations or I/O bound tasks. A fallback mechanism to `yaml.load(file, Loader=yaml.CSafeLoader)` yields an ~8.6x parsing speedup.
**Action:** Implement a global `fast_yaml_load` utility using `yaml.CSafeLoader` in Python codebases handling extensive YAML processing to significantly reduce parsing bottlenecks.
