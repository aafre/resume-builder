"""
Tests for resume save logic (POST /api/resumes).

Tests cover:
1. Save creates new resume when no ID
2. Save updates existing resume
3. Smart diffing (skip save when hash unchanged)
4. Hash computation
5. Template validation
6. LinkedIn migration

Run tests:
    pytest tests/test_resume_save.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os
import json
import hashlib
import base64

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, TEST_RESUME_ID
)


class TestSaveResumeBasics:
    """Tests for basic save resume functionality."""

    def test_save_resume_creates_new_if_no_id(self, flask_test_client, auth_headers):
        """Verify saving without ID creates new resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses: check limit, upsert resume, delete icons, upsert prefs
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit (under 5)
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': None,  # New resume
                'title': 'New Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John Doe'},
                'sections': [],
                'icons': []
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'resume_id' in data

    def test_save_resume_updates_existing(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify saving with ID updates existing resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,  # Existing
                'title': 'Updated Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'Jane Doe'},
                'sections': [],
                'icons': []
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True


class TestSmartDiffing:
    """Tests for smart diffing (skip save when hash unchanged)."""

    def test_save_resume_skips_when_hash_unchanged(self, flask_test_client, auth_headers):
        """Verify save is skipped when content hash hasn't changed."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        contact_info = {'name': 'John Doe'}
        sections = []
        icons = []

        # Compute expected hash
        json_repr = json.dumps({
            'contact_info': contact_info,
            'sections': sections,
            'icon_metadata': []
        }, sort_keys=True)
        expected_hash = hashlib.sha256(json_repr.encode('utf-8')).hexdigest()

        # Configure mock to return same hash
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': expected_hash}]),  # verify ownership
            create_mock_response([]),  # upsert prefs (even when skipped)
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Same Resume',
                'template_id': 'modern-with-icons',
                'contact_info': contact_info,
                'sections': sections,
                'icons': icons
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data.get('skipped') is True
        assert 'No changes detected' in data.get('message', '')

    def test_save_resume_proceeds_when_hash_changed(self, flask_test_client, auth_headers):
        """Verify save proceeds when content hash has changed."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return different hash
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'different-hash'}]),  # verify ownership
            create_mock_response([]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Updated Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'Changed Name'},
                'sections': [],
                'icons': []
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data.get('skipped') is not True

    def test_save_resume_computes_correct_hash(self, flask_test_client, auth_headers):
        """Verify hash is computed correctly including icon metadata."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        contact_info = {'name': 'Test'}
        sections = [{'name': 'Section', 'type': 'text', 'content': 'Content'}]

        # Icon data
        icon_content = b'fake-icon-data'
        icon_b64 = base64.b64encode(icon_content).decode('utf-8')

        # Compute expected hash with icon metadata
        icon_metadata = [{'filename': 'icon.png', 'size': len(icon_content)}]
        json_repr = json.dumps({
            'contact_info': contact_info,
            'sections': sections,
            'icon_metadata': sorted(icon_metadata, key=lambda x: x['filename'])
        }, sort_keys=True)
        expected_hash = hashlib.sha256(json_repr.encode('utf-8')).hexdigest()

        # Configure mock to return this exact hash (should skip)
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': expected_hash}]),
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': contact_info,
                'sections': sections,
                'icons': [{'filename': 'icon.png', 'data': icon_b64}]
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        # If hash matches, should skip
        assert data.get('skipped') is True


class TestSaveResumeValidation:
    """Tests for save resume validation."""

    def test_save_resume_validates_template_id(self, flask_test_client, auth_headers):
        """Verify template_id is required."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.post(
            '/api/resumes',
            json={
                'id': None,
                'title': 'Test',
                'template_id': None,  # Missing
                'contact_info': {},
                'sections': []
            },
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'template_id' in data['error'].lower()

    def test_save_resume_requires_json_data(self, flask_test_client, auth_headers):
        """Verify empty request body returns 400."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.post(
            '/api/resumes',
            json={},  # Send empty JSON object
            headers=auth_headers
        )

        # The endpoint returns 400 for no data provided
        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] is False

    def test_save_resume_returns_404_for_nonexistent(self, flask_test_client, auth_headers):
        """Verify updating nonexistent resume returns 404."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty (not found)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            '/api/resumes',
            json={
                'id': 'nonexistent-id',
                'title': 'Test',
                'template_id': 'modern-with-icons',
                'contact_info': {},
                'sections': []
            },
            headers=auth_headers
        )

        assert response.status_code == 404


class TestLinkedInMigration:
    """Tests for LinkedIn field migration to social_links."""

    def test_save_resume_migrates_linkedin_to_social_links(self, flask_test_client, auth_headers):
        """Verify old linkedin field is migrated to social_links array."""
        client, mock_sb, flask_app = flask_test_client

        # Test the migrate_linkedin_to_social_links function directly
        contact_info = {
            'name': 'John Doe',
            'linkedin': 'https://linkedin.com/in/johndoe',
            'linkedin_display': 'John Doe'
        }

        result = flask_app.migrate_linkedin_to_social_links(contact_info)

        assert 'social_links' in result
        assert len(result['social_links']) == 1
        assert result['social_links'][0]['platform'] == 'linkedin'
        assert result['social_links'][0]['url'] == 'https://linkedin.com/in/johndoe'

    def test_migrate_linkedin_preserves_existing_social_links(self, flask_test_client):
        """Verify existing social_links are not modified."""
        client, mock_sb, flask_app = flask_test_client

        contact_info = {
            'name': 'John Doe',
            'linkedin': 'https://linkedin.com/in/old',  # Old field
            'social_links': [  # Already has social_links
                {'platform': 'github', 'url': 'https://github.com/johndoe'}
            ]
        }

        result = flask_app.migrate_linkedin_to_social_links(contact_info)

        # Should preserve existing social_links, not add linkedin
        assert len(result['social_links']) == 1
        assert result['social_links'][0]['platform'] == 'github'

    def test_migrate_linkedin_handles_empty_linkedin(self, flask_test_client):
        """Verify empty linkedin field is handled gracefully."""
        client, mock_sb, flask_app = flask_test_client

        contact_info = {
            'name': 'John Doe',
            'linkedin': ''  # Empty
        }

        result = flask_app.migrate_linkedin_to_social_links(contact_info)

        assert 'social_links' in result
        assert result['social_links'] == []


class TestSaveResumeHashUpdates:
    """Tests for json_hash updates during save."""

    def test_save_resume_updates_json_hash(self, flask_test_client, auth_headers):
        """Verify json_hash is updated on successful save."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'New Name'},
                'sections': [],
                'icons': []
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify upsert was called with json_hash
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        assert len(upsert_calls) > 0

        # Find the resume upsert call (should have json_hash)
        resume_upsert = None
        for call in upsert_calls:
            if 'json_hash' in call[0][0]:
                resume_upsert = call
                break

        assert resume_upsert is not None
        assert resume_upsert[0][0]['json_hash'] is not None


class TestSaveResumeAIMetadata:
    """Tests for AI import metadata handling."""

    def test_save_resume_stores_ai_import_warnings(self, flask_test_client, auth_headers):
        """Verify AI import warnings are stored when provided."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        ai_warnings = [{'field': 'name', 'message': 'Could not extract'}]

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),
            create_mock_response([]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John'},
                'sections': [],
                'icons': [],
                'ai_import_warnings': ai_warnings,
                'ai_import_confidence': 0.85
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify upsert was called with AI metadata
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        resume_upsert = upsert_calls[0]
        resume_data = resume_upsert[0][0]

        assert resume_data.get('ai_import_warnings') == ai_warnings
        assert resume_data.get('ai_import_confidence') == 0.85
