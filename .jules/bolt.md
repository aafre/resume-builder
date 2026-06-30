
## 2026-06-30 - PyYAML safe_load Performance Bottleneck
**Learning:** PyYAML's default `yaml.safe_load` is pure Python and very slow. Using `yaml.load(file, Loader=yaml.CSafeLoader)` provides a ~10x parsing speedup.
**Action:** Always use `yaml.load(stream, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader`, evaluating the import at the module level to avoid overhead, and encapsulate it in a utility like `fast_yaml_load`.
