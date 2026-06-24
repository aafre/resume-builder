
## 2026-06-24 - Replace yaml.safe_load with CSafeLoader
**Learning:** PyYAML's default `yaml.safe_load` is notoriously slow because it is pure Python. In operations that process numerous YAML files, such as loading templates or bulk testing, this results in significant latency.
**Action:** Replace `yaml.safe_load` with `yaml.load(file, Loader=yaml.CSafeLoader)` (with a fallback to `SafeLoader`) to achieve a nearly 7x performance boost for YAML parsing (Slow: 8.175s, Fast: 1.130s for 10000 loads).
