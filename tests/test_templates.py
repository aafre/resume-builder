"""
Tests for template API endpoints.

Tests cover:
1. GET /api/templates - List templates
2. GET /api/template/<id> - Get template YAML data
3. GET /api/template/<id>/download - Download template YAML file

Run tests:
    pytest tests/test_templates.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestGetTemplates:
    """Tests for GET /api/templates endpoint."""

    def test_templates_endpoint_returns_json(self, flask_test_client):
        """Verify /api/templates returns JSON with templates list."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/templates')

        assert response.status_code == 200
        assert response.content_type == 'application/json'

    def test_templates_endpoint_returns_success(self, flask_test_client):
        """Verify response has success=True and templates array."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/templates')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'templates' in data
        assert isinstance(data['templates'], list)

    def test_templates_endpoint_returns_all_templates(self, flask_test_client):
        """Verify all defined templates are returned."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/templates')

        data = response.get_json()
        templates = data['templates']

        # Verify expected templates exist
        template_ids = [t['id'] for t in templates]
        assert 'classic-alex-rivera' in template_ids
        assert 'classic-jane-doe' in template_ids
        assert 'modern-no-icons' in template_ids
        assert 'modern-with-icons' in template_ids

    def test_templates_have_required_fields(self, flask_test_client):
        """Verify each template has id, name, description, and image_url."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/templates')

        data = response.get_json()
        for template in data['templates']:
            assert 'id' in template
            assert 'name' in template
            assert 'description' in template
            assert 'image_url' in template

    def test_templates_image_urls_are_valid(self, flask_test_client):
        """Verify template image URLs are properly formatted."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/templates')

        data = response.get_json()
        for template in data['templates']:
            image_url = template['image_url']
            assert '/docs/templates/' in image_url
            assert image_url.endswith('.png')


class TestGetTemplateData:
    """Tests for GET /api/template/<id> endpoint."""

    def test_get_template_data_returns_yaml_content(self, flask_test_client):
        """Verify template data endpoint returns YAML content."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/modern-with-icons')

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'yaml' in data
        assert isinstance(data['yaml'], str)

    def test_get_template_data_returns_supports_icons_flag(self, flask_test_client):
        """Verify supportsIcons flag is returned for icon-supporting templates."""
        client, mock_sb, _ = flask_test_client

        # modern-with-icons should support icons
        response = client.get('/api/template/modern-with-icons')
        data = response.get_json()
        assert data['supportsIcons'] is True

        # modern-no-icons should not support icons
        response = client.get('/api/template/modern-no-icons')
        data = response.get_json()
        assert data['supportsIcons'] is False

    def test_get_template_data_returns_template_id(self, flask_test_client):
        """Verify template_id is included in response."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/modern-with-icons')

        data = response.get_json()
        assert data['template_id'] == 'modern-with-icons'

    def test_get_nonexistent_template_returns_404(self, flask_test_client):
        """Verify 404 is returned for nonexistent template."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/nonexistent-template')

        assert response.status_code == 404
        data = response.get_json()
        assert data['success'] is False
        assert 'not found' in data['error'].lower()

    def test_get_template_yaml_is_valid(self, flask_test_client):
        """Verify returned YAML is valid and parseable."""
        client, mock_sb, _ = flask_test_client

        import yaml

        response = client.get('/api/template/modern-with-icons')
        data = response.get_json()

        # Should be able to parse the YAML
        parsed = yaml.safe_load(data['yaml'])
        assert parsed is not None
        assert isinstance(parsed, dict)

    def test_get_template_yaml_has_required_structure(self, flask_test_client):
        """Verify YAML has contact_info and sections."""
        client, mock_sb, _ = flask_test_client

        import yaml

        response = client.get('/api/template/modern-with-icons')
        data = response.get_json()
        parsed = yaml.safe_load(data['yaml'])

        assert 'contact_info' in parsed
        assert 'sections' in parsed


class TestDownloadTemplate:
    """Tests for GET /api/template/<id>/download endpoint."""

    def test_download_template_returns_yaml_file(self, flask_test_client):
        """Verify download returns YAML file with correct content type."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/modern-with-icons/download')

        assert response.status_code == 200
        assert 'application/x-yaml' in response.content_type or 'text/yaml' in response.content_type

    def test_download_template_has_attachment_disposition(self, flask_test_client):
        """Verify Content-Disposition header for download."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/modern-with-icons/download')

        assert response.status_code == 200
        # Check for attachment header
        content_disposition = response.headers.get('Content-Disposition', '')
        assert 'attachment' in content_disposition.lower()

    def test_download_template_filename_matches_id(self, flask_test_client):
        """Verify downloaded filename matches template ID."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/modern-with-icons/download')

        content_disposition = response.headers.get('Content-Disposition', '')
        assert 'modern-with-icons.yml' in content_disposition

    def test_download_nonexistent_template_returns_404(self, flask_test_client):
        """Verify 404 for nonexistent template download."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/template/nonexistent/download')

        assert response.status_code == 404


class TestTemplateMapping:
    """Tests for template ID to file mapping."""

    def test_classic_templates_map_correctly(self, flask_test_client):
        """Verify classic template IDs map to correct files."""
        client, mock_sb, flask_app = flask_test_client

        # Check the TEMPLATE_FILE_MAP
        assert 'classic-alex-rivera' in flask_app.TEMPLATE_FILE_MAP
        assert 'classic-jane-doe' in flask_app.TEMPLATE_FILE_MAP

    def test_modern_templates_map_correctly(self, flask_test_client):
        """Verify modern template IDs map to correct files."""
        client, mock_sb, flask_app = flask_test_client

        # Check the TEMPLATE_FILE_MAP
        assert 'modern-with-icons' in flask_app.TEMPLATE_FILE_MAP
        assert 'modern-no-icons' in flask_app.TEMPLATE_FILE_MAP
        assert 'modern' in flask_app.TEMPLATE_FILE_MAP

    def test_template_files_exist(self, flask_test_client):
        """Verify all mapped template files actually exist."""
        client, mock_sb, flask_app = flask_test_client

        for template_id, file_path in flask_app.TEMPLATE_FILE_MAP.items():
            assert file_path.exists(), f"Template file missing for {template_id}: {file_path}"


class TestLinkedInDisplayGeneration:
    """Tests for LinkedIn display text generation endpoint."""

    def test_generate_linkedin_display_clean_handle(self, flask_test_client):
        """Verify clean LinkedIn handles generate proper display text."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.generate_linkedin_display_text(
            'https://linkedin.com/in/john-doe',
            None
        )

        # Should format as "John Doe"
        assert result == 'John Doe'

    def test_generate_linkedin_display_messy_handle_with_name(self, flask_test_client):
        """Verify messy handles fall back to provided name."""
        client, mock_sb, flask_app = flask_test_client

        result = flask_app.generate_linkedin_display_text(
            'https://linkedin.com/in/john-doe-a1b2c3d4e5f6',  # Random suffix
            'John Doe'
        )

        # Should use the provided name
        assert result == 'John Doe'

    def test_generate_linkedin_display_fallback_to_profile(self, flask_test_client):
        """Verify fallback to 'LinkedIn Profile' when handle is very messy and no name available."""
        client, mock_sb, flask_app = flask_test_client

        # Use a handle with random suffix that triggers the "messy" detection
        result = flask_app.generate_linkedin_display_text(
            'https://linkedin.com/in/john-doe-a1b2c3d4e5f6g7h8',  # Random suffix (8+ chars)
            None  # No name provided
        )

        # Should fall back to generic when handle is messy and no name
        assert result == 'LinkedIn Profile'

    def test_generate_linkedin_display_endpoint(self, flask_test_client):
        """Test the /api/generate-linkedin-display endpoint."""
        client, mock_sb, _ = flask_test_client

        response = client.post(
            '/api/generate-linkedin-display',
            json={
                'linkedin_url': 'https://linkedin.com/in/john-doe',
                'contact_name': 'John Doe'
            }
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'display_text' in data

    def test_generate_linkedin_display_requires_url(self, flask_test_client):
        """Verify LinkedIn URL is required."""
        client, mock_sb, _ = flask_test_client

        response = client.post(
            '/api/generate-linkedin-display',
            json={'linkedin_url': '', 'contact_name': 'John'}
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] is False
