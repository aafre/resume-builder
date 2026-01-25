"""
Tests for resume CRUD operations.

Tests cover:
1. POST /api/resumes/create - Create new resume
2. GET /api/resumes - List user resumes
3. GET /api/resumes/<id> - Load specific resume
4. DELETE /api/resumes/<id> - Soft delete resume
5. PATCH /api/resumes/<id> - Update resume title

Run tests:
    pytest tests/test_resume_crud.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, OTHER_USER_ID, TEST_RESUME_ID
)


class TestCreateResume:
    """Tests for POST /api/resumes/create endpoint."""

    def test_create_resume_returns_201_with_resume_id(self, flask_test_client, auth_headers):
        """Verify creating a resume returns 201 with resume_id."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses: check_resume_limit, insert, upsert preferences
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=0),  # check_resume_limit - 0 resumes
            create_mock_response([{'id': 'new-resume-id'}]),  # insert resume
            create_mock_response([]),  # upsert preferences
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons'},
            headers=auth_headers
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['success'] is True
        assert 'resume_id' in data
        assert data['template_id'] == 'modern-with-icons'

    def test_create_resume_initializes_with_template_data(self, flask_test_client, auth_headers):
        """Verify resume is initialized with template data when load_example=True."""
        client, mock_sb, flask_app = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=0),  # check_resume_limit
            create_mock_response([{'id': 'new-resume-id'}]),  # insert resume
            create_mock_response([]),  # upsert preferences
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons', 'load_example': True},
            headers=auth_headers
        )

        assert response.status_code == 201

        # Verify insert was called with template data
        insert_call = mock_sb.table.return_value.insert.call_args
        assert insert_call is not None

    def test_create_resume_empty_structure_when_load_example_false(self, flask_test_client, auth_headers):
        """Verify resume has empty content when load_example=False."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=0),  # check_resume_limit
            create_mock_response([{'id': 'new-resume-id'}]),  # insert resume
            create_mock_response([]),  # upsert preferences
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons', 'load_example': False},
            headers=auth_headers
        )

        assert response.status_code == 201

        # Verify insert was called
        insert_call = mock_sb.table.return_value.insert.call_args
        assert insert_call is not None
        # The resume data should have empty contact_info fields
        resume_data = insert_call[0][0]
        assert resume_data['contact_info']['name'] == ''

    def test_create_resume_updates_last_edited_preference(self, flask_test_client, auth_headers):
        """Verify creating resume updates user's last_edited_resume_id preference."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        new_resume_id = 'new-resume-123'

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=0),  # check_resume_limit
            create_mock_response([{'id': new_resume_id}]),  # insert resume
            create_mock_response([]),  # upsert preferences
        ]

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'modern-with-icons'},
            headers=auth_headers
        )

        assert response.status_code == 201

        # Verify upsert was called for user_preferences
        upsert_calls = mock_sb.table.return_value.upsert.call_args_list
        # Should have at least one upsert call for preferences
        assert len(upsert_calls) >= 1

    def test_create_resume_default_template(self, flask_test_client, auth_headers):
        """Verify default template is used when not specified."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([], count=0),  # check_resume_limit
            create_mock_response([{'id': 'new-resume-id'}]),  # insert resume
            create_mock_response([]),  # upsert preferences
        ]

        response = client.post(
            '/api/resumes/create',
            json={},  # No template specified
            headers=auth_headers
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['template_id'] == 'modern-with-icons'  # Default

    def test_create_resume_invalid_template_returns_404(self, flask_test_client, auth_headers):
        """Verify invalid template returns 404."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock for resume limit check
        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        response = client.post(
            '/api/resumes/create',
            json={'template_id': 'nonexistent-template'},
            headers=auth_headers
        )

        assert response.status_code == 404


class TestListResumes:
    """Tests for GET /api/resumes endpoint."""

    def test_list_resumes_returns_only_user_resumes(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify listing returns only the authenticated user's resumes."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return user's resumes
        user_resumes = [
            {**sample_resume_data, 'id': 'resume-1'},
            {**sample_resume_data, 'id': 'resume-2'},
        ]
        mock_sb.table.return_value.execute.return_value = create_mock_response(user_resumes, count=2)

        response = client.get('/api/resumes', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert len(data['resumes']) == 2
        assert data['total_count'] == 2

    def test_list_resumes_excludes_soft_deleted(self, flask_test_client, auth_headers):
        """Verify soft-deleted resumes are excluded from listing."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Mock should already filter by is_('deleted_at', 'null')
        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        response = client.get('/api/resumes', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

        # Verify is_ was called with deleted_at filter
        is_calls = mock_sb.table.return_value.is_.call_args_list
        assert any('deleted_at' in str(call) for call in is_calls)

    def test_list_resumes_pagination_works(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify pagination parameters are respected."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [sample_resume_data], count=10
        )

        response = client.get('/api/resumes?limit=5&offset=5', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['limit'] == 5

        # Verify range was called for pagination
        range_calls = mock_sb.table.return_value.range.call_args_list
        assert len(range_calls) > 0

    def test_list_resumes_returns_correct_total_count(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify total_count reflects actual count, not just returned items."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return 2 items but total count is 10
        mock_sb.table.return_value.execute.return_value = create_mock_response(
            [sample_resume_data, sample_resume_data], count=10
        )

        response = client.get('/api/resumes?limit=2', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert len(data['resumes']) == 2
        assert data['total_count'] == 10

    def test_list_resumes_max_limit_enforced(self, flask_test_client, auth_headers):
        """Verify limit is capped at 50."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        response = client.get('/api/resumes?limit=100', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['limit'] == 50  # Capped at max


class TestLoadResume:
    """Tests for GET /api/resumes/<resume_id> endpoint."""

    def test_load_resume_returns_full_data(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify loading a resume returns full data including icons."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First call returns resume, second returns icons, third updates timestamp
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([sample_resume_data]),  # Resume query
            create_mock_response([{'filename': 'icon.png', 'storage_url': 'https://...'}]),  # Icons
            create_mock_response([]),  # Update timestamp
        ]

        response = client.get(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'resume' in data
        assert data['resume']['id'] == TEST_RESUME_ID
        assert 'icons' in data['resume']

    def test_load_resume_updates_last_accessed_at(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify loading updates last_accessed_at timestamp."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([sample_resume_data]),
            create_mock_response([]),  # Icons
            create_mock_response([]),  # Update
        ]

        response = client.get(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)

        assert response.status_code == 200

        # Verify update was called
        update_calls = mock_sb.table.return_value.update.call_args_list
        assert len(update_calls) > 0

    def test_load_resume_returns_404_for_nonexistent(self, flask_test_client, auth_headers):
        """Verify loading nonexistent resume returns 404."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty result
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.get('/api/resumes/nonexistent-id', headers=auth_headers)

        assert response.status_code == 404
        data = response.get_json()
        assert data['success'] is False

    def test_load_resume_returns_404_for_other_users_resume(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify cannot load another user's resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth for TEST_USER_ID
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty (query filters by user_id)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.get(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)

        assert response.status_code == 404


class TestDeleteResume:
    """Tests for DELETE /api/resumes/<resume_id> endpoint."""

    def test_delete_resume_soft_deletes(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify delete sets deleted_at timestamp (soft delete)."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First call verifies ownership, second performs update
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID}]),  # Verify ownership
            create_mock_response([]),  # Update (soft delete)
        ]

        response = client.delete(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

        # Verify update was called with deleted_at
        update_calls = mock_sb.table.return_value.update.call_args_list
        assert len(update_calls) > 0
        update_data = update_calls[0][0][0]
        assert 'deleted_at' in update_data

    def test_delete_resume_returns_404_for_nonexistent(self, flask_test_client, auth_headers):
        """Verify deleting nonexistent resume returns 404."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty (not found)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.delete('/api/resumes/nonexistent-id', headers=auth_headers)

        assert response.status_code == 404

    def test_delete_resume_idempotent(self, flask_test_client, auth_headers):
        """Verify double delete doesn't error (already deleted returns 404)."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First delete succeeds
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID}]),
            create_mock_response([]),
        ]

        response1 = client.delete(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)
        assert response1.status_code == 200

        # Second delete - already deleted, returns 404
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([]),  # Not found (is_('deleted_at', 'null') filter)
        ]

        response2 = client.delete(f'/api/resumes/{TEST_RESUME_ID}', headers=auth_headers)
        assert response2.status_code == 404


class TestUpdateResumeTitle:
    """Tests for PATCH /api/resumes/<resume_id> endpoint."""

    def test_update_title_succeeds(self, flask_test_client, auth_headers):
        """Verify updating title succeeds."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First verify ownership, then update
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID}]),  # Verify ownership
            create_mock_response([]),  # Update
        ]

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': 'New Title'},
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['title'] == 'New Title'

    def test_update_title_validates_max_length(self, flask_test_client, auth_headers):
        """Verify title max length (200 chars) is enforced."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        long_title = 'A' * 201  # Over 200 chars

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': long_title},
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'too long' in data['error'].lower()

    def test_update_title_rejects_empty(self, flask_test_client, auth_headers):
        """Verify empty title is rejected."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': ''},
            headers=auth_headers
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'empty' in data['error'].lower()

    def test_update_title_rejects_whitespace_only(self, flask_test_client, auth_headers):
        """Verify whitespace-only title is rejected."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': '   '},
            headers=auth_headers
        )

        assert response.status_code == 400

    def test_update_returns_404_for_deleted_resume(self, flask_test_client, auth_headers):
        """Verify cannot update deleted resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty (deleted resume filtered out)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': 'New Title'},
            headers=auth_headers
        )

        assert response.status_code == 404
