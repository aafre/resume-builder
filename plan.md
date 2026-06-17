1. **Add `fast_yaml_load` to `utils/yaml_converter.py`**
   - Import `yaml`. Try to import `CSafeLoader`, fallback to `SafeLoader`.
   - Define `fast_yaml_load(stream)` that uses `yaml.load(stream, Loader=CSafeLoader)`.
   - Replace `yaml.safe_load(yaml_string)` with `fast_yaml_load(yaml_string)` in `utils/yaml_converter.py`.
2. **Update usages of `yaml.safe_load` across the Python codebase**
   - Replace `yaml.safe_load(file)` with `fast_yaml_load(file)` and add the appropriate import: `from utils.yaml_converter import fast_yaml_load`
   - Files to update:
     - `app.py`
     - `resume_generator.py`
     - `resume_generator_for_latex.py`
     - `scripts/generate_example_previews.py`
3. **Verify changes**
   - Run tests `python -m pytest tests/`
   - Run `black` and `isort`
4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
5. **Submit the PR**
   - Create PR using `submit` tool with proper format.
