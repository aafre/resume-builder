## 2024-05-08 - Pre-compile Regex in hot paths
**Learning:** Dynamically compiling regular expressions inside functions that are called frequently in hot paths (like text escaping during PDF generation) causes significant overhead. In python, compiling regex is relatively slow.
**Action:** Pre-compile regular expressions (`re.compile`) at the module level when possible, to avoid redundant compilation and improve execution time significantly.
