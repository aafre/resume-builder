## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## $(date +%Y-%m-%d) - Memoizing List Items with Expensive Editors
**Learning:** Rendering complex input components (like TipTap rich text editors) inside unmemoized mapping functions in React leads to severe input lag. When a single item updates, all sibling editors needlessly re-initialize.
**Action:** Always extract list items into a `React.memo` component when they contain expensive child components, and ensure the parent provides stable callback references via `useCallback`.
