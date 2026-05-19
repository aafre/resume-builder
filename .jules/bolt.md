## 2024-05-19 - Pre-compile regex in hot paths
**Learning:** In utility functions called repeatedly during processing (like `_escape_latex` used during PDF generation), dynamically compiling regex patterns inside the function causes unnecessary overhead.
**Action:** Extract constant dictionaries and use `re.compile()` at the module level for regexes that are used in hot paths.
