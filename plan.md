1. **Add `fast_yaml_dump` function to `utils/yaml_converter.py`:**
   - Create a function that utilizes `yaml.CSafeDumper` for significantly faster YAML serialization (~5-10x speedup), similar to the existing `fast_yaml_load` function.
   - Ensure to handle the `width=float('inf')` issue that causes an `OverflowError` with `CSafeDumper` by mapping it to a large integer like `2147483646` when present in kwargs.
2. **Replace `yaml.dump` and `yaml.safe_dump` usage with `fast_yaml_dump`:**
   - In `utils/yaml_converter.py`, replace `yaml.dump` in `json_to_yaml_structure` with `fast_yaml_dump`.
   - In `app.py`, replace `yaml.safe_dump` and `yaml.dump` usages with `fast_yaml_dump` after importing it.
   - In `scripts/generate_example_previews.py`, replace `yaml.dump` with `fast_yaml_dump` after importing it.
3. **Verify the changes:**
   - Run linter and tests to ensure no functionality is broken.
   - Ensure the PDF generation and YAML endpoints still work correctly without raising exceptions (especially overflow errors).
4. **Pre-commit and submit:**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
   - Submit the PR with the title "⚡ Bolt: [performance improvement]" and description following Bolt's format.
