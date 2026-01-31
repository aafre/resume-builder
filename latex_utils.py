"""
LaTeX utility functions for escaping and formatting text.

This module provides shared utility functions for LaTeX text processing,
including special character escaping and markdown-to-LaTeX conversion.
These functions are used by both app.py and resume_generator_latex.py
to ensure consistent LaTeX processing across the application.
"""

import re


def _escape_latex(text):
    r"""Escapes special LaTeX characters in a string to prevent compilation errors.

    Note: Does NOT escape characters used in markdown syntax (~, *, _, +) because
    they are converted to LaTeX commands by the markdown filters before rendering.
    The markdown_formatting filter converts:
      ~~text~~ → \sout{text}
      **text** → \textbf{text}
      *text* → \textit{text}
      __text__ → \textbf{text}
      _text_ → \textit{text}
      ++text++ → \underline{text}

    Args:
        text (str): The input string to be escaped.

    Returns:
        str: The string with LaTeX special characters escaped.
    """
    if not isinstance(text, str):
        # Return non-string types (like numbers, booleans) as is,
        # as they don't need LaTeX escaping.
        return text

    # Define a mapping for LaTeX special characters
    # Order matters for some replacements (e.g., '\' before '&')
    # NOTE: We intentionally DO NOT escape certain characters used in markdown syntax:
    # - ~ (tilde) is used for strikethrough: ~~text~~
    # - * (asterisk) is used for bold/italic: **text** or *text*
    # - _ (underscore) is used for bold/italic: __text__ or _text_
    # - + (plus) is used for underline: ++text++
    # These will be converted to LaTeX commands by the markdown filters.
    # Users should avoid literal underscores/tildes in text, or use asterisks for bold/italic instead.
    latex_special_chars = {
        "\\": r"\textbackslash{}",  # Backslash must be escaped first
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        # "_": r"\_",  # NOT escaped - used for markdown bold/italic (__text__ and _text_)
        "{": r"\{",
        "}": r"\}",
        # "~": r"\textasciitilde{}",  # NOT escaped - used for markdown strikethrough (~~text~~)
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        "-": r"{-}",  # Protect hyphens that might be misinterpreted as math operators
    }

    # Use a regular expression to find and replace all special characters
    # This approach ensures each character is handled once
    pattern = re.compile("|".join(re.escape(key) for key in latex_special_chars.keys()))
    escaped_text = pattern.sub(lambda match: latex_special_chars[match.group(0)], text)

    return escaped_text


def convert_markdown_formatting_to_latex(text):
    """
    Convert Markdown-style formatting to LaTeX commands.

    Supports:
    - Bold: **text** or __text__ → \\textbf{text}
    - Italic: *text* or _text_ → \\textit{text}
    - Strikethrough: ~~text~~ → \\sout{text}
    - Underline: ++text++ → \\underline{text} (custom syntax, not standard markdown)

    Args:
        text: String that may contain markdown formatting

    Returns:
        String with markdown formatting converted to LaTeX commands

    Example:
        "This is **bold** and *italic*" -> "This is \\textbf{bold} and \\textit{italic}"
    """
    if not text or not isinstance(text, str):
        return text

    # Process in specific order to avoid conflicts
    # 1. Bold with ** (must come before single *)
    text = re.sub(r'\*\*(.+?)\*\*', r'\\textbf{\1}', text)

    # 2. Bold with __ (must come before single _)
    text = re.sub(r'__(.+?)__', r'\\textbf{\1}', text)

    # 3. Italic with * (after ** is processed)
    text = re.sub(r'\*(.+?)\*', r'\\textit{\1}', text)

    # 4. Italic with _ (after __ is processed)
    text = re.sub(r'_(.+?)_', r'\\textit{\1}', text)

    # 5. Strikethrough with ~~
    text = re.sub(r'~~(.+?)~~', r'\\sout{\1}', text)

    # 6. Underline with ++ (custom syntax)
    text = re.sub(r'\+\+(.+?)\+\+', r'\\underline{\1}', text)

    return text
