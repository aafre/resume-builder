## 2024-05-17 - Pre-compile Regex in Python
**Learning:** Dynamically compiling regex using `re.compile` inside a frequently called function (like LaTeX escaping) adds unnecessary overhead.
**Action:** Always pre-compile regex patterns at the module level when they are used inside hot paths or loops to improve performance.
