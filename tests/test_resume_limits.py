"""
Tests for resume limit enforcement (5-resume limit per user).

Tests cover:
1. check_resume_limit function behavior
2. Create resume limit enforcement
3. Duplicate resume limit enforcement
4. Deleted resumes not counted

Run tests:
    pytest tests/test_resume_limits.py -v
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


class TestCheckResumeLimit:
    """Tests for the check_resume_limit helper function."""

    def test_check_resume_limit_returns_true_under_5(self, flask_test_client):
        """Verify can_create is True when user has less than 5 resumes."""
        client, mock_sb, flask_app = flask_test_client

        # Configure mock to return 3 resumes
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': '1'}, {'id': '2'}, {'id': '3'}], count=3
        )

        can_create, count = flask_app.check_resume_limit(TEST_USER_ID)

        assert can_create is True
        assert count == 3

    def test_check_resume_limit_returns_false_at_5(self, flask_test_client):
        """Verify can_create is False when user has exactly 5 resumes."""
        client, mock_sb, flask_app = flask_test_client

        # Configure mock to return 5 resumes
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(5)], count=5
        )

        can_create, count = flask_app.check_resume_limit(TEST_USER_ID)

        assert can_create is False
        assert count == 5

    def test_check_resume_limit_returns_true_at_0(self, flask_test_client):
        """Verify can_create is True when user has 0 resumes."""
        client, mock_sb, flask_app = flask_test_client

        # Configure mock to return 0 resumes
        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        can_create, count = flask_app.check_resume_limit(TEST_USER_ID)

        assert can_create is True
        assert count == 0

    def test_check_resume_limit_returns_true_at_4(self, flask_test_client):
        """Verify can_create is True when user has 4 resumes (boundary)."""
        client, mock_sb, flask_app = flask_test_client

        # Configure mock to return 4 resumes
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(4)], count=4
        )

        can_create, count = flask_app.check_resume_limit(TEST_USER_ID)

        assert can_create is True
        assert count == 4


class TestCreateResumeLimit:
    """Tests for resume limit enforcement on create endpoint."""

    def test_create_resume_fails_at_5_resumes(self, flask_test_client, auth_headers):
        """Verify creating resume fails when user already has 5 resumes."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return 5 existing resumes (at limit)
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(5)], count=5
        )

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons'},
            headers=auth_headers
        )

        assert response.status_code == 403
        data = response.get_json()
        assert data['success'] is False
        assert 'limit' in data['error'].lower()
        assert data['error_code'] == 'RESUME_LIMIT_REACHED'

    def test_create_resume_succeeds_under_limit(self, flask_test_client, auth_headers):
        """Verify creating resume succeeds when under limit."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses: check limit (3 resumes), insert, upsert prefs
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': str(i)} for i in range(3)], count=3),  # check limit
            create_mock_response([{'id': 'new-id'}]),  # insert
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons'},
            headers=auth_headers
        )

        assert response.status_code == 201


class TestDuplicateResumeLimit:
    """Tests for resume limit enforcement on duplicate endpoint."""

    def test_duplicate_resume_fails_at_5_resumes(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplicating resume fails when user already has 5 resumes."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return 5 existing resumes (at limit)
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(5)], count=5
        )

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy of Resume'},
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] is False
        assert 'limit' in data['error'].lower() or 'maximum' in data['error'].lower()

    def test_duplicate_resume_succeeds_under_limit(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplicating resume succeeds when under limit."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses: check limit, get source resume, insert, get icons, insert icons
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': str(i)} for i in range(3)], count=3),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy of Resume'},
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True


class TestDeletedResumesNotCounted:
    """Tests to verify deleted resumes are not counted in limit."""

    def test_deleted_resumes_not_counted_in_limit(self, flask_test_client, auth_headers):
        """Verify soft-deleted resumes don't count toward the 5-resume limit."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock: user has 4 active + some deleted (but query filters deleted)
        # The is_('deleted_at', 'null') filter means only 4 are returned
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': str(i)} for i in range(4)], count=4),  # check limit
            create_mock_response([{'id': 'new-id'}]),  # insert
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons'},
            headers=auth_headers
        )

        # Should succeed since only 4 non-deleted resumes
        assert response.status_code == 201

    def test_limit_check_uses_deleted_at_filter(self, flask_test_client):
        """Verify check_resume_limit query filters by deleted_at."""
        client, mock_sb, flask_app = flask_test_client

        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        flask_app.check_resume_limit(TEST_USER_ID)

        # Verify is_ was called with deleted_at filter
        is_calls = mock_sb.table.return_value.is_.call_args_list
        assert any('deleted_at' in str(call) for call in is_calls)


class TestSaveResumeLimit:
    """Tests for resume limit enforcement on save endpoint (new resume)."""

    def test_save_new_resume_fails_at_5_resumes(self, flask_test_client, auth_headers):
        """Verify saving a new resume fails when user already has 5 resumes."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return 5 existing resumes (at limit)
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(5)], count=5
        )

        response = client.post(
            '/api/resumes',
            json={
                'id': None,  # New resume
                'title': 'New Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John'},
                'sections': []
            },
            headers=auth_headers
        )

        assert response.status_code == 403
        data = response.get_json()
        assert data['success'] is False
        assert data['error_code'] == 'RESUME_LIMIT_REACHED'

    def test_save_existing_resume_succeeds_at_5_resumes(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify updating an existing resume succeeds even at limit."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock: verify existing resume, get icons, upsert, delete icons, upsert prefs
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete old icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,  # Existing resume
                'title': 'Updated Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John Updated'},
                'sections': []
            },
            headers=auth_headers
        )

        # Updating existing should succeed regardless of limit
        assert response.status_code == 200
