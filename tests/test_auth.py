"""
Tests for authentication and authorization.

Tests cover:
1. @require_auth decorator behavior
2. JWT token validation
3. Authorization checks (user can only access own resources)

Run tests:
    pytest tests/test_auth.py -v
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, OTHER_USER_ID, TEST_RESUME_ID
)


class TestAuthenticationDecorator:
    """Tests for the @require_auth decorator."""

    def test_missing_auth_header_returns_401(self, flask_test_client):
        """Verify endpoint returns 401 when Authorization header is missing."""
        client, mock_sb, _ = flask_test_client

        # Call protected endpoint without auth header
        response = client.get('/api/resumes')

        assert response.status_code == 401
        data = response.get_json()
        assert data['success'] is False
        assert 'Unauthorized' in data['error'] or 'Missing' in data['error']

    def test_invalid_bearer_format_returns_401(self, flask_test_client):
        """Verify endpoint returns 401 when Authorization header has wrong format."""
        client, mock_sb, _ = flask_test_client

        # Test without 'Bearer ' prefix
        response = client.get(
            '/api/resumes',
            headers={'Authorization': 'invalid-token'}
        )

        assert response.status_code == 401
        data = response.get_json()
        assert data['success'] is False

    def test_expired_token_returns_401(self, flask_test_client, auth_headers):
        """Verify endpoint returns 401 when JWT token is expired."""
        client, mock_sb, _ = flask_test_client

        # Configure mock to raise expired token error
        mock_sb.auth.get_user.side_effect = Exception("Token has expired")

        response = client.get('/api/resumes', headers=auth_headers)

        assert response.status_code == 401
        data = response.get_json()
        assert data['success'] is False
        assert 'expired' in data['error'].lower() or 'invalid' in data['error'].lower()

    def test_invalid_token_returns_401(self, flask_test_client, auth_headers):
        """Verify endpoint returns 401 when JWT token is invalid."""
        client, mock_sb, _ = flask_test_client

        # Configure mock to raise invalid token error
        mock_sb.auth.get_user.side_effect = Exception("Invalid JWT signature")

        response = client.get('/api/resumes', headers=auth_headers)

        assert response.status_code == 401
        data = response.get_json()
        assert data['success'] is False
        assert 'invalid' in data['error'].lower() or 'expired' in data['error'].lower()

    def test_valid_token_sets_user_id_on_request(self, flask_test_client, auth_headers):
        """Verify valid token sets request.user_id correctly."""
        client, mock_sb, _ = flask_test_client

        # Configure mock to return valid user
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty resumes list
        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        response = client.get('/api/resumes', headers=auth_headers)

        # Should succeed with valid token
        assert response.status_code == 200

        # Verify get_user was called with the token
        mock_sb.auth.get_user.assert_called_once()

    def test_supabase_unavailable_returns_503(self, auth_headers):
        """Verify endpoint returns 503 when Supabase is not configured."""
        with patch.dict('sys.modules', {'supabase': MagicMock()}):
            import app as flask_app

            # Set supabase to None to simulate unavailable
            with patch.object(flask_app, 'supabase', None):
                flask_app.app.config['TESTING'] = True
                with flask_app.app.test_client() as client:
                    response = client.get('/api/resumes', headers=auth_headers)

                    assert response.status_code == 503
                    data = response.get_json()
                    assert data['success'] is False
                    assert 'not configured' in data['error'].lower()


class TestAuthorization:
    """Tests for authorization checks (user access control)."""

    def test_user_can_only_access_own_resumes(self, flask_test_client, auth_headers):
        """Verify user cannot access another user's resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth for TEST_USER_ID
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty (no resume found for this user)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        # Try to access a resume (would belong to different user)
        response = client.get(
            f'/api/resumes/{TEST_RESUME_ID}',
            headers=auth_headers
        )

        assert response.status_code == 404
        data = response.get_json()
        assert data['success'] is False
        assert 'not found' in data['error'].lower()

    def test_user_can_access_own_resumes(self, flask_test_client, auth_headers, sample_resume_data):
        """Verify user can access their own resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # First call returns resume data, second returns icons
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([sample_resume_data]),  # Resume query
            create_mock_response([]),  # Icons query
            create_mock_response([]),  # Update last_accessed_at
        ]

        response = client.get(
            f'/api/resumes/{TEST_RESUME_ID}',
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['resume']['id'] == TEST_RESUME_ID

    def test_user_cannot_access_deleted_resumes(self, flask_test_client, auth_headers):
        """Verify user cannot access soft-deleted resumes."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty (deleted_at is not null filter excludes)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.get(
            f'/api/resumes/{TEST_RESUME_ID}',
            headers=auth_headers
        )

        assert response.status_code == 404
        data = response.get_json()
        assert data['success'] is False

    def test_user_cannot_delete_others_resume(self, flask_test_client, auth_headers):
        """Verify user cannot delete another user's resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth for TEST_USER_ID
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty (no resume found for this user)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.delete(
            f'/api/resumes/{TEST_RESUME_ID}',
            headers=auth_headers
        )

        assert response.status_code == 404

    def test_user_cannot_update_others_resume(self, flask_test_client, auth_headers):
        """Verify user cannot update another user's resume title."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth for TEST_USER_ID
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty (no resume found for this user)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.patch(
            f'/api/resumes/{TEST_RESUME_ID}',
            json={'title': 'Hacked Title'},
            headers=auth_headers
        )

        assert response.status_code == 404


class TestAuthEdgeCases:
    """Tests for authentication edge cases."""

    def test_empty_bearer_token_returns_401(self, flask_test_client):
        """Verify empty Bearer token returns 401 when auth fails."""
        client, mock_sb, _ = flask_test_client

        # Configure mock to fail for empty/invalid token
        mock_sb.auth.get_user.side_effect = Exception("Invalid JWT token")

        response = client.get(
            '/api/resumes',
            headers={'Authorization': 'Bearer '}
        )

        assert response.status_code == 401

    def test_auth_error_logging_includes_context(self, flask_test_client, auth_headers, caplog):
        """Verify auth errors are logged with proper context."""
        client, mock_sb, _ = flask_test_client

        # Configure mock to raise error
        mock_sb.auth.get_user.side_effect = Exception("Auth service unavailable")

        # This should log the error with endpoint and method context
        response = client.get('/api/resumes', headers=auth_headers)

        assert response.status_code == 401
        # Verify the error was logged
        assert any('Auth service unavailable' in record.message or 'error' in record.message.lower()
                   for record in caplog.records)

    def test_multiple_sequential_auth_requests_succeed(self, flask_test_client, auth_headers):
        """Verify multiple sequential requests each authenticate independently."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)
        mock_sb.table.return_value.execute.return_value = create_mock_response([], count=0)

        # Make multiple sequential requests
        response1 = client.get('/api/resumes', headers=auth_headers)
        response2 = client.get('/api/resumes', headers=auth_headers)

        # Both should succeed independently
        assert response1.status_code == 200
        assert response2.status_code == 200
