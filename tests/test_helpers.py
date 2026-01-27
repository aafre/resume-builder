"""
Tests for helper functions in app.py.

Tests cover:
1. normalize_sections() - Section type normalization
2. extract_icons_from_yaml() - Icon reference extraction
3. Markdown conversion functions
4. _escape_latex() - LaTeX special character escaping
5. calculate_columns() - Dynamic column calculation

Run tests:
    pytest tests/test_helpers.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestNormalizeSections:
    """Tests for normalize_sections helper function."""

    def test_normalize_adds_type_to_experience_section(self, flask_test_client):
        """Verify sections named 'Experience' get type='experience'."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'name': 'Experience', 'content': []}
            ]
        }

        result = flask_app.normalize_sections(data)

        assert result['sections'][0]['type'] == 'experience'

    def test_normalize_adds_type_to_education_section(self, flask_test_client):
        """Verify sections named 'Education' get type='education'."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'name': 'Education', 'content': []}
            ]
        }

        result = flask_app.normalize_sections(data)

        assert result['sections'][0]['type'] == 'education'

    def test_normalize_preserves_existing_type(self, flask_test_client):
        """Verify existing type attribute is not overwritten."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'name': 'Experience', 'type': 'custom', 'content': []}
            ]
        }

        result = flask_app.normalize_sections(data)

        assert result['sections'][0]['type'] == 'custom'

    def test_normalize_case_insensitive(self, flask_test_client):
        """Verify normalization is case-insensitive."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'name': 'EXPERIENCE', 'content': []},
                {'name': 'education', 'content': []}
            ]
        }

        result = flask_app.normalize_sections(data)

        assert result['sections'][0]['type'] == 'experience'
        assert result['sections'][1]['type'] == 'education'

    def test_normalize_ignores_other_sections(self, flask_test_client):
        """Verify other section names don't get type added."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'name': 'Skills', 'content': []},
                {'name': 'Summary', 'content': []}
            ]
        }

        result = flask_app.normalize_sections(data)

        assert 'type' not in result['sections'][0] or result['sections'][0].get('type') is None
        assert 'type' not in result['sections'][1] or result['sections'][1].get('type') is None

    def test_normalize_handles_missing_sections(self, flask_test_client):
        """Verify data without sections key is handled."""
        client, mock_sb, flask_app = flask_test_client

        data = {'contact_info': {'name': 'John'}}

        result = flask_app.normalize_sections(data)

        assert 'sections' not in result


class TestExtractIconsFromYaml:
    """Tests for extract_icons_from_yaml helper function."""

    def test_extract_icons_finds_all_references(self, flask_test_client):
        """Verify all icon references are extracted."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {
                    'content': [
                        {'icon': 'icon1.png'},
                        {'icon': 'icon2.png'}
                    ]
                }
            ]
        }

        icons = flask_app.extract_icons_from_yaml(data)

        assert icons == {'icon1.png', 'icon2.png'}

    def test_extract_icons_handles_nested_data(self, flask_test_client):
        """Verify deeply nested icons are found."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'level1': {
                'level2': {
                    'level3': {'icon': 'deep.png'}
                }
            }
        }

        icons = flask_app.extract_icons_from_yaml(data)

        assert 'deep.png' in icons

    def test_extract_icons_strips_path_prefix(self, flask_test_client):
        """Verify /icons/ prefix is stripped."""
        client, mock_sb, flask_app = flask_test_client

        data = {'sections': [{'content': [{'icon': '/icons/prefixed.png'}]}]}

        icons = flask_app.extract_icons_from_yaml(data)

        assert 'prefixed.png' in icons
        assert '/icons/prefixed.png' not in icons

    def test_extract_icons_returns_unique_set(self, flask_test_client):
        """Verify duplicate icon references result in unique set."""
        client, mock_sb, flask_app = flask_test_client

        data = {
            'sections': [
                {'content': [{'icon': 'same.png'}, {'icon': 'same.png'}]}
            ]
        }

        icons = flask_app.extract_icons_from_yaml(data)

        assert icons == {'same.png'}
        assert len(icons) == 1


class TestMarkdownToHtmlConversion:
    """Tests for convert_markdown_links_to_html function."""

    def test_convert_markdown_links_to_html(self, flask_test_client):
        """Verify markdown links are converted to HTML anchor tags."""
        client, mock_sb, flask_app = flask_test_client

        text = 'Visit [Google](https://google.com) for more info.'

        result = flask_app.convert_markdown_links_to_html(text)

        assert '<a href="https://google.com">Google</a>' in result

    def test_convert_multiple_links(self, flask_test_client):
        """Verify multiple links are converted."""
        client, mock_sb, flask_app = flask_test_client

        text = '[Link1](url1) and [Link2](url2)'

        result = flask_app.convert_markdown_links_to_html(text)

        assert '<a href="url1">Link1</a>' in result
        assert '<a href="url2">Link2</a>' in result

    def test_convert_preserves_surrounding_text(self, flask_test_client):
        """Verify surrounding text is preserved."""
        client, mock_sb, flask_app = flask_test_client

        text = 'Before [Link](url) after.'

        result = flask_app.convert_markdown_links_to_html(text)

        assert result == 'Before <a href="url">Link</a> after.'

    def test_convert_handles_empty_input(self, flask_test_client):
        """Verify empty/None input is handled."""
        client, mock_sb, flask_app = flask_test_client

        assert flask_app.convert_markdown_links_to_html('') == ''
        assert flask_app.convert_markdown_links_to_html(None) is None


class TestMarkdownFormattingToHtml:
    """Tests for convert_markdown_formatting_to_html function."""

    def test_bold_double_asterisk(self, flask_test_client):
        """Verify **text** converts to <strong>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is **bold** text.')

        assert '<strong>bold</strong>' in result

    def test_bold_double_underscore(self, flask_test_client):
        """Verify __text__ converts to <strong>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is __bold__ text.')

        assert '<strong>bold</strong>' in result

    def test_italic_single_asterisk(self, flask_test_client):
        """Verify *text* converts to <em>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is *italic* text.')

        assert '<em>italic</em>' in result

    def test_italic_single_underscore(self, flask_test_client):
        """Verify _text_ converts to <em>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is _italic_ text.')

        assert '<em>italic</em>' in result

    def test_strikethrough(self, flask_test_client):
        """Verify ~~text~~ converts to <s>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is ~~strikethrough~~ text.')

        assert '<s>strikethrough</s>' in result

    def test_underline(self, flask_test_client):
        """Verify ++text++ converts to <u>."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_html('This is ++underlined++ text.')

        assert '<u>underlined</u>' in result


class TestMarkdownToLatexConversion:
    """Tests for convert_markdown_links_to_latex function."""

    def test_convert_markdown_links_to_latex(self, flask_test_client):
        """Verify markdown links convert to LaTeX href."""
        client, mock_sb, flask_app = flask_test_client

        text = 'Visit [Google](https://google.com)'

        result = flask_app.convert_markdown_links_to_latex(text)

        assert r'\href{https://google.com}{Google}' in result


class TestMarkdownFormattingToLatex:
    """Tests for convert_markdown_formatting_to_latex function."""

    def test_bold_to_latex(self, flask_test_client):
        """Verify **text** converts to \\textbf."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_latex('This is **bold**.')

        assert r'\textbf{bold}' in result

    def test_italic_to_latex(self, flask_test_client):
        """Verify *text* converts to \\textit."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_latex('This is *italic*.')

        assert r'\textit{italic}' in result

    def test_strikethrough_to_latex(self, flask_test_client):
        """Verify ~~text~~ converts to \\sout."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_latex('This is ~~struck~~.')

        assert r'\sout{struck}' in result

    def test_underline_to_latex(self, flask_test_client):
        """Verify ++text++ converts to \\underline."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.convert_markdown_formatting_to_latex('This is ++underlined++.')

        assert r'\underline{underlined}' in result


class TestEscapeLatex:
    """Tests for _escape_latex helper function."""

    def test_escape_latex_special_chars(self, flask_test_client):
        """Verify LaTeX special characters are escaped."""
        client, mock_sb, flask_app = flask_test_client

        # Test common special chars
        assert r'\&' in flask_app._escape_latex('&')
        assert r'\%' in flask_app._escape_latex('%')
        assert r'\$' in flask_app._escape_latex('$')
        assert r'\#' in flask_app._escape_latex('#')
        assert r'\{' in flask_app._escape_latex('{')
        assert r'\}' in flask_app._escape_latex('}')

    def test_escape_latex_preserves_markdown_chars(self, flask_test_client):
        """Verify markdown characters are not escaped (used for formatting)."""
        client, mock_sb, flask_app = flask_test_client

        # These should NOT be escaped as they're used for markdown
        result = flask_app._escape_latex('**bold** and _italic_')

        # * and _ should remain for markdown processing
        assert '**bold**' in result
        assert '_italic_' in result

    def test_escape_latex_handles_non_string(self, flask_test_client):
        """Verify non-string input is returned unchanged."""
        client, mock_sb, flask_app = flask_test_client

        assert flask_app._escape_latex(123) == 123
        assert flask_app._escape_latex(None) is None
        assert flask_app._escape_latex(['list']) == ['list']


class TestCalculateColumns:
    """Tests for calculate_columns helper function."""

    def test_calculate_columns_single_item(self, flask_test_client):
        """Verify single item returns 1 column."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.calculate_columns(1)

        assert result == 1

    def test_calculate_columns_few_items(self, flask_test_client):
        """Verify few items returns appropriate columns."""
        client, mock_sb, flask_app = flask_test_client

        # 2 items with min 2 per column = 1 column
        result = flask_app.calculate_columns(2, max_columns=4, min_items_per_column=2)
        assert result == 1

    def test_calculate_columns_many_items(self, flask_test_client):
        """Verify many items uses multiple columns."""
        client, mock_sb, flask_app = flask_test_client

        # 10 items with min 2 per column, max 4 columns
        result = flask_app.calculate_columns(10, max_columns=4, min_items_per_column=2)

        assert result >= 2
        assert result <= 4

    def test_calculate_columns_respects_max(self, flask_test_client):
        """Verify max_columns is respected."""
        client, mock_sb, flask_app = flask_test_client

        # 100 items, max 4 columns
        result = flask_app.calculate_columns(100, max_columns=4, min_items_per_column=2)

        assert result == 4

    def test_calculate_columns_invalid_max_raises(self, flask_test_client):
        """Verify invalid max_columns raises ValueError."""
        client, mock_sb, flask_app = flask_test_client

        with pytest.raises(ValueError):
            flask_app.calculate_columns(10, max_columns=0)


class TestGetSocialMediaHandle:
    """Tests for get_social_media_handle helper function."""

    def test_linkedin_handle_extraction(self, flask_test_client):
        """Verify LinkedIn handle is extracted from URL."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle(
            'https://linkedin.com/in/john-doe',
            'linkedin'
        )

        assert result == 'john-doe'

    def test_github_handle_extraction(self, flask_test_client):
        """Verify GitHub handle is extracted from URL."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle(
            'https://github.com/johndoe',
            'github'
        )

        assert result == 'johndoe'

    def test_twitter_handle_extraction(self, flask_test_client):
        """Verify Twitter handle is extracted with @ prefix."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle(
            'https://twitter.com/johndoe',
            'twitter'
        )

        assert result == '@johndoe'

    def test_stackoverflow_handle_extraction(self, flask_test_client):
        """Verify StackOverflow username is extracted."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle(
            'https://stackoverflow.com/users/12345/john-doe',
            'stackoverflow'
        )

        assert result == 'john-doe'

    def test_medium_handle_extraction(self, flask_test_client):
        """Verify Medium handle is extracted with @ prefix."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle(
            'https://medium.com/@johndoe',
            'medium'
        )

        assert '@johndoe' in result

    def test_empty_url_returns_empty(self, flask_test_client):
        """Verify empty URL returns empty string."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.get_social_media_handle('', 'linkedin')

        assert result == ''
