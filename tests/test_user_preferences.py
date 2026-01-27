"""
Tests for user preferences API endpoints.

Tests cover:
1. GET /api/user/preferences - Get user preferences
2. POST /api/user/preferences - Update user preferences

Run tests:
    pytest tests/test_user_preferences.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, TEST_RESUME_ID
)


class TestGetUserPreferences:
    """Tests for GET /api/user/preferences endpoint."""

    def test_get_preferences_returns_existing(self, flask_test_client, auth_headers):
        """Verify existing preferences are returned."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        existing_prefs = {
            'user_id': TEST_USER_ID,
            'last_edited_resume_id': TEST_RESUME_ID,
            'preferences': {'theme': 'dark', 'tour_completed': True}
        }

        mock_sb.table.return_value.execute.return_value = create_mock_response([existing_prefs])

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['preferences']['user_id'] == TEST_USER_ID
        assert data['preferences']['last_edited_resume_id'] == TEST_RESUME_ID
        assert data['preferences']['preferences']['theme'] == 'dark'

    def test_get_preferences_returns_defaults_if_none(self, flask_test_client, auth_headers):
        """Verify default preferences are created and returned if none exist."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First call returns empty (no preferences), second is insert
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([]),  # No existing preferences
            create_mock_response([]),  # Insert default preferences
        ]

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['preferences']['user_id'] == TEST_USER_ID
        assert data['preferences']['last_edited_resume_id'] is None
        assert data['preferences']['preferences'] == {}

    def test_get_preferences_creates_default_on_first_access(self, flask_test_client, auth_headers):
        """Verify default preferences are inserted when none exist."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty to trigger insert
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([]),  # No existing
            create_mock_response([]),  # Insert
        ]

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 200

        # Verify insert was called
        insert_calls = mock_sb.table.return_value.insert.call_args_list
        assert len(insert_calls) > 0

        # Verify default structure
        insert_data = insert_calls[0][0][0]
        assert insert_data['user_id'] == TEST_USER_ID
        assert insert_data['last_edited_resume_id'] is None
        assert insert_data['preferences'] == {}

    def test_get_preferences_requires_auth(self, flask_test_client):
        """Verify authentication is required."""
        client, mock_sb, _ = flask_test_client

        response = client.get('/api/user/preferences')

        assert response.status_code == 401


class TestUpdateUserPreferences:
    """Tests for POST /api/user/preferences endpoint."""

    def test_update_preferences_creates_if_not_exists(self, flask_test_client, auth_headers):
        """Verify upsert creates preferences if they don't exist."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            '/api/user/preferences',
            json={
                'last_edited_resume_id': TEST_RESUME_ID,
                'preferences': {'tour_completed': True}
            },
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

        # Verify upsert was called
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        assert len(upsert_calls) > 0

    def test_update_preferences_updates_existing(self, flask_test_client, auth_headers):
        """Verify upsert updates existing preferences."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        new_resume_id = 'new-resume-123'

        response = client.post(
            '/api/user/preferences',
            json={
                'last_edited_resume_id': new_resume_id,
                'preferences': {'idle_nudge_shown': True}
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify upsert was called with new values
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        upsert_data = upsert_calls[0][0][0]
        assert upsert_data['last_edited_resume_id'] == new_resume_id
        assert upsert_data['preferences']['idle_nudge_shown'] is True

    def test_update_preferences_requires_data(self, flask_test_client, auth_headers):
        """Verify empty request body returns 400."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.post(
            '/api/user/preferences',
            json={},  # Send empty JSON object
            headers=auth_headers
        )

        # The endpoint returns 400 for no data provided
        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] is False

    def test_update_preferences_requires_auth(self, flask_test_client):
        """Verify authentication is required."""
        client, mock_sb, _ = flask_test_client

        response = client.post(
            '/api/user/preferences',
            json={'last_edited_resume_id': TEST_RESUME_ID}
        )

        assert response.status_code == 401

    def test_update_preferences_includes_user_id(self, flask_test_client, auth_headers):
        """Verify user_id is always set from authenticated user."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            '/api/user/preferences',
            json={
                'last_edited_resume_id': TEST_RESUME_ID,
                # Even if user_id is provided in request, it should be ignored
                'user_id': 'malicious-user-id'
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify user_id is set from authenticated user, not request
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        upsert_data = upsert_calls[0][0][0]
        assert upsert_data['user_id'] == TEST_USER_ID


class TestPreferencesEdgeCases:
    """Tests for edge cases in preferences handling."""

    def test_get_preferences_handles_database_error(self, flask_test_client, auth_headers):
        """Verify database errors are handled gracefully."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to raise error
        mock_sb.table.return_value.execute.side_effect = Exception("Database error")

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 500
        data = response.get_json()
        assert data['success'] is False

    def test_update_preferences_handles_database_error(self, flask_test_client, auth_headers):
        """Verify database errors during update are handled gracefully."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to raise error
        mock_sb.table.return_value.upsert.return_value.execute.side_effect = Exception("Database error")

        response = client.post(
            '/api/user/preferences',
            json={'last_edited_resume_id': TEST_RESUME_ID},
            headers=auth_headers
        )

        assert response.status_code == 500

    def test_preferences_with_empty_preferences_object(self, flask_test_client, auth_headers):
        """Verify empty preferences object is handled."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            '/api/user/preferences',
            json={
                'last_edited_resume_id': None,
                'preferences': {}
            },
            headers=auth_headers
        )

        assert response.status_code == 200

    def test_preferences_preserves_nested_objects(self, flask_test_client, auth_headers):
        """Verify nested objects in preferences are preserved."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        nested_prefs = {
            'ui_settings': {
                'theme': 'dark',
                'font_size': 14
            },
            'notifications': {
                'email': True,
                'push': False
            }
        }

        response = client.post(
            '/api/user/preferences',
            json={
                'last_edited_resume_id': TEST_RESUME_ID,
                'preferences': nested_prefs
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify nested structure is preserved
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        upsert_data = upsert_calls[0][0][0]
        assert upsert_data['preferences'] == nested_prefs
