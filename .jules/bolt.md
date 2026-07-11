## 2025-03-09 - Faster YAML Loading
**Learning:** Using `yaml.safe_load` for parsing resume configurations is significantly slower than using `yaml.CSafeLoader`. Our benchmarks showed a ~10x speedup when using `yaml.load` with `CSafeLoader`.
**Action:** Use `utils.yaml_converter.fast_yaml_load` instead of `yaml.safe_load` across the codebase to reduce CPU blocking during YAML parsing and PDF generation.

## 2026-07-11 - Stable Callbacks for Memoized Lists
**Learning:** When passing callbacks to memoized list children (like `ExperienceItem` wrapped in `React.memo`), if the parent callback depends on the entire list's state object (e.g. `section`), the callback is recreated on every keystroke. This defeats memoization and causes O(n) re-renders across all items when only one is edited.
**Action:** Use a `useRef` to store the latest state (e.g. `sectionRef.current = section`) inside the parent component, allowing the callback dependency array to omit the state object, preserving a stable callback reference for all children.
