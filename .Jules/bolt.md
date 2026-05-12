
## 2025-02-14 - Pre-compiling Regexes in Python
**Learning:** The Python backend dynamically compiled regexes over 10 times per text segment during PDF/LaTeX generation, impacting performance. `re.sub` compiles regex every time if passed as a string.
**Action:** Always pre-compile `re.compile()` for regexes that are heavily used in iterative rendering/loops, especially for text escaping and rich text logic in Python apps.
