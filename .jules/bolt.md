## 2024-05-09 - Pre-compiling regex in hot paths
**Learning:** The application dynamically constructed and compiled a regular expression using `re.compile` inside the `_escape_latex` function, which is called frequently during PDF generation for every text field. This caused a ~4x performance penalty compared to pre-compiling the regex at the module level.
**Action:** Always pre-compile regular expressions at the module level when they are used inside functions that process text frequently, especially in core data formatting loops like LaTeX generation.
