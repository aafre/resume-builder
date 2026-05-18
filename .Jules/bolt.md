## 2024-05-18 - Pre-compile regex in hot paths
**Learning:** Inside Python string escaping routines called heavily during data processing (like `_escape_latex` in `app.py` and `resume_generator_latex.py`), dynamically declaring dictionaries and compiling regular expressions inside the function body adds redundant overhead for each call.
**Action:** Pre-compile regular expressions (`re.compile`) and extract constant dictionaries to the module level.
