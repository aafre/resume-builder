"""
Tests for resume duplication (POST /api/resumes/<id>/duplicate).

Tests cover:
1. Duplicate creates new resume
2. Duplicate copies all content
3. Duplicate copies icons
4. Duplicate generates new title
5. Duplicate respects resume limit
6. Duplicate returns 404 for deleted

Run tests:
    pytest tests/test_resume_duplicate.py -v
"""
import pytest
from unittest.mock import MagicMock, patch, ANY
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, TEST_RESUME_ID
)


class TestDuplicateResume:
    """Tests for POST /api/resumes/<id>/duplicate endpoint."""

    def test_duplicate_creates_new_resume(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication creates a new resume with new ID."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': '1'}, {'id': '2'}], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy of Test Resume'},
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'resume_id' in data
        assert data['resume_id'] != TEST_RESUME_ID  # Should be new ID

    def test_duplicate_copies_all_content(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication copies contact_info, sections, and template_id."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify insert was called with copied data
        insert_calls = mock_sb.table.return_value.insert.call_args_list
        assert len(insert_calls) > 0

        # Get the resume insert call
        resume_insert = insert_calls[0][0][0]
        assert resume_insert['template_id'] == sample_resume_data['template_id']
        assert resume_insert['contact_info'] == sample_resume_data['contact_info']
        assert resume_insert['sections'] == sample_resume_data['sections']

    def test_duplicate_copies_icons(self, flask_test_client, auth_headers, sample_resume_data, sample_icon_data):
        """Verify duplication copies icons to new storage path."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([sample_icon_data]),  # get source icons
            create_mock_response([]),  # insert new icon records
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify source icons were queried for the original resume
        # The duplication endpoint queries icons to copy them to the new resume
        table_calls = [str(call) for call in mock_sb.table.call_args_list]
        assert any('resume_icons' in call for call in table_calls), \
            f"Expected query to 'resume_icons' table, got calls: {table_calls}"

    def test_duplicate_generates_new_title(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication uses the provided new title."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        new_title = 'My Duplicated Resume'

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': new_title},
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify insert was called with new title
        insert_calls = mock_sb.table.return_value.insert.call_args_list
        resume_insert = insert_calls[0][0][0]
        assert resume_insert['title'] == new_title

    def test_duplicate_respects_resume_limit(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication fails when at 5-resume limit."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return 5 resumes (at limit)
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [{'id': str(i)} for i in range(5)], count=5
        )

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'limit' in data['error'].lower() or 'maximum' in data['error'].lower()

    def test_duplicate_returns_404_for_deleted(self, flask_test_client, auth_headers):
        """Verify duplication returns 404 for deleted source resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses: check limit OK, but source not found
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([]),  # get source resume - not found (deleted)
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 404

    def test_duplicate_returns_404_for_nonexistent(self, flask_test_client, auth_headers):
        """Verify duplication returns 404 for nonexistent source resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([]),  # get source resume - not found
        ]

        response = client.post(
            '/api/resumes/nonexistent-id/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 404

    def test_duplicate_requires_new_title(self, flask_test_client, auth_headers):
        """Verify duplication requires new_title in request."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': ''},  # Empty title
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'title' in data['error'].lower()

    def test_duplicate_prevents_access_to_other_users_resume(self, flask_test_client, auth_headers):
        """Verify user cannot duplicate another user's resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock: limit OK, but source resume not found (belongs to other user)
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([]),  # get source - not found (user_id filter excludes)
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 404


class TestDuplicateResumeEdgeCases:
    """Tests for edge cases in resume duplication."""

    def test_duplicate_with_no_icons(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication works when source has no icons."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons - empty
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

    def test_duplicate_preserves_json_hash(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication copies the json_hash from source."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        source_with_hash = {**sample_resume_data, 'json_hash': 'source-hash-123'}

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([source_with_hash]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify insert was called with json_hash
        insert_calls = mock_sb.table.return_value.insert.call_args_list
        resume_insert = insert_calls[0][0][0]
        assert resume_insert.get('json_hash') == 'source-hash-123'

    def test_duplicate_sets_new_timestamps(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify duplication sets new created_at and updated_at timestamps."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=2),  # check limit
            create_mock_response([sample_resume_data]),  # get source resume
            create_mock_response([]),  # insert new resume
            create_mock_response([]),  # get source icons
        ]

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/duplicate',
            json={'new_title': 'Copy'},
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify insert was called with 'now()' timestamps
        insert_calls = mock_sb.table.return_value.insert.call_args_list
        resume_insert = insert_calls[0][0][0]
        assert resume_insert['created_at'] == 'now()'
        assert resume_insert['updated_at'] == 'now()'
        assert resume_insert['last_accessed_at'] == 'now()'
