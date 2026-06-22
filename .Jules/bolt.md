## 2024-05-18 - Fast YAML Parsing

**Learning:** PyYAML's `yaml.safe_load` uses a pure Python implementation which is significantly slower than its C extension equivalent, `CSafeLoader`. Since YAML parsing happens frequently (especially in PDF generation and importing data), using the slower default method can cause noticeable latency bottlenecks.

**Action:** Replaced instances of `yaml.safe_load` with a custom `fast_yaml_load` utility that uses `yaml.load(data, Loader=yaml.CSafeLoader)` with a fallback to `yaml.SafeLoader` if the C extension isn't available, providing a substantial speed boost for YAML parsing tasks.
