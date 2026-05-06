## 2025-05-06 - Pre-compile Regex in hot paths
**Learning:** The application dynamically builds and compiles regex patterns in hot paths like LaTeX escaping and Markdown formatting, which gets called heavily per-resume generation.
**Action:** Always pre-compile regular expressions at the module level when they are called frequently in hot loops or render cycles to avoid redundant compilation overhead.
