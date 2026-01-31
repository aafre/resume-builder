"""
Basic test to verify that latex_utils functions work correctly after refactoring.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from latex_utils import _escape_latex, convert_markdown_formatting_to_latex


def test_escape_latex():
    """Test the _escape_latex function."""
    print("Testing _escape_latex...")
    
    # Test basic escaping
    assert _escape_latex("Hello & World") == r"Hello \& World"
    assert _escape_latex("50% off") == r"50\% off"
    assert _escape_latex("Price: $100") == r"Price: \$100"
    assert _escape_latex("Section #1") == r"Section \#1"
    
    # Test that markdown characters are NOT escaped
    assert _escape_latex("**bold**") == "**bold**"
    assert _escape_latex("_italic_") == "_italic_"
    assert _escape_latex("~~strikethrough~~") == "~~strikethrough~~"
    
    # Test non-string input
    assert _escape_latex(123) == 123
    assert _escape_latex(None) is None
    
    print("✓ _escape_latex tests passed")


def test_convert_markdown_formatting_to_latex():
    """Test the convert_markdown_formatting_to_latex function."""
    print("Testing convert_markdown_formatting_to_latex...")
    
    # Test bold
    assert convert_markdown_formatting_to_latex("**bold**") == r"\textbf{bold}"
    assert convert_markdown_formatting_to_latex("__bold__") == r"\textbf{bold}"
    
    # Test italic
    assert convert_markdown_formatting_to_latex("*italic*") == r"\textit{italic}"
    assert convert_markdown_formatting_to_latex("_italic_") == r"\textit{italic}"
    
    # Test strikethrough
    assert convert_markdown_formatting_to_latex("~~strike~~") == r"\sout{strike}"
    
    # Test underline (custom syntax)
    assert convert_markdown_formatting_to_latex("++underline++") == r"\underline{underline}"
    
    # Test mixed formatting
    result = convert_markdown_formatting_to_latex("This is **bold** and *italic*")
    assert result == r"This is \textbf{bold} and \textit{italic}"
    
    # Test non-string input
    assert convert_markdown_formatting_to_latex(None) is None
    assert convert_markdown_formatting_to_latex("") == ""
    
    print("✓ convert_markdown_formatting_to_latex tests passed")


def test_app_imports():
    """Test that app.py can import from latex_utils."""
    print("Testing app.py imports...")
    try:
        import app
        # Verify that the functions are available
        assert hasattr(app, '_escape_latex')
        assert hasattr(app, 'convert_markdown_formatting_to_latex')
        print("✓ app.py imports successfully")
    except Exception as e:
        print(f"✗ app.py import failed: {e}")
        raise


def test_resume_generator_latex_imports():
    """Test that resume_generator_latex.py can import from latex_utils."""
    print("Testing resume_generator_latex.py imports...")
    try:
        import resume_generator_latex
        # Verify that the functions are available
        assert hasattr(resume_generator_latex, '_escape_latex')
        assert hasattr(resume_generator_latex, 'convert_markdown_formatting_to_latex')
        print("✓ resume_generator_latex.py imports successfully")
    except Exception as e:
        print(f"✗ resume_generator_latex.py import failed: {e}")
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("Running basic tests for latex_utils refactoring")
    print("=" * 60)
    print()
    
    try:
        test_escape_latex()
        print()
        test_convert_markdown_formatting_to_latex()
        print()
        test_app_imports()
        print()
        test_resume_generator_latex_imports()
        print()
        print("=" * 60)
        print("✅ All tests passed!")
        print("=" * 60)
    except AssertionError as e:
        print()
        print("=" * 60)
        print(f"❌ Test failed: {e}")
        print("=" * 60)
        sys.exit(1)
    except Exception as e:
        print()
        print("=" * 60)
        print(f"❌ Unexpected error: {e}")
        print("=" * 60)
        sys.exit(1)
